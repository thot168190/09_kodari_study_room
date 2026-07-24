import urllib.request
import urllib.parse
import json
import time

seeds = ["melatonin", "turmeric", "collagen", "berberine", "ashwagandha"]

for seed in seeds:
    q_trial = f'"{seed}" AND PUB_TYPE:"Clinical Trial"'
    q_review = f'"{seed}" AND PUB_TYPE:"systematic review"'
    
    url_trial = f'https://www.ebi.ac.uk/europepmc/webservices/rest/search?query={urllib.parse.quote(q_trial)}&format=json'
    url_review = f'https://www.ebi.ac.uk/europepmc/webservices/rest/search?query={urllib.parse.quote(q_review)}&format=json'
    
    cnt_trial = 0
    cnt_review = 0
    
    req1 = urllib.request.Request(url_trial, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req1) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        cnt_trial = data.get('hitCount', 0)
        
    time.sleep(0.5)
    
    req2 = urllib.request.Request(url_review, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req2) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        cnt_review = data.get('hitCount', 0)
        
    print(f"{seed} -> trial: {cnt_trial}, review: {cnt_review}")
    time.sleep(0.5)
