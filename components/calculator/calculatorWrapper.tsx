'use client';

import { Engine, SelectedPart } from '@/@types/calculator';
import { CalculatorContext } from '@/modules/contexts';
import { useEffect, useState } from 'react';
import { ChangeEngineEvent, ToggleSelectedPartEvent, UpdateSelectedPartsEvent } from '@/modules/customEvents';
import { BasePropsWithChildren } from '@/@types/globals';

export default function CalculatorWrapper({ children }: BasePropsWithChildren) {

	const [currentEngine, setCurrentEngine] = useState(null as Engine | null);
	const [selectedParts, setSelectedParts] = useState([] as SelectedPart[]);

	useEffect(() => {
		const handleChangeEngine = (e: Event) => {
			setCurrentEngine((e as CustomEvent).detail ?? null);
		};

		const handleToggleSelectedPart = (e: Event) => {
			const eventPart = (e as CustomEvent).detail.part as SelectedPart;
			const toggleOn = (e as CustomEvent).detail.toggleOn as boolean;

			if (toggleOn) {
				setSelectedParts((prev) => [...prev, eventPart]);
			}
			else {
				setSelectedParts((prev) => prev.filter((part) => part.name !== eventPart.name));
			}
		};

		const handleUpdateSelectedParts = (e: Event) => {
			setSelectedParts((e as CustomEvent).detail);
		};

		window.addEventListener(ChangeEngineEvent.name, handleChangeEngine);
		window.addEventListener(ToggleSelectedPartEvent.name, handleToggleSelectedPart);
		window.addEventListener(UpdateSelectedPartsEvent.name, handleUpdateSelectedParts);

		return () => {
			window.removeEventListener(ChangeEngineEvent.name, handleChangeEngine);
			window.removeEventListener(ToggleSelectedPartEvent.name, handleToggleSelectedPart);
			window.addEventListener(UpdateSelectedPartsEvent.name, handleUpdateSelectedParts);
		};
	}, []);

	useEffect(() => {
		console.log(selectedParts);
	}, [selectedParts]);

	return (
		<CalculatorContext.Provider
			value={{
				currentEngine,
				selectedParts,
			}}
		>
			{children}
		</CalculatorContext.Provider>
	);
}