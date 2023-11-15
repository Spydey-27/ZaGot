'''
First, install the latest release of Python wrapper: $ pip install ovh
'''
import json
import ovh
import sys
arguments = sys.argv

if len(arguments) > 1:
    domain = arguments[1]
else:
	print("Usage: python3 domain.py <domain>")
	sys.exit(1)

# Instanciate an OVH Client.
client = ovh.Client(
	endpoint='ovh-eu',               # Endpoint of API OVH (List of available endpoints: https://github.com/ovh/python-ovh#2-configure-your-application)
	application_key='63570d489d051861',    # Application Key
	application_secret='d989475290c9b745c0d1a3e7c17bf913', # Ap**********************plication Secret
	consumer_key='64ac9ba74bbc3b3580d7a94140d1dac1',       # Consumer Key
)

# Request body type: domain.zone.RecordCreate
result = client.post("/domain/zone/vsnu.fr/record",
	fieldType = "A", #  (type: )
	subDomain = domain, # Record subDomain (type: string)
	target = "82.65.60.141", # Target of the record (type: string)
	ttl = 0, # TTL of the record (type: integer)
)
result = client.get("/domain/zone/vsnu.fr/record")

print(json.dumps(result, indent=4))

