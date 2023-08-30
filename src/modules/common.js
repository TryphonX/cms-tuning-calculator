/** @module common */
import enginesFromFile from './engines.json';
import './types.jsdoc';

// get deep clone and clear the template
delete enginesFromFile.template;
/**
 * The list of all engines included in the app.
 * @type {Engine}
 */
export const engines  = structuredClone(enginesFromFile);

/**
 * Compares two objects based on their name property.
 * @method
 * @param {{name: string}} a - Represents the first object being compared based on its name property.
 * @param {{name: string}} b - Represents the second object being compared.
 */
export const compareBasedOnName = (a, b) => {
	if ( a.name < b.name ){
		return -1;
	}
	if ( a.name > b.name ){
		return 1;
	}
	return 0;
};