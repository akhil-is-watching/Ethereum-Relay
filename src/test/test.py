import concurrent.futures
import json
import requests
import sys

data = {
  "to": "0xa65309c4a9398946A86862Dee81f05Cde9a3958D",
  "value": "1",
  "maxFeePerGas": "200000000000",
  "maxPriorityFeePerGas": "100000000000"
}

headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}

def post_request(url):
    response = requests.post(url, data=json.dumps(data), headers=headers)
    return response

count = 0;
with concurrent.futures.ThreadPoolExecutor() as executor:
    # Use map to send the requests concurrently
    results = [executor.submit(post_request, 'http://13.235.59.109:1337/transaction/sendTransaction') for _ in range(int(sys.argv[1]))]

    for f in concurrent.futures.as_completed(results):
        try:
            response = f.result()
            print(count)
            count += 1
        except Exception as e:
            print("Error: ", e)
