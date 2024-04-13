'use client';

import { Engine, SelectedPart } from '@/@types/calculator';
import { CalculatorContext } from '@/modules/contexts';
import { useEffect, useState } from 'react';
import {
	ChangeEngineEvent,
	ToggleSelectedPartEvent,
	ToggleSelectedPartEventInit,
	UpdateSelectedPartsEvent,
} from '@/modules/customEvents';
import { BasePropsWithChildren } from '@/@types/globals';

export default function CalculatorWrapper({ children }: BasePropsWithChildren) {
	const [currentEngine, setCurrentEngine] = useState(null as Engine | null);
	const [selectedParts, setSelectedParts] = useState([] as SelectedPart[]);

	useEffect(() => {
		const handleChangeEngine = (e: Event) => {
			setCurrentEngine((e as CustomEvent<Engine | null>).detail);
		};

		const handleToggleSelectedPart = (e: Event) => {
			const ev = e as CustomEvent<ToggleSelectedPartEventInit>;

			if (ev.detail.toggleOn) {
				setSelectedParts((prev) => [...prev, ev.detail.part]);
			} else {
				setSelectedParts((prev) =>
					prev.filter((part) => part.name !== ev.detail.part.name),
				);
			}
		};

		const handleUpdateSelectedParts = (e: Event) => {
			setSelectedParts((e as CustomEvent<SelectedPart[]>).detail);
		};

		window.addEventListener(ChangeEngineEvent.name, handleChangeEngine);
		window.addEventListener(
			ToggleSelectedPartEvent.name,
			handleToggleSelectedPart,
		);
		window.addEventListener(
			UpdateSelectedPartsEvent.name,
			handleUpdateSelectedParts,
		);

		return () => {
			window.removeEventListener(
				ChangeEngineEvent.name,
				handleChangeEngine,
			);
			window.removeEventListener(
				ToggleSelectedPartEvent.name,
				handleToggleSelectedPart,
			);
			window.addEventListener(
				UpdateSelectedPartsEvent.name,
				handleUpdateSelectedParts,
			);
		};
	}, []);

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
