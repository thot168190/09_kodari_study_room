import urllib.request
import json
import time

seeds = ["melatonin", "turmeric", "collagen", "berberine", "ashwagandha"]

for seed in seeds:
    url = f'https://api.fda.gov/drug/event.json?search=patient.drug.medicinalproduct:"{urllib.parse.quote(seed)}"&limit=1'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            total = data.get('meta', {}).get('results', {}).get('total', 0)
            print(f"{seed}: {total}")
    except Exception as e:
        print(f"{seed}: ERROR {e}")
    time.sleep(0.5)
