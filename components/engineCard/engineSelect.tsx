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
			<option>-- None --</option>
			{ENGINE_CONFIGURATIONS.map((option) => (
				<option key={option}>{option}</option>
			))}
		</>
	);
};

export default function EngineSelect({ className }: BaseProps) {
	const { currentEngine } = useContext(CalculatorContext);
	const [engineConfig, setEngineConfig] = useState('-- None --');

	const handleEngineConfigChange = ({
		target,
	}: ChangeEvent<HTMLSelectElement>) => {
		setEngineConfig(target.value);
		console.log(target.value);
	};

	const EngineOptions = () => {
		return (
			<>
				<option>-- None --</option>
				{Object.keys(engines)
					.filter(
						(key) =>
							engineConfig == '-- None --' ||
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
			<label className="form-control">
				<div className="label-text">
					Configuration{' '}
					<span className="text-xs text-base-content text-opacity-70">
						*Optional
					</span>
				</div>
				<select
					className="select select-bordered w-full xl:select-sm"
					value={engineConfig}
					onChange={handleEngineConfigChange}
				>
					<EngineConfigOptions />
				</select>
			</label>
			<select
				className="select select-bordered w-full mt-3 xl:select-sm"
				value={currentEngine?.name ?? ''}
				onChange={handleEngineChange}
				aria-label="Select engine"
			>
				<EngineOptions />
			</select>
		</div>
	);
}
