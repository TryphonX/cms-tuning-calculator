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
import { ChangeEvent, useCallback, useContext, useState } from 'react';
import {
	FaArrowRotateLeft,
	FaArrowsRotate,
	FaWandMagicSparkles,
} from 'react-icons/fa6';

type AutoGenModalProps = {
	id: string;
};

type AutoGenModalInitScreenProps = {
	handleTargetChange: (e: ChangeEvent<HTMLInputElement>) => void;
	targetIncrease: number;
	handleGenerate: () => void;
};

function AutoGenModalInitScreen({
	handleTargetChange,
	targetIncrease,
	handleGenerate,
}: AutoGenModalInitScreenProps) {
	return (
		<>
			<p className='py-4'>
				Auto-generation will show you the optimal setup for the target
				boost increase.
			</p>
			<p className='py-4'>Choose your target boost increase:</p>
			<div className='w-full flex justify-between'>
				<span>0%</span>
				<span>100%</span>
			</div>
			<input
				type='range'
				min='0'
				max='100'
				defaultValue={targetIncrease}
				onChange={handleTargetChange}
				className='range range-primary'
			/>
			<div className='w-full flex justify-end text-right'>
				<div className='flex flex-col text-accent'>
					<span>Target Increase: {targetIncrease}%</span>
				</div>
			</div>
			<div className='modal-action'>
				<button className='btn btn-primary' onClick={handleGenerate}>
					<FaWandMagicSparkles /> Generate
				</button>
			</div>
		</>
	);
}

function AutoGenLoading() {
	return (
		<div className='text-center mt-8'>
			<span className='loading loading-infinity w-40 text-primary'></span>
		</div>
	);
}

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

type AutoGenModalSetupScreenProps = {
	generatedSetup?: TuningSetup;
	onApply: () => void;
	onDiscard: () => void;
};

function AutoGenModalSetupScreen({
	generatedSetup,
	onApply,
	onDiscard,
}: AutoGenModalSetupScreenProps) {
	console.log(generatedSetup);

	if (!generatedSetup) return;

	return (
		<div>
			<div className='my-4 overflow-x-auto w-full border rounded-2xl border-base-200'>
				<table className='table table-md sm:table-lg table-zebra'>
					<tbody>
						<tr>
							<th>Boost</th>
							<td>{generatedSetup.boost}%</td>
						</tr>
						<tr>
							<th>Cost</th>
							<td>{generatedSetup.cost} CR</td>
						</tr>
						<tr>
							<th>Cost / Boost</th>
							<td>
								{generatedSetup.costToBoost.toFixed(2)} CR /
								Boost
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className='justify-between modal-action'>
				<button className='btn btn-neutral' onClick={onDiscard}>
					<FaArrowRotateLeft /> Discard
				</button>
				<button className='btn btn-primary' onClick={onApply}>
					<FaArrowsRotate /> Apply changes
				</button>
			</div>
		</div>
	);
}

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
		if (isLoading) return <AutoGenLoading />;

		console.log(hasGeneratedSetup, generatedSetup);

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
				handleTargetChange={handleTargetChange}
				handleGenerate={handleGenerate}
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
