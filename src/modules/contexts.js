import { createContext } from 'react';

export const CalculatorContext = createContext({
	currentEngine: null,
	setCurrentEngine: () => console.log('setCurrentEngine'),
});