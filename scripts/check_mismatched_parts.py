import json

parts_from_engines = set()

engine_names = set()

with open ('./data/engines.json') as engines_file:
	engines_data = json.load(engines_file)
	engine_names = set(engines_data.keys())
	for engine_name in engines_data.keys():
		engine = engines_data[engine_name]
		for part in engine['compatibleParts']:
			parts_from_engines.add(part['name'])

parts_from_parts = set()

with open ('./data/tuning-parts.json') as parts_file:
	parts_data = json.load(parts_file)

	for part_name in parts_data.keys():
		parts_from_parts.add(part_name)
  
engines_with_specific_parts = set()

for part in parts_from_parts:
	for engine_name in engine_names:
		if engine_name in part:
			engines_with_specific_parts.add(engine_name)

engines_without_specific_parts = engine_names - engines_with_specific_parts

print(engines_without_specific_parts)

for part in parts_from_engines:

	ignore_part = False
	
	for engine_name in engines_without_specific_parts:
		if engine_name in part:
			ignore_part = True
			break

	if ignore_part:
		continue

	if part not in parts_from_parts:
		print(part)