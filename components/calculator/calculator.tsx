'use client';

import { Engine, SelectedPart } from '@/@types/calculator';
import { CalculatorContext } from '@/modules/contexts';
import { useEffect, useState } from 'react';
import EngineCard from '../engineCard/engineCard';
import { ChangeEngineEvent } from '@/modules/customEvents';

export default function Calculator() {

	const [currentEngine, setCurrentEngine] = useState(null as Engine | null);
	const [selectedParts, setSelectedParts] = useState([] as SelectedPart[]);

	useEffect(() => {
		const handleChangeEngine = (e: Event) => {
			setCurrentEngine((e as CustomEvent).detail ?? null);
		};

		window.addEventListener(ChangeEngineEvent.name, handleChangeEngine);

		return () => {
			window.removeEventListener(ChangeEngineEvent.name, handleChangeEngine);
		};
	}, []);

	return (
		<CalculatorContext.Provider
			value={{
				currentEngine,
				selectedParts,
			}}
		>
			<div className='grid grid-flow-row grid-rows-2 grid-cols-5 gap-8 m-8'>
				<EngineCard />
			</div>
		</CalculatorContext.Provider>
	);
}