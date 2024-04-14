'use client';

import {
	Engine,
	SelectedPart,
	TuningPart,
	TuningSetup,
} from '@/@types/calculator';
import { calculateBestSetup, getFullPartByName } from '@/modules/common';
import { CalculatorContext } from '@/modules/contexts';
import { UpdateSelectedPartsEvent } from '@/modules/customEvents';
import {
	ChangeEvent,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import AutoGenModalInitScreen from './autoGenModalInitialScreen';
import AutoGenModalLoading from './autoGenModalLoading';
import AutoGenModalSetupScreen from './autoGenModalSetupScreen';

type AutoGenModalProps = {
	id: string;
};

const generateSetup = (currentEngine: Engine, targetIncrease: number) => {
	if (!currentEngine) return null;

	const tunedCompatibleParts = currentEngine.compatibleParts
		.map((part) => ({ ...part, tunedPart: getFullPartByName(part.name) }))
		.filter((part) => part.tunedPart);

	// The cost and boost are multiplied by quantity here to make
	// calculations easier in calculateBestSetup method.
	return calculateBestSetup(
		tunedCompatibleParts.map<TuningPart>((part) => ({
			...(part.tunedPart as TuningPart),
			cost: part.tunedPart.cost * part.quantity,
			boost: part.tunedPart.boost * part.quantity,
		})),
		targetIncrease,
	);
};

export default function AutoGenModal({ id }: AutoGenModalProps) {
	const { currentEngine } = useContext(CalculatorContext);

	const [isLoading, setIsLoading] = useState(false);
	const [targetIncrease, setTargetIncrease] = useState(0);
	const [generatedSetup, setGeneratedSetup] = useState(
		null as TuningSetup | null,
	);
	const [hasGeneratedSetup, setHasGeneratedSetup] = useState(false);

	const handleTargetChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setTargetIncrease(~~e.currentTarget.value);
			setHasGeneratedSetup(false);
		},
		[],
	);

	const close = useCallback(() => {
		(document.getElementById(id) as HTMLDialogElement)?.close();
		setTargetIncrease(0);
	}, [id]);

	const handleGenerate = useCallback(() => {
		setIsLoading(true);

		const setup = currentEngine
			? generateSetup(currentEngine, targetIncrease)
			: null;

		setGeneratedSetup(setup);
		setHasGeneratedSetup(true);

		setIsLoading(false);
	}, [currentEngine, targetIncrease]);

	const handleApply = useCallback(() => {
		setIsLoading(true);

		if (currentEngine && generatedSetup) {
			UpdateSelectedPartsEvent.dispatch(
				currentEngine.compatibleParts
					.filter((part) =>
						generatedSetup.partNames.includes(part.name),
					)
					.map<SelectedPart>((part) => ({
						name: part.name,
						quantity: part.quantity,
					})),
			);
		}

		setIsLoading(false);
		setHasGeneratedSetup(false);
		setGeneratedSetup(null);
		close();
	}, [generatedSetup, currentEngine, close]);

	const handleDiscard = useCallback(() => {
		setHasGeneratedSetup(false);
		setGeneratedSetup(null);
	}, []);

	const getScreen = useCallback(() => {
		if (isLoading) return <AutoGenModalLoading />;

		if (hasGeneratedSetup)
			return (
				<AutoGenModalSetupScreen
					generatedSetup={generatedSetup ?? undefined}
					onApply={handleApply}
					onDiscard={handleDiscard}
				/>
			);

		return (
			<AutoGenModalInitScreen
				targetIncrease={targetIncrease}
				onTargetChange={handleTargetChange}
				onGenerate={handleGenerate}
			/>
		);
	}, [
		isLoading,
		hasGeneratedSetup,
		targetIncrease,
		handleTargetChange,
		generatedSetup,
		handleGenerate,
		handleApply,
		handleDiscard,
	]);

	useEffect(() => {
		setHasGeneratedSetup(false);
		setGeneratedSetup(null);
	}, [currentEngine]);

	if (!currentEngine) return;

	return (
		<dialog id={id} className='modal' onClose={close}>
			<div className='modal-box w-11/12 max-w-7xl'>
				<form method='dialog'>
					<button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
						✕
					</button>
				</form>
				<h3 className='font-bold text-lg'>Auto-generation</h3>
				{getScreen()}
			</div>
		</dialog>
	);
}
