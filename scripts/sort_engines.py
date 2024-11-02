import json

sorted_engines_data = {}

with open('./data/engines.json', 'r') as engines_file:
	engines_data = json.load(engines_file)

	for engine_name in sorted(engines_data.keys()):
		sorted_engines_data[engine_name] = engines_data[engine_name]

json_object = json.dumps(sorted_engines_data, indent=2)
with open('./data/engines.json', 'w') as engines_file:
	engines_file.write(json_object)