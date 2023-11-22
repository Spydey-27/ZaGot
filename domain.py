
import json
import ovh
import sys
import os
arguments = sys.argv

if len(arguments) > 1:
    domain = arguments[1]
else:
	print("Usage: python3 domain.py <domain>")
	sys.exit(1)

# Instanciate an OVH Client.
client = ovh.Client(
	endpoint='ovh-eu',               # Endpoint of API OVH (List of available endpoints: https://github.com/ovh/python-ovh#2-configure-your-application)
	application_key=os.getenv("APPLICATION_KEY"),    # Application Key
	application_secret=os.getenv("APPLICATION_SECRET"), # Ap**********************plication Secret
	consumer_key=os.getenv("CONSUMER_KEY"),       # Consumer Key
)

# Request body type: domain.zone.RecordCreate
result = client.post("/domain/zone/vsnu.fr/record",
	fieldType = "A", #  (type: )
	subDomain = "file."+domain, # Record subDomain (type: string)
	target = "82.65.60.141", # Target of the record (type: string)
	ttl = 0, # TTL of the record (type: integer)
)

result = client.post("/domain/zone/vsnu.fr/record",
	fieldType = "A", #  (type: )
	subDomain = "memo."+domain, # Record subDomain (type: string)
	target = "82.65.60.141", # Target of the record (type: string)
	ttl = 0, # TTL of the record (type: integer)
)

result = client.post("/domain/zone/vsnu.fr/record",
	fieldType = "A", #  (type: )
	subDomain = "code."+domain, # Record subDomain (type: string)
	target = "82.65.60.141", # Target of the record (type: string)
	ttl = 0, # TTL of the record (type: integer)
)

record_id = result.get('id', None)

if record_id is not None:
    # Save the record ID and subdomain to the same file
    with open('record_id.txt', 'a') as file:
        file.write(f"{domain} {record_id}\n")

print(json.dumps(result, indent=4))
client.post("/domain/zone/vsnu.fr/refresh")


