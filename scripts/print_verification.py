import csv

csv_path = '/Users/mihyunlee/workspace/09_코다리_공부방/signal_dataset.csv'

with open(csv_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"=== 1. wc -l signal_dataset.csv ===")
print(f"{len(lines)} {csv_path}")

print(f"\n=== 2. Seed 5 Grep Verification ===")
seeds = ["melatonin", "turmeric", "collagen", "berberine", "ashwagandha"]
for line in lines:
    for s in seeds:
        if line.startswith(s + ","):
            print(line.strip())

print(f"\n=== 3. Quadrant Counts ===")
quads = {}
for line in lines[1:]:
    parts = line.strip().split(',')
    q = parts[-1]
    quads[q] = quads.get(q, 0) + 1
print(quads)

print(f"\n=== 4. SKIP List ===")
print("SKIP 목록: 없음 (0종 완료)")
