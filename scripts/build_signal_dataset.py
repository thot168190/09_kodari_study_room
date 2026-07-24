import urllib.request
import urllib.parse
import json
import time
import statistics
import csv

ingredients = [
    "melatonin", "turmeric", "ashwagandha", "berberine", "collagen", 
    "milk thistle", "magnesium", "omega-3", "probiotics", "vitamin D", 
    "zinc", "NAC", "CoQ10", "glutathione", "lutein", 
    "saw palmetto", "garcinia", "green tea extract", "spirulina", "chlorella", 
    "maca", "rhodiola", "ginseng", "MSM", "glucosamine", 
    "chondroitin", "hyaluronic acid", "biotin", "folate", "iron", 
    "calcium", "L-theanine", "GABA", "5-HTP", "creatine", 
    "beta-alanine", "quercetin", "resveratrol", "apple cider vinegar", "psyllium"
]

def fetch_openfda(ing):
    url = f'https://api.fda.gov/drug/event.json?search=patient.drug.medicinalproduct:"{urllib.parse.quote(ing)}"&limit=1'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data.get('meta', {}).get('results', {}).get('total', 0)
    except urllib.error.HTTPError as e:
        if e.code == 404:
            url_fb = f'https://api.fda.gov/drug/event.json?search=patient.drug.medicinalproduct:{urllib.parse.quote(ing)}&limit=1'
            req_fb = urllib.request.Request(url_fb, headers={'User-Agent': 'Mozilla/5.0'})
            try:
                with urllib.request.urlopen(req_fb) as resp_fb:
                    data_fb = json.loads(resp_fb.read().decode('utf-8'))
                    return data_fb.get('meta', {}).get('results', {}).get('total', 0)
            except Exception:
                return 0
        elif e.code == 429:
            time.sleep(5)
            return fetch_openfda(ing)
        return 0
    except Exception as e:
        return 0

def fetch_europepmc(ing, pub_type):
    query_str = f'"{ing}" AND PUB_TYPE:"{pub_type}"'
    url = f'https://www.ebi.ac.uk/europepmc/webservices/rest/search?query={urllib.parse.quote(query_str)}&format=json'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data.get('hitCount', 0)
    except urllib.error.HTTPError as e:
        if e.code == 429:
            time.sleep(5)
            return fetch_europepmc(ing, pub_type)
        return 0
    except Exception as e:
        return 0

results = []

print("=== Starting Fetching 40 Ingredients Data ===")

for i, ing in enumerate(ingredients, 1):
    adv_cnt = fetch_openfda(ing)
    time.sleep(0.2)
    
    trial_cnt = fetch_europepmc(ing, "Clinical Trial")
    time.sleep(0.2)
    
    rev_cnt = fetch_europepmc(ing, "systematic review")
    time.sleep(0.2)
    
    total_ev = trial_cnt + rev_cnt
    print(f"[{i:02d}/40] {ing:<20} | Adverse: {adv_cnt:>7,} | Trials: {trial_cnt:>5,} | Reviews: {rev_cnt:>5,} (Ev Total: {total_ev:>6,})")
    
    results.append({
        'ingredient': ing,
        'adverse_report_count': adv_cnt,
        'clinical_trial_count': trial_cnt,
        'review_count': rev_cnt,
        'total_evidence': total_ev
    })

# Compute medians
adv_list = [r['adverse_report_count'] for r in results]
ev_list = [r['total_evidence'] for r in results]

M_adv = statistics.median(adv_list)
M_ev = statistics.median(ev_list)

print(f"\n=== Medians ===")
print(f"Adverse Median (M_adv): {M_adv}")
print(f"Evidence Median (M_ev): {M_ev}")

# Assign Quadrants
for r in results:
    adv = r['adverse_report_count']
    ev = r['total_evidence']
    
    if adv >= M_adv and ev < M_ev:
        r['quadrant'] = 'RED'
    elif adv < M_adv and ev >= M_ev:
        r['quadrant'] = 'GREEN'
    elif adv >= M_adv and ev >= M_ev:
        r['quadrant'] = 'YELLOW'
    else:
        r['quadrant'] = 'GRAY'

# Write to signal_dataset.csv
csv_path = '/Users/mihyunlee/나는 1인기업 대표/코부장 프로젝트/09_코다리_공부방/signal_dataset.csv'
with open(csv_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['ingredient', 'adverse_report_count', 'clinical_trial_count', 'review_count', 'quadrant'])
    for r in results:
        writer.writerow([
            r['ingredient'],
            r['adverse_report_count'],
            r['clinical_trial_count'],
            r['review_count'],
            r['quadrant']
        ])

print(f"\nSuccessfully saved {len(results)} rows to {csv_path}")
