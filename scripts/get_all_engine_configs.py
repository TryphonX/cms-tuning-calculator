import json

electric_configs = ['CHRG-eE1', 'Proton', 'eDen-1H']
engine_configs = set()

with open('./data/engines.json') as engines_file:
	engines_data = json.load(engines_file)

	for engine_name in engines_data.keys():
		engine_config = engine_name.split(' ')[0] if engine_name.split(' ')[0] not in electric_configs else 'Electric'
		engine_configs.add(engine_config)
		engines_data[engine_name]['specs']['configuration'] = engine_config

json_object = json.dumps(engines_data, indent=2)
with open('./data/engines.json', 'w') as engines_file:
	engines_file.write(json_object)

engine_configs = sorted(engine_configs)
print(engine_configs)