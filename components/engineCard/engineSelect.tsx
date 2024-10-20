'use client';

import { Engine, EngineName } from '@/@types/calculator';
import engines from '../../data/engines.json';
import { ChangeEvent, useCallback, useContext } from 'react';
import { CalculatorContext } from '@/modules/contexts';
import { ChangeEngineEvent } from '@/modules/customEvents';
import { BaseProps } from '@/@types/globals';

const handleEngineChange = ({ target }: ChangeEvent<HTMLSelectElement>) => {
	const engineName = target.value as EngineName;
	ChangeEngineEvent.dispatch(
		structuredClone(engines[engineName as EngineName]) as Engine,
	);
};

const Options = () => {
	return (
		<>
			<option>-- None --</option>
			{Object.keys(engines)
				.slice(1)
				.map((option) => (
					<option key={option}>{option}</option>
				))}
		</>
	);
};

export default function EngineSelect({ className }: BaseProps) {
	const { currentEngine } = useContext(CalculatorContext);

	const getClassName = useCallback(
		() => (className ? ` ${className}` : ''),
		[className],
	);

	return (
		<select
			className={`select select-bordered w-full${getClassName()}`}
			value={currentEngine?.name ?? ''}
			onChange={handleEngineChange}
			aria-label="Select engine"
		>
			<Options />
		</select>
	);
}
