'use client';

import { CalculatorContext } from '@/modules/contexts';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import tuningParts from '@/data/tuning-parts.json';
import { TuningPartName } from '@/@types/calculator';
import {
	ToggleSelectedPartEvent,
	UpdateSelectedPartsEvent,
	UpdateSortEvent,
} from '@/modules/customEvents';
import { PartSortBy, getCompareFn } from '@/modules/common';
import { SortBy } from '@/@types/globals';
import SortBtn from '../sortBtn/sortBtn';

export default function CompatiblePartsTable() {
	const { currentEngine } = useContext(CalculatorContext);

	const [sortBy, setSortBy] = useState(PartSortBy.NameAsc);

	// eslint-disable-next-line no-undef
	const getPartCheckboxes = () =>
		document.getElementsByName(
			'compatiblePartCheckbox',
		) as NodeListOf<HTMLInputElement>;

	const getAllPartsCheckbox = () =>
		document.getElementsByName(
			'allCompatiblePartsCheckbox',
		)[0] as HTMLInputElement;

	// onMount
	useEffect(() => {
		const handleUpdateSort = (e: Event) => {
			e.stopPropagation();
			setSortBy((e as CustomEvent<SortBy>).detail ?? PartSortBy.NameAsc);
		};

		window.addEventListener(UpdateSortEvent.name, handleUpdateSort);

		return () => {
			window.removeEventListener(UpdateSortEvent.name, handleUpdateSort);
		};
	}, []);

	// onUpdate only if currentEngine changed
	useEffect(() => {
		const elements = getPartCheckboxes();

		elements.forEach((elem) => {
			elem.checked = false;
		});
	}, [currentEngine]);

	// onUpdate
	useEffect(() => {
		const elements = getPartCheckboxes();

		let allSelected = true;

		elements.forEach((elem) => {
			if (!elem.checked) {
				allSelected = false;
				return;
			}
		});

		const allCheckbox = getAllPartsCheckbox();

		if (allCheckbox) {
			allCheckbox.checked = allSelected;
		}
	});

	if (!currentEngine) return;

	const sortedCompatibleParts = currentEngine.compatibleParts.sort(
		getCompareFn(sortBy),
	);

	const handleTogglePart = ({
		currentTarget,
	}: ChangeEvent<HTMLInputElement>) => {
		const partName = currentTarget.dataset.partName!;
		const partQt = ~~currentTarget.dataset.partQt!;

		ToggleSelectedPartEvent.dispatch(
			{ name: partName as TuningPartName, quantity: partQt },
			currentTarget.checked,
		);
	};

	const markAllCheckboxes = (checked: boolean) => {
		getPartCheckboxes().forEach((checkbox) => {
			checkbox.checked = checked;
		});
	};

	const handleToggleAllParts = ({
		currentTarget,
	}: ChangeEvent<HTMLInputElement>) => {
		if (currentTarget.checked) {
			UpdateSelectedPartsEvent.dispatch(
				currentEngine.compatibleParts.map((part) => ({
					name: part.name,
					quantity: part.quantity,
				})),
			);

			markAllCheckboxes(true);
		} else {
			UpdateSelectedPartsEvent.dispatch([]);

			markAllCheckboxes(false);
		}
	};

	return (
		<>
			<div className='overflow-x-auto w-full rounded-2xl border border-secondary'>
				<table className='table table-sm table-zebra'>
					<thead className='text-sm'>
						<tr>
							<th>
								<label>
									<input
										type='checkbox'
										className='checkbox'
										name='allCompatiblePartsCheckbox'
										onChange={handleToggleAllParts}
									/>
								</label>
							</th>
							<th className='w-1/3'>
								Name{' '}
								<SortBtn
									sortBy={sortBy}
									values={[
										PartSortBy.NameAsc,
										PartSortBy.NameDesc,
									]}
								/>
							</th>
							<th>
								Qt{' '}
								<SortBtn
									sortBy={sortBy}
									values={[
										PartSortBy.QuantityAsc,
										PartSortBy.QuantityDesc,
									]}
								/>
							</th>
							<th>
								Boost{' '}
								<SortBtn
									sortBy={sortBy}
									values={[
										PartSortBy.BoostAsc,
										PartSortBy.BoostDesc,
									]}
								/>
							</th>
							<th>
								Cost{' '}
								<SortBtn
									sortBy={sortBy}
									values={[
										PartSortBy.CostAsc,
										PartSortBy.CostDesc,
									]}
								/>
							</th>
							<th>
								Cost / Boost{' '}
								<SortBtn
									sortBy={sortBy}
									values={[
										PartSortBy.CostToBoostAsc,
										PartSortBy.CostToBoostDesc,
									]}
								/>
							</th>
						</tr>
					</thead>
					<tbody>
						{sortedCompatibleParts.map((part) => {
							const tuningPartData =
								tuningParts[part.name as TuningPartName];

							if (!tuningPartData) {
								console.warn(`Part missing: ${part.name}`);
							}

							return (
								<tr key={`${part.name.replace(' ', '-')}-row`}>
									<th>
										<label>
											<input
												type='checkbox'
												className='checkbox'
												name='compatiblePartCheckbox'
												onChange={handleTogglePart}
												data-part-name={part.name}
												data-part-qt={part.quantity}
											/>
										</label>
									</th>
									<td>{part.name}</td>
									<td>{part.quantity}</td>
									<td>+{tuningPartData?.boost ?? '-'}%</td>
									<td>{part.cost} CR</td>
									<td>
										{(
											part.cost / tuningPartData?.boost
										)?.toFixed(2) || '-'}{' '}
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
