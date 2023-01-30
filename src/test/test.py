import concurrent.futures
import json
import requests

data = {
  "to": "0xa65309c4a9398946A86862Dee81f05Cde9a3958D",
  "value": "1",
  "gasLimit": "21000",
  "maxFeePerGas": "6000000000",
  "maxPriorityFeePerGas": "6000000000"
}

headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}

def post_request(url):
    response = requests.post(url, data=json.dumps(data), headers=headers)
    return response

with concurrent.futures.ThreadPoolExecutor() as executor:
    # Use map to send the requests concurrently
    results = [executor.submit(post_request, 'http://localhost:1337/transaction/sendTransaction') for _ in range(500)]

    for f in concurrent.futures.as_completed(results):
        try:
            response = f.result()
            print(response.status_code)
        except Exception as e:
            print("Error: ", e)
