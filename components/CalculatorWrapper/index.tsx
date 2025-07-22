'use client';

import { Engine, SelectedPart, TuningSetup } from '@/@types/calculator';
import { CalculatorContext } from '@/modules/contexts';
import { useEffect, useState } from 'react';
import {
	ChangeEngineEvent,
	UnlockEvent,
	SetRepairsEvent,
	ToggleSelectedPartEvent,
	ToggleSelectedPartEventInit,
	UpdateSelectedPartsEvent,
} from '@/modules/customEvents';
import { BasePropsWithChildren } from '@/@types/globals';

export default function CalculatorWrapper({ children }: BasePropsWithChildren) {
	const [currentEngine, setCurrentEngine] = useState(null as Engine | null);
	const [selectedParts, setSelectedParts] = useState([] as SelectedPart[]);
	const [locked, setLocked] = useState(false);
	const [repairs, setRepairs] = useState<TuningSetup['repairs']>(undefined);

	// onMount
	useEffect(() => {
		const handleChangeEngine = (e: Event) => {
			setCurrentEngine((e as CustomEvent<Engine | null>).detail);
			setSelectedParts([]);
		};

		const handleToggleSelectedPart = (e: Event) => {
			const ev = e as CustomEvent<ToggleSelectedPartEventInit>;

			if (ev.detail.toggleOn) {
				setSelectedParts((prev) => {
					// Remove any existing part with the same name first
					const filtered = prev.filter(
						(part) => part.name !== ev.detail.part.name,
					);
					return [...filtered, ev.detail.part];
				});
			} else {
				setSelectedParts((prev) =>
					prev.filter((part) => part.name !== ev.detail.part.name),
				);
			}
		};

		const handleUpdateSelectedParts = (e: Event) => {
			setSelectedParts((e as CustomEvent<SelectedPart[]>).detail);
		};

		const handleUnlock = () => {
			setLocked(false);
			setRepairs(undefined);
		};

		const handleSetRepairs = (e: Event) => {
			const newRepairs = (e as CustomEvent<TuningSetup['repairs']>)
				.detail;
			if (newRepairs) {
				setLocked(true);
			} else {
				setLocked(false);
			}
			setRepairs(newRepairs);
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
		window.addEventListener(UnlockEvent.name, handleUnlock);
		window.addEventListener(SetRepairsEvent.name, handleSetRepairs);

		return () => {
			window.removeEventListener(
				ChangeEngineEvent.name,
				handleChangeEngine,
			);
			window.removeEventListener(
				ToggleSelectedPartEvent.name,
				handleToggleSelectedPart,
			);
			window.removeEventListener(
				UpdateSelectedPartsEvent.name,
				handleUpdateSelectedParts,
			);
			window.removeEventListener(UnlockEvent.name, handleUnlock);
			window.removeEventListener(SetRepairsEvent.name, handleSetRepairs);
		};
	}, []);

	return (
		<CalculatorContext.Provider
			value={{
				currentEngine,
				selectedParts,
				locked,
				repairs,
			}}
		>
			{children}
		</CalculatorContext.Provider>
	);
}
