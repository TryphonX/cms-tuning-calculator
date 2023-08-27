const parts = require('../modules/tuning-parts-v3.json');
const fs = require('fs');

const partTypingStrings = parts.map(part =>
	`\t/**\n\t * ${part.partName}\n\t */\n` +
	`\tstatic ${part.partName
		.replace(/\)/g, '')
		.replace(/\W/g, '_')
		.toUpperCase()} = '${part.partName}';`,
);

const partsClass = `export class Part {\n\n${partTypingStrings.join('\n')}\n}`;

fs.writeFileSync('./src/modules/part.js', partsClass);