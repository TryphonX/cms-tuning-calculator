/** @module contexts */
import { createContext } from 'react';
import './types.js';

/**
 * The React.Context used for transferring data between calculator components.
 * @type {React.Context}
 * @prop {Nullable<Engine>} currentEngine
 * @prop {SelectedPart[]} selectedParts
 */
export const CalculatorContext = createContext({
	currentEngine: null,
	selectedParts: [{ name: 'engine part', quantity: 0 }],
});