import os
import torch
import json
import argparse
from datasets import Dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training

# Prompt Template을 정의하여 학습 시 데이터 포맷 통일
SYSTEM_PROMPT = "당신은 1인 창업가를 위한 비즈니스 니치 발굴기 판정 시스템입니다. 아이디어 서술을 읽고 니치 스코어링 결과를 JSON 형식으로 반환하십시오."

def format_instruction(sample):
    user_input = sample["rawInput"]
    response_json = {
        "name": sample["name"],
        "pain": sample["pain"],
        "data": sample["data"],
        "wheel": sample["wheel"],
        "competitor": sample["competitor"],
        "veto": sample["veto"],
        "ragStart": sample["ragStart"],
        "domainSkill": sample["domainSkill"],
        "desc": sample["desc"]
    }
    
    text = f"<|im_start|>system\n{SYSTEM_PROMPT}<|im_end|>\n"
    text += f"<|im_start|>user\n{user_input}<|im_end|>\n"
    text += f"<|im_start|>assistant\n{json.dumps(response_json, ensure_ascii=False)}<|im_end|>"
    return {"text": text}

def main():
    parser = argparse.ArgumentParser(description="소형 언어모델(SLM)에 DoRA(Weight-Decomposed LoRA) 적용하여 파인튜닝하는 스크립트")
    parser.add_argument("--model_id", type=str, default="Qwen/Qwen2.5-1.5B-Instruct", help="베이스로 사용할 Hugging Face 모델 ID")
    parser.add_argument("--dataset_path", type=str, default="niche_synthetic_dataset.json", help="합성 데이터셋 파일 경로")
    parser.add_argument("--output_dir", type=str, default="./niche_dora_model", help="학습된 DoRA 모델 어댑터 저장 위치")
    parser.add_argument("--epochs", type=int, default=3, help="학습 Epoch 수")
    parser.add_argument("--batch_size", type=int, default=4, help="훈련 배치 사이즈")
    parser.add_argument("--lr", type=float, default=2e-4, help="학습률(Learning Rate)")
    args = parser.parse_args()

    print(f"[*] 데이터셋 로드 중: {args.dataset_path}")
    if not os.path.exists(args.dataset_path):
        print(f"[-] 에러: '{args.dataset_path}' 파일이 존재하지 않습니다. 먼저 generate_niche_dataset.py를 구동해 데이터셋을 만드십시오.")
        return

    with open(args.dataset_path, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    # Dataset 객체 생성 및 포맷 변환
    dataset = Dataset.from_list(raw_data)
    dataset = dataset.map(format_instruction, remove_columns=dataset.column_names)

    print(f"[*] 토크나이저 및 모델(4비트 양자화) 로드 중: {args.model_id}")
    tokenizer = AutoTokenizer.from_pretrained(args.model_id)
    tokenizer.pad_token = tokenizer.eos_token

    # 4비트 양자화로 로드하여 에지/로컬 서버 부담 최소화 (QLoRA/QDoRA 세팅)
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.bfloat16,
        bnb_4bit_use_double_quant=True
    )

    model = AutoModelForCausalLM.from_pretrained(
        args.model_id,
        quantization_config=bnb_config,
        device_map="auto"
    )

    # 양자화 모델 훈련 준비
    model = prepare_model_for_kbit_training(model)

    # ⚡ DoRA (Weight-Decomposed LoRA) 설정의 핵심! ⚡
    peft_config = LoraConfig(
        r=16,
        lora_alpha=32,
        # Qwen 모델의 어텐션 및 MLP 레이어 타겟팅
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
        use_dora=True  # ⚡ use_dora=True로 설정 시 DoRA 알고리즘이 활성화됩니다!
    )

    print("[*] 모델에 DoRA 어댑터 결합 중...")
    model = get_peft_model(model, peft_config)
    model.print_trainable_parameters()

    # 데이터 토크나이징 함수
    def tokenize_function(examples):
        return tokenizer(examples["text"], truncation=True, max_length=512)

    tokenized_dataset = dataset.map(tokenize_function, batched=True, remove_columns=["text"])

    # 학습 아규먼트 설정
    training_args = TrainingArguments(
        output_dir=args.output_dir,
        num_train_epochs=args.epochs,
        per_device_train_batch_size=args.batch_size,
        gradient_accumulation_steps=4,
        learning_rate=args.lr,
        logging_steps=10,
        save_strategy="epoch",
        fp16=False,
        bf16=True, # bfloat16 지원 그래픽카드 기준 (RTX 3090/4090 등)
        optim="paged_adamw_8bit",
        lr_scheduler_type="cosine",
        warmup_ratio=0.03,
        report_to="none"
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset,
        data_collator=DataCollatorForLanguageModeling(tokenizer, mlm=False)
    )

    print("[*] DoRA 학습을 시작합니다! (딴청 피우지 않고 열일 중)")
    trainer.train()

    # 학습 완료된 어댑터 가중치 저장
    print(f"[+] 성공! DoRA 튜닝이 완료되었습니다. 모델이 '{args.output_dir}'에 성공적으로 저장되었습니다.")
    model.save_pretrained(args.output_dir)
    tokenizer.save_pretrained(args.output_dir)

if __name__ == "__main__":
    main()
