import { ChangeEvent } from 'react';
import { FaWandMagicSparkles } from 'react-icons/fa6';

type AutoGenModalInitScreenProps = {
	onTargetChange: (e: ChangeEvent<HTMLInputElement>) => void;
	targetIncrease: number;
	onGenerate: () => void;
};

export default function AutoGenModalInitScreen({
	onTargetChange,
	targetIncrease,
	onGenerate,
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
				onChange={onTargetChange}
				className='range range-primary'
			/>
			<div className='w-full flex justify-end text-right'>
				<div className='flex flex-col text-accent'>
					<span>Target Increase: {targetIncrease}%</span>
				</div>
			</div>
			<div className='modal-action'>
				<button className='btn btn-primary' onClick={onGenerate}>
					<FaWandMagicSparkles /> Generate
				</button>
			</div>
		</>
	);
}
