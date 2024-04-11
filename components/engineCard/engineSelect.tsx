'use client';

import { EngineName } from '@/@types/calculator';
import engines from '../../data/engines.json';
import { ChangeEvent, useContext } from 'react';
import { CalculatorContext } from '@/modules/contexts';
import { ChangeEngineEvent } from '@/modules/customEvents';
import { BaseProps } from '@/@types/globals';

export default function EngineSelect(esProps: BaseProps) {

	const { currentEngine } = useContext(CalculatorContext);

	const getClassName = () => esProps.className ? ` ${esProps.className}` : '';

	const handleEngineChange = ({ target }: ChangeEvent<HTMLSelectElement>) => {

		const engineName = target.value as EngineName;
		ChangeEngineEvent.dispatch(structuredClone(engines[engineName]));
	};

	const Options = () => {

		return (
			<>
				<option>-- None --</option>
				{
					Object.keys(engines).slice(1).map((option) => (
						<option key={option}>{option}</option>
					))
				}
			</>
		);
	};

	return (
		<select className={`select select-bordered w-full select-sm${getClassName()}`}
			value={currentEngine?.name ?? ''}
			onChange={handleEngineChange}
		>
			<Options />
		</select>
	);
}