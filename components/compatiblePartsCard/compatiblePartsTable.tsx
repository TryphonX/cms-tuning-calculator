'use client';

import { CalculatorContext } from '@/modules/contexts';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { TuningPartName } from '@/@types/calculator';
import {
	ToggleSelectedPartEvent,
	UpdateSelectedPartsEvent,
	UpdateSortEvent,
} from '@/modules/customEvents';
import { PartSortBy, getCompareFn, getFullPartByName } from '@/modules/common';
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
			<div className='overflow-x-auto w-full rounded-2xl border border-base-200'>
				<table className='table table-xs sm:table-sm xl:table-sm 2xl:table-sm table-zebra'>
					<thead className='text-sm'>
						<tr>
							<th className='w-0'>
								<label>
									<input
										type='checkbox'
										className='checkbox checkbox-sm 2xl:checkbox-md checkbox-primary'
										name='allCompatiblePartsCheckbox'
										onChange={handleToggleAllParts}
									/>
								</label>
							</th>
							<th className='w-1/2 xl:w-1/3 2xl:w-1/2'>
								Part{' '}
								<SortBtn
									sortBy={sortBy}
									values={[
										PartSortBy.NameAsc,
										PartSortBy.NameDesc,
									]}
								/>
							</th>
							<th className='text-right'>
								Boost{' '}
								<SortBtn
									sortBy={sortBy}
									values={[
										PartSortBy.BoostAsc,
										PartSortBy.BoostDesc,
									]}
								/>
							</th>
							<th className='text-right'>
								Cost{' '}
								<SortBtn
									sortBy={sortBy}
									values={[
										PartSortBy.CostAsc,
										PartSortBy.CostDesc,
									]}
								/>
							</th>
							<th className='text-right max-md:hidden'>
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
							const tuningPartData = getFullPartByName(part.name);

							if (!tuningPartData) {
								console.warn(`Part missing: ${part.name}`);
							}

							return (
								<tr key={`${part.name.replace(' ', '-')}-row`}>
									<th>
										<label>
											<input
												type='checkbox'
												className='checkbox checkbox-sm 2xl:checkbox-md checkbox-primary'
												name='compatiblePartCheckbox'
												onChange={handleTogglePart}
												data-part-name={part.name}
												data-part-qt={part.quantity}
											/>
										</label>
									</th>
									<td>
										x{part.quantity} {part.name}
									</td>
									<td className='text-right'>
										+
										{(
											tuningPartData?.boost *
											part.quantity
										).toFixed(2) ?? '-'}
										%
									</td>
									<td className='text-right'>
										{tuningPartData?.cost * part.quantity}{' '}
										CR
									</td>
									<td className='text-right max-md:hidden'>
										{(
											tuningPartData?.cost /
											tuningPartData?.boost
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
