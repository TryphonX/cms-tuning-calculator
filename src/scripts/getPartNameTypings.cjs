const parts = require('../modules/tuning-parts.json');
const fs = require('fs');

const partTypingStrings = Object.keys(parts).map(partName =>
	`\t/**\n\t * ${partName}\n\t */\n` +
	`\t${partName
		.replace(/\)/g, '')
		.replace(/\W(\w)?/g, (_, letter) => letter?.toUpperCase())
	}: '${partName}',`,
);

const partEnum = '/**\n * @enum {string} Part names\n */\n' +
`export const PartName = {\n\n${partTypingStrings.join('\n')}\n};\n\n`;

fs.writeFileSync('./src/modules/part.js', partEnum);