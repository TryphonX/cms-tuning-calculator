const engines = require('../modules/engines.json');
const fs = require('fs');

delete engines.template;

const engineNameTypingStrings = Object.keys(engines).map(engineName =>
	`\t/**\n\t * ${engineName}\n\t */\n` +
	`\t${engineName
		.replace(/[\s-](\w)?/g, (_, letter) => letter.toUpperCase())
	}: '${engineName}',`,
);

const engineEnum = '/**\n * @enum {string} Engine names\n */\n' +
`export const EngineName = {\n\n${engineNameTypingStrings.join('\n')}\n};\n\n`;

fs.writeFileSync('./src/modules/engine.js', engineEnum);