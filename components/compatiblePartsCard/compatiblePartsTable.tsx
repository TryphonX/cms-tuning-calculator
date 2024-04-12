'use client';

import { CalculatorContext } from '@/modules/contexts';
import { ChangeEvent, useContext, useEffect } from 'react';
import tuningParts from '@/data/tuning-parts.json';
import { TuningPartName } from '@/@types/calculator';
import { ToggleSelectedPartEvent, UpdateSelectedPartsEvent } from '@/modules/customEvents';

export default function CompatiblePartsTable() {

	const { currentEngine } = useContext(CalculatorContext);

	// eslint-disable-next-line no-undef
	const getPartCheckboxes = () => document.getElementsByName('compatiblePartCheckbox') as NodeListOf<HTMLInputElement>;
	const getAllPartsCheckbox = () => document.getElementsByName('allCompatiblePartsCheckbox')[0] as HTMLInputElement;

	useEffect(() => {
		const elements = getPartCheckboxes();

		elements.forEach(elem => {
			elem.checked = false;
		});

	}, [currentEngine]);

	useEffect(() =>{
		const elements = getPartCheckboxes();

		let allSelected = true;

		elements.forEach(elem => {
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

	const handleTogglePart = ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
		
		const partName = currentTarget.dataset.partName!;
		const partQt = ~~currentTarget.dataset.partQuantity!;

		ToggleSelectedPartEvent.dispatch({ name: partName, quantity: partQt }, currentTarget.checked);
	};

	const markAllCheckboxes = (checked: boolean) => {
		getPartCheckboxes().forEach(checkbox => {
			checkbox.checked = checked;
		});
	};

	const handleToggleAllParts = ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {

		if (currentTarget.checked) {
			UpdateSelectedPartsEvent.dispatch(currentEngine.compatibleParts.map((part) => (
				{ name: part.name, quantity: part.quantity }
			)));

			markAllCheckboxes(true);
		}
		else {
			UpdateSelectedPartsEvent.dispatch([]);

			markAllCheckboxes(false);
		}
	};
	
	return (
		<div className="overflow-x-auto w-full">
			<table className="table table-lg table-zebra">
				<thead>
					<tr>
						<th>
							<label>
								<input type="checkbox" className="checkbox"
									name='allCompatiblePartsCheckbox'
									onChange={handleToggleAllParts}
								/>
							</label>
						</th>
						<th>Name</th>
						<th>Qt</th>
						<th>Boost</th>
						<th>Cost</th>
						<th>Cost / Boost</th>
					</tr>
				</thead>
				<tbody>
					{currentEngine.compatibleParts.map((part) => {

						const tuningPartData = tuningParts[part.name as TuningPartName];

						return (
							<tr key={`${part.name.replace(' ', '-')}-row`}>
								<th>
									<label>
										<input type="checkbox" className="checkbox"
											name='compatiblePartCheckbox'
											onChange={handleTogglePart}
											data-part-name={part.name}
											data-part-qt={part.quantity}
										/>
									</label>
								</th>
								<td>{part.name}</td>
								<td>{part.quantity}</td>
								<td>+{tuningPartData.boost}%</td>
								<td>{part.cost} CR</td>
								<td>{part.cost} CR/Boost</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}