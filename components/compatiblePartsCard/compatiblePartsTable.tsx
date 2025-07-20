'use client';

import { CalculatorContext } from '@/modules/contexts';
import {
	ChangeEvent,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { TuningPartName } from '@/@types/calculator';
import {
	ToggleSelectedPartEvent,
	UpdateSelectedPartsEvent,
	UpdateSortEvent,
} from '@/modules/customEvents';
import { partSortFn, getFullPartByName } from '@/modules/common';
import { PartSortBy } from '@/@types/globals';
import SortBtn from '../sortBtn/sortBtn';
import MissingPartAlert from '../MissingPartAlert';

const getPartCheckboxes = () =>
	document.querySelectorAll(
		'input[data-part-checkbox]:not([disabled])',
	) as NodeListOf<HTMLInputElement>;

const getAllPartsCheckboxes = () =>
	document.querySelectorAll(
		'input[data-part-toggle-all-checkbox]',
	) as NodeListOf<HTMLInputElement>;

const markAllCheckboxes = (checked: boolean) => {
	getPartCheckboxes().forEach((checkbox) => {
		if (!checkbox.disabled) {
			checkbox.checked = checked;
		}
	});
};

const handleTogglePart = ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
	const partName = currentTarget.dataset.partName!;
	const partQt = ~~currentTarget.dataset.partQt!;

	ToggleSelectedPartEvent.dispatch(
		{ name: partName as TuningPartName, quantity: partQt },
		currentTarget.checked,
	);
};

export default function CompatiblePartsTable() {
	const { currentEngine, selectedParts } = useContext(CalculatorContext);
	const [partMissing, setPartMissing] = useState(false);

	const [sortBy, setSortBy] = useState<PartSortBy>('name_asc');

	// onMount
	useEffect(() => {
		const handleUpdateSort = (e: Event) => {
			e.stopPropagation();
			setSortBy((e as CustomEvent<PartSortBy>).detail ?? 'name_asc');
		};

		window.addEventListener(UpdateSortEvent.name, handleUpdateSort);

		return () => {
			window.removeEventListener(UpdateSortEvent.name, handleUpdateSort);
		};
	}, []);

	// onUpdate only if selectedParts changed
	useEffect(() => {
		if (!selectedParts.length) {
			markAllCheckboxes(false);
		} else {
			getPartCheckboxes()?.forEach((checkbox) => {
				const isSelected = selectedParts.some(
					(part) => part.name === checkbox.dataset.partName,
				);

				if (checkbox.checked !== isSelected) {
					checkbox.checked = isSelected;
				}
			});
		}
	}, [selectedParts]);

	// onUpdate
	useEffect(() => {
		const elements = getPartCheckboxes();

		let allSelected = true;

		elements.forEach((elem) => {
			if (!elem.checked) {
				allSelected = false;
			}
		});

		getAllPartsCheckboxes().forEach((checkbox) => {
			checkbox.checked = allSelected;
		});
	});

	useEffect(() => {
		setPartMissing(false);
	}, [currentEngine]);

	const handleToggleAllParts = useCallback(
		({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
			if (currentTarget.checked) {
				if (currentEngine) {
					UpdateSelectedPartsEvent.dispatch(
						currentEngine.compatibleParts
							.filter((part) => !part.missing)
							.map((part) => ({
								name: part.name,
								quantity: part.quantity,
							})),
					);
				}

				markAllCheckboxes(true);
			} else {
				UpdateSelectedPartsEvent.dispatch([]);

				markAllCheckboxes(false);
			}
		},
		[currentEngine],
	);

	if (!currentEngine) return;

	const sortedCompatibleParts = currentEngine.compatibleParts.sort(
		partSortFn(sortBy),
	);

	return (
		<>
			<MissingPartAlert partMissing={partMissing} />
			<div className="overflow-x-auto w-full rounded-2xl border border-base-200">
				<table className="table table-xs sm:table-md table-zebra">
					<thead className="text-sm">
						<tr>
							<td className="w-0">
								<input
									type="checkbox"
									className="checkbox checkbox-sm 2xl:checkbox-md checkbox-primary"
									data-part-toggle-all-checkbox
									aria-label="Select all parts"
									onChange={handleToggleAllParts}
								/>
							</td>
							<th className="w-1/2 xl:w-1/3 2xl:w-1/2">
								Part{' '}
								<SortBtn
									sortBy={sortBy}
									values={['name_asc', 'name_desc']}
								/>
							</th>
							<th className="text-right">
								Boost{' '}
								<SortBtn
									sortBy={sortBy}
									values={['boost_asc', 'boost_desc']}
								/>
							</th>
							<th className="text-right">
								Cost{' '}
								<SortBtn
									sortBy={sortBy}
									values={['cost_asc', 'cost_desc']}
								/>
							</th>
							<th className="text-right max-md:hidden">
								Cost / Boost{' '}
								<SortBtn
									sortBy={sortBy}
									values={[
										'costToBoost_asc',
										'costToBoost_desc',
									]}
								/>
							</th>
						</tr>
					</thead>
					<tbody>
						{sortedCompatibleParts.map((part) => {
							const tuningPartData = getFullPartByName(part.name);

							if (!tuningPartData) {
								console.warn(`Part missing: ${part.name}`);
								part.missing = true;
								if (!partMissing) {
									setPartMissing(true);
								}
							}

							return (
								<tr
									key={`${part.name.replaceAll(
										' ',
										'-',
									)}-row`}
								>
									<td>
										<input
											type="checkbox"
											className="checkbox checkbox-sm 2xl:checkbox-md checkbox-primary"
											data-part-checkbox
											disabled={part.missing}
											onChange={handleTogglePart}
											aria-label={`Select part ${part.name}`}
											data-part-name={part.name}
											data-part-qt={part.quantity}
										/>
									</td>
									<td
										className={
											part.missing
												? 'line-through text-secondary'
												: ''
										}
									>
										x{part.quantity} {part.name}
									</td>
									<td
										className={`text-right ${
											part.missing
												? 'line-through text-secondary'
												: ''
										}`}
									>
										+
										{(
											tuningPartData?.boost *
											part.quantity
										).toFixed(2) ?? '-'}
										%
									</td>
									<td
										className={`text-right ${
											part.missing
												? 'line-through text-secondary'
												: ''
										}`}
									>
										{tuningPartData?.cost * part.quantity}{' '}
										CR
									</td>
									<td
										className={`text-right max-md:hidden ${
											part.missing
												? 'line-through text-secondary'
												: ''
										}`}
										title={(
											tuningPartData?.cost /
											tuningPartData?.boost
										).toString()}
									>
										{(
											tuningPartData?.cost /
											tuningPartData?.boost
										)?.toFixed(0) || '-'}{' '}
										CR/Boost
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</>
	);
}
