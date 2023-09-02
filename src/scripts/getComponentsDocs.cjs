const fs = require('fs');
const componentsData = require('../../docs/json/components.json');

let text = '';

const parseType = (typeObj) => {

	if (typeObj.name === 'union') {
		const typesArr = [];

		typeObj.value.forEach(val => {
			
			if (val.name === 'arrayOf') {
				typesArr.push(`${val.value.name}[]`);
			}
			else {
				typesArr.push(val.name);
			}
		});

		return typesArr.join(' \\| ');
	}
	else return typeObj.name;
};

for (const path in componentsData) {
	if (Object.hasOwnProperty.call(componentsData, path)) {
		
		const comp = componentsData[path][0];

		const folders = path.replace('.', '').replace('/src/', '').split('/');

		folders.pop();

		const category = folders.join(' > ');
		
		const [description, ...examples] = comp.description.split('@example');

		text += `## ${comp.displayName}\n\n`;
		text += category ? `\`${category}\`\n\n` : '\n\n';
		text += `${description || 'No description provided'}\n`;

		if (examples && examples.length) {

			const exampleBlocks = [];
			
			examples.forEach(example => {

				const exampleLines = example.split('\n');

				const exampleName = exampleLines[0].indexOf(' ') === 0 && exampleLines[0].trim()?
					exampleLines.shift().trim() : 'Example';

				if (exampleLines[0].trim().length < 1) exampleLines.shift();
				if (exampleLines[exampleLines.length - 1].trim().length < 1) exampleLines.pop();
			
				exampleBlocks.push(
					`### ${exampleName}\n\n` +
					'```jsx\n' + exampleLines.join('\n') + '\n```',
				);
			});

			text += exampleBlocks.join('\n\n');
		}
		

		if (Object.hasOwnProperty.call(comp, 'props')) {
			const propData = Object.keys(comp.props).map(propName => ({
				displayName: propName,
				type: parseType(comp.props[propName].type),
				description: comp.props[propName].description
					.split('@method')[0]
					.replace('\n', ' '),
				required: comp.props[propName].required,
			}));

			text +=
			'\n### Props:\n\n' +
			'Name | Type | Description | Required\n' +
			'---- | ---- | ----------- | :------:\n' +
			`${propData.map(data => `${data.displayName} | ${data.type} | ${data.description} | ${data.required ? '✅' : '❌'}`).join('\n')}\n`;
		}
	}
}

fs.writeFileSync('./docs/COMPONENTS.md', text);