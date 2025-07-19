'use client';

import { Engine, EngineName } from '@/@types/calculator';
import engines from '../../data/engines.json';
import { ChangeEvent, useCallback, useContext, useState } from 'react';
import { CalculatorContext } from '@/modules/contexts';
import { ChangeEngineEvent } from '@/modules/customEvents';
import { BaseProps } from '@/@types/globals';
import { ENGINE_CONFIGURATIONS } from '@/modules/common';

const handleEngineChange = ({ target }: ChangeEvent<HTMLSelectElement>) => {
	const engineName = target.value as EngineName;
	ChangeEngineEvent.dispatch(
		structuredClone(engines[engineName as EngineName]) as Engine,
	);
};

const EngineConfigOptions = () => {
	return (
		<>
			<option value="">Any</option>
			{ENGINE_CONFIGURATIONS.map((option) => (
				<option key={option}>{option}</option>
			))}
		</>
	);
};

export default function EngineSelect({ className }: BaseProps) {
	const { currentEngine } = useContext(CalculatorContext);
	const [engineConfig, setEngineConfig] = useState('');

	const handleEngineConfigChange = ({
		target,
	}: ChangeEvent<HTMLSelectElement>) => {
		setEngineConfig(target.value);

		if (!target.value) {
			return;
		}

		ChangeEngineEvent.dispatch(
			structuredClone(
				Object.values(engines).find(
					(engine) => engine.specs.configuration === target.value,
				) ?? null,
			) as Engine | null,
		);
	};

	const EngineOptions = () => {
		return (
			<>
				{!engineConfig && <option>-- None --</option>}
				{Object.keys(engines)
					.filter(
						(key) =>
							!engineConfig ||
							engines[key as EngineName].specs.configuration ===
								engineConfig,
					)
					.map((option) => (
						<option key={option}>{option}</option>
					))}
			</>
		);
	};

	const getClassName = useCallback(
		() => (className ? ` ${className}` : ''),
		[className],
	);

	return (
		<div className={getClassName()}>
			<label className="select xl:select-md w-full">
				<span className="label">Configuration</span>
				<select
					value={engineConfig}
					onChange={handleEngineConfigChange}
				>
					<EngineConfigOptions />
				</select>
			</label>

			<label className="select mt-3 xl:select-md w-full">
				<span className="label">Engine</span>
				<select
					value={currentEngine?.name ?? ''}
					onChange={handleEngineChange}
				>
					<EngineOptions />
				</select>
			</label>
		</div>
	);
}
