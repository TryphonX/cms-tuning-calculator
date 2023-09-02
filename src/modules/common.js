/** @module common */
import enginesFromFile from './engines.json';
import tuningParts from './tuning-parts.json';
import './types.js';

// get deep clone and clear the template
delete enginesFromFile.template;
/**
 * The list of all engines included in the app.
 * @type {Engine}
 */
export const engines  = structuredClone(enginesFromFile);

/**
 * @enum {string} Sort modes for parts
 */
export const PartSortBy = {
	NameAsc: 'name_asc',
	NameDesc: 'name_desc',
	QuantityAsc: 'quantity_asc',
	QuantityDesc: 'quantity_desc',
	CostAsc: 'cost_asc',
	CostDesc: 'cost_desc',
	BoostAsc: 'boost_asc',
	BoostDesc: 'boost_desc',
	CostToBoostAsc: 'costToBoost_asc',
	CostToBoostDesc: 'costToBoost_desc',
};

/**
 * Returns a comparison function based on the given `sortBy` parameter.
 * @method
 * @param {string} sortBy - The value that determines the sorting order for a list of parts.
 * @returns {CompareFunction}
 */
export const getCompareFn = (sortBy) => {
	
	switch (sortBy) {
	case PartSortBy.NameAsc:
		return compareNamesAsc;

	case PartSortBy.NameDesc:
		return compareNamesDesc;

	case PartSortBy.QuantityAsc:
		return compareQtAsc;

	case PartSortBy.QuantityDesc:
		return compareQtDesc;
	
	case PartSortBy.CostAsc:
		return compareCostAsc;

	case PartSortBy.CostDesc:
		return compareCostDesc;

	case PartSortBy.BoostAsc:
		return compareBoostAsc;

	case PartSortBy.BoostDesc:
		return compareBoostDesc;

	case PartSortBy.CostToBoostAsc:
		return compareCostToBoostAsc;

	case PartSortBy.CostToBoostDesc:
		return compareCostToBoostDesc;
	
	default:
		return compareNamesAsc;
	}
};

/**
 * Returns the tuned part based on the given part name.
 * @method
 * @param {string} partName - A string representing the name of a tuning part.
 * @returns {TuningPart | undefined}
 */
export const getTunedPartByName = (partName) => tuningParts[partName];

/**
 * Compares two objects based on their name property (ascending).
 * @type {CompareFunction}
 * @param {{name: string}} a - Represents the first object being compared based on its name property.
 * @param {{name: string}} b - Represents the second object being compared.
 */
const compareNamesAsc = (a, b) => {
	if (a.name < b.name) {
		return -1;
	}
	if (a.name > b.name) {
		return 1;
	}
	return 0;
};

/**
 * Compares two objects based on their name property (descending).
 * @type {CompareFunction}
 * @param {{name: string}} a - Represents the first object being compared based on its name property.
 * @param {{name: string}} b - Represents the second object being compared.
 */
const compareNamesDesc = (a, b) => {
	if (a.name < b.name) {
		return 1;
	}
	if (a.name > b.name) {
		return -1;
	}
	return 0;
};

/**
 * Compares two objects based on their quantity property (ascending).
 * @type {CompareFunction}
 * @param {{quantity: string}} a - Represents the first object being compared based on its quantity property.
 * @param {{quantity: string}} b - Represents the second object being compared.
 */
const compareQtAsc = (a, b) => {

	if (a.quantity < b.quantity) {
		return -1;
	}
	if (a.quantity > b.quantity) {
		return 1;
	}
	return 0;
};

/**
 * Compares two objects based on their quantity property (descending).
 * @type {CompareFunction}
 * @param {{quantity: string}} a - Represents the first object being compared based on its quantity property.
 * @param {{quantity: string}} b - Represents the second object being compared.
 */
const compareQtDesc = (a, b) => {
	if (a.quantity < b.quantity) {
		return 1;
	}
	if (a.quantity > b.quantity) {
		return -1;
	}
	return 0;
};

/**
 * Compares two objects based on their tuned part version's cost property (ascending).
 * @type {CompareFunction}
 * @param {{name: string}} a - Represents the first object being compared based on its name property.
 * @param {{name: string}} b - Represents the second object being compared.
 */
const compareCostAsc = (a, b) => {

	const [partA, partB] = [getTunedPartByName(a.name), getTunedPartByName(b.name)];

	if (partA?.cost < partB?.cost) {
		return -1;
	}
	if (partA?.cost > partB?.cost) {
		return 1;
	}
	return 0;
};

/**
 * Compares two objects based on their tuned part version's cost property (descending).
 * @type {CompareFunction}
 * @param {{name: string}} a - Represents the first object being compared based on its name property.
 * @param {{name: string}} b - Represents the second object being compared.
 */
const compareCostDesc = (a, b) => {

	const [partA, partB] = [getTunedPartByName(a.name), getTunedPartByName(b.name)];

	if (partA?.cost < partB?.cost) {
		return 1;
	}
	if (partA?.cost > partB?.cost) {
		return -1;
	}
	return 0;
};

/**
 * Compares two objects based on their tuned part version's boost property (ascending).
 * @type {CompareFunction}
 * @param {{name: string}} a - Represents the first object being compared based on its name property.
 * @param {{name: string}} b - Represents the second object being compared.
 */
const compareBoostAsc = (a, b) => {

	const [partA, partB] = [getTunedPartByName(a.name), getTunedPartByName(b.name)];

	if (partA?.boost < partB?.boost) {
		return -1;
	}
	if (partA?.boost > partB?.boost) {
		return 1;
	}
	return 0;
};

/**
 * Compares two objects based on their tuned part version's boost property (descending).
 * @type {CompareFunction}
 * @param {{name: string}} a - Represents the first object being compared based on its name property.
 * @param {{name: string}} b - Represents the second object being compared.
 */
const compareBoostDesc = (a, b) => {
	compareBoostDesc;
	const [partA, partB] = [getTunedPartByName(a.name), getTunedPartByName(b.name)];

	if (partA?.boost < partB?.boost) {
		return 1;
	}
	if (partA?.boost > partB?.boost) {
		return -1;
	}
	return 0;
};

/**
 * Compares two objects based on their tuned part version's costToBoost property (ascending).
 * @type {CompareFunction}
 * @param {{name: string}} a - Represents the first object being compared based on its name property.
 * @param {{name: string}} b - Represents the second object being compared.
 */
const compareCostToBoostAsc = (a, b) => {

	const [partA, partB] = [getTunedPartByName(a.name), getTunedPartByName(b.name)];

	if (partA?.costToBoost < partB?.costToBoost) {
		return -1;
	}
	if (partA?.costToBoost > partB?.costToBoost) {
		return 1;
	}
	return 0;
};

/**
 * Compares two objects based on their tuned part version's costToBoost property (descending).
 * @type {CompareFunction}
 * @param {{name: string}} a - Represents the first object being compared based on its name property.
 * @param {{name: string}} b - Represents the second object being compared.
 */
const compareCostToBoostDesc = (a, b) => {

	const [partA, partB] = [getTunedPartByName(a.name), getTunedPartByName(b.name)];

	if (partA?.costToBoost < partB?.costToBoost) {
		return 1;
	}
	if (partA?.costToBoost > partB?.costToBoost) {
		return -1;
	}
	return 0;
};