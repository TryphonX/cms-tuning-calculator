import enginesFromFile from './engines.json';

// get deep clone and clear the template
delete enginesFromFile.template;
export const engines  = structuredClone(enginesFromFile);

/**
 * Just a test function for whatever
 */
export const test = () => console.log(Object.entries(enginesFromFile)[0], Object.entries(engines)[0]);