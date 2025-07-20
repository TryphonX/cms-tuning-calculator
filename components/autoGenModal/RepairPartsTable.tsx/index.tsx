import { CompatiblePart, RepairParts } from '@/@types/calculator';
import { partSortFn } from '@/modules/common';
import { CalculatorContext } from '@/modules/contexts';
import { useContext, useEffect, useRef } from 'react';

interface RangeInputProps {
	repairParts: RepairParts;
	onRepairPartsChange: (parts: RepairParts) => void;
	part: CompatiblePart;
}

const RangeInput = ({
	part,
	repairParts,
	onRepairPartsChange,
}: RangeInputProps) => {
	const id = `rangeInput-${part.name.replaceAll(' ', '-')}`;
	const ref = useRef<HTMLInputElement>(null);

	return (
		<>
			<label className="sr-only" htmlFor={id}>
				How many to be repaired of this part?
			</label>
			<div
				className="max-sm:tooltip max-sm:tooltip-primary w-full"
				data-tip={ref.current?.value}
			>
				<input
					id={id}
					ref={ref}
					className="range range-xs range-primary w-full"
					type="range"
					min={0}
					max={part.quantity}
					defaultValue={0}
					onChange={({ currentTarget: { value } }) => {
						const newRepairParts = structuredClone(repairParts);

						if (!~~value) {
							if (newRepairParts[part.name]) {
								delete newRepairParts[part.name];
							}
						} else {
							newRepairParts[part.name] =
								~~value * part.cost * -1;
						}

						onRepairPartsChange(newRepairParts);
					}}
				/>
			</div>
			<div className="flex justify-between px-2.5 mt-2 text-xs">
				{Array.from({ length: part.quantity + 1 }, (_, i) => (
					<span
						key={i}
						className={`text-xs${
							i % 2 !== 0 ? ' max-sm:hidden' : ''
						}`}
						aria-hidden
					>
						{i}
					</span>
				))}
			</div>
		</>
	);
};

interface Props {
	repairParts: RepairParts;
	onRepairPartsChange: (parts: RepairParts) => void;
}

const RepairPartsTable = ({ repairParts, onRepairPartsChange }: Props) => {
	const { currentEngine } = useContext(CalculatorContext);

	useEffect(() => {
		onRepairPartsChange({} as RepairParts);
	}, [currentEngine, onRepairPartsChange]);

	const sortedCompatibleParts =
		currentEngine?.compatibleParts
			.filter((part) => !part.missing)
			.sort(partSortFn('name_asc')) ?? [];

	return (
		<div className="py-4">
			<div className="overflow-x-auto overflow-y-auto max-h-[40vh] w-full rounded-2xl border border-base-200">
				<table className="table table-pin-rows table-xs sm:table-sm xl:table-md table-zebra">
					<thead>
						<tr>
							<th colSpan={2} className="font-bold text-center">
								Repair parts
							</th>
						</tr>
						<tr>
							<th className="w-1/2 xl:w-1/3 2xl:w-1/2">Part </th>
							<th className="text-right">Quantity </th>
						</tr>
					</thead>
					<tbody>
						{sortedCompatibleParts.map((part) => {
							return (
								<tr
									key={`${part.name.replaceAll(
										' ',
										'-',
									)}-row`}
								>
									<td>{part.name}</td>
									<td>
										<RangeInput
											part={part}
											repairParts={repairParts}
											onRepairPartsChange={
												onRepairPartsChange
											}
										/>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};
export default RepairPartsTable;
