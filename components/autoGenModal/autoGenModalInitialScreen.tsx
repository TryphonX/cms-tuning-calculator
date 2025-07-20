import { ChangeEvent } from 'react';
import { FaWandMagicSparkles } from 'react-icons/fa6';
import RepairPartsTable from './RepairPartsTable.tsx';
import { RepairParts } from '@/@types/calculator.js';

type AutoGenModalInitScreenProps = {
	onTargetChange: (e: ChangeEvent<HTMLInputElement>) => void;
	targetIncrease: number;
	onGenerate: () => void;
	onRepairPartsChange: (parts: RepairParts) => void;
	repairParts: RepairParts;
};

export default function AutoGenModalInitScreen({
	onTargetChange,
	targetIncrease,
	onGenerate,
	onRepairPartsChange,
	repairParts,
}: AutoGenModalInitScreenProps) {
	return (
		<>
			<p className="py-4">
				Auto-generation will show you the optimal setup for the target
				boost increase.
			</p>

			<RepairPartsTable
				onRepairPartsChange={onRepairPartsChange}
				repairParts={repairParts}
			/>

			<label>
				<p className="py-4">Choose your target boost increase:</p>
				<input
					id="autoGenTargetInput"
					type="range"
					min="0"
					max="100"
					defaultValue={targetIncrease}
					onChange={onTargetChange}
					className="range range-primary w-full"
				/>
			</label>
			<div className="flex justify-between px-2.5 mt-2 text-xs">
				{Array.from({ length: 101 }, (_, i) => {
					if (i % 10 === 0) {
						return (
							<span
								key={i}
								className={`text-xs${
									i % 20 !== 0 ? ' max-sm:hidden' : ''
								}`}
								aria-hidden
							>
								{i}%
							</span>
						);
					}
				})}
			</div>
			<div className="w-full flex justify-end text-right">
				<div className="flex flex-col text-primary mt-4">
					<span>Target Increase: {targetIncrease}%</span>
				</div>
			</div>
			<div className="modal-action">
				<button className="btn btn-primary" onClick={onGenerate}>
					<FaWandMagicSparkles /> Generate
				</button>
			</div>
		</>
	);
}
