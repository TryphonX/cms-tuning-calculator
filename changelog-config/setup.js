const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const getCommitTitle = (subject) => {
	const title = subject.split(': ')[1];

	return capitalizeFirstLetter(title);
};

const getCommitBody = (message, subject) => {
	const body = message.replace(subject, '').trim();

	return capitalizeFirstLetter(body);
};

const getLastRelease = (releases, options) =>  options.fn(releases[0]);

module.exports = (Handlebars) => {
	Handlebars.registerHelper('getTitle', getCommitTitle);

	Handlebars.registerHelper('getBody', getCommitBody);

	Handlebars.registerHelper('lastRelease', getLastRelease);
};