const engines = require('../modules/engines.json');
const fs = require('fs');

delete engines.template;

const partTypingStrings = Object.keys(engines).map(engineName =>
	`\t/**\n\t * ${engineName}\n\t */\n` +
	`\tstatic ${engineName
		.replace(/\W/g, '_')
		.toUpperCase()} = '${engineName}';`,
);

const engineClass = `export class Engine {\n\n${partTypingStrings.join('\n')}\n}`;

fs.writeFileSync('./src/modules/engine.js', engineClass);