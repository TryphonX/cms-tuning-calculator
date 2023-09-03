/** @module contexts */
import { createContext } from 'react';
import './types.js';

/**
 * The React.Context used for transferring data between calculator components.
 * @typedef {React.Context} CalculatorContext
 * @prop {Engine | null} currentEngine
 * @prop {SelectedPart[]} selectedParts
 */
export const CalculatorContext = createContext({
	/**
	 * @type {Engine | null}
	 */
	currentEngine: null,
	selectedParts: [{ name: 'engine part', quantity: 0 }],
});