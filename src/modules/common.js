import enginesFromFile from './engines.json';

// get deep clone and clear the template
delete enginesFromFile.template;
export const engines  = structuredClone(enginesFromFile);

/**
 * Just a test function for whatever
 */
export const test = () => console.log(Object.entries(enginesFromFile)[0], Object.entries(engines)[0]);

/**
 * Compares two objects based on their name property.
 * @note Used for sorting.
 * @param {{name: string}} a 
 * @param {{name: string}} b 
 */
export const compareBasedOnName = ( a, b ) => {
	if ( a.name < b.name ){
		return -1;
	}
	if ( a.name > b.name ){
		return 1;
	}
	return 0;
};