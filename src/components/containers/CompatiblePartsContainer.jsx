import React from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { CalculatorContext } from '../../modules/contexts';
import { PartSortBy, getCompareFn, getTunedPartByName } from '../../modules/common';
import { ClearSelectedPartsEvent, UpdateSelectedPartsEvent } from '../../modules/customEvents';
import CardComponent from './CardComponent';
import { BsEraserFill } from 'react-icons/bs';
import PrePartsTableRow from './PrePartsTableRow';
import PropTypes from 'prop-types';

/**
 * This is the card that contains all the compatible parts for the
 * chosen engine (if one has been chosen).
 * Uses CalculatorContext from CalculatorSection.
 */
const CompatiblePartsContainer = ({ className }) => {

	const { currentEngine, selectedParts } = React.useContext(CalculatorContext);

	const [sortBy, setSortBy] = React.useState(PartSortBy.NameAsc);

	/**
	 * Event handler for when the tune checkbox changes state.
	 * @param {React.ChangeEvent} event 
	 */
	const onTuneChanged = ({target}) => {
		
		const partName = target.dataset.partName;
		const partQt = target.dataset.partQuantity;

		if (selectedParts.some(selectedPart => selectedPart.name === partName)) {
			dispatchEvent(new UpdateSelectedPartsEvent(selectedParts.filter(selectedPart => selectedPart.name !== partName)));
		}
		else {
			dispatchEvent(new UpdateSelectedPartsEvent([...selectedParts, { name: partName, quantity: partQt }]));
		}
	};

	/**
	 * Sorted version of the `compatibleParts` array of the `currentEngine`
	 * object using a comparison function determined by the `sortBy` state.
	 * @returns {CompatiblePart[] | undefined}
	 */
	const getSortedCompatibleParts = currentEngine?.compatibleParts?.sort(getCompareFn(sortBy));

	/**
	 * Updates the value of the "sortBy" state based on the selected option in the
	 * dropdown menu.
	 * @method
	 * @param {React.ChangeEvent} event
	 */
	const onSortByChange = ({target}) => setSortBy(target.value);

	return (
		<CardComponent title='Compatible Parts' className={className}>
			{
				currentEngine ?
					(
						<React.Fragment>
							<PrePartsTableRow onSortByChange={onSortByChange}/>
							<Table bordered striped='columns' responsive='sm'>
								<thead>
									<tr>
										<th>Name</th>
										<th>Qt</th>
										<th>Boost</th>
										<th>Cost</th>
										<th>Cost / Boost</th>
										<th>Tune</th>
									</tr>
								</thead>
								<tbody>
									{
										getSortedCompatibleParts.map(part => (
											<tr key={part.name}>
												<td>{part.name}</td>
												<td className='text-end'>{part.quantity}</td>
												<td className='text-end'>+{getTunedPartByName(part.name)?.boost.toFixed(2)}%</td>
												<td className='text-end'>{getTunedPartByName(part.name)?.cost} CR</td>
												<td className='text-end'>{getTunedPartByName(part.name)?.costToBoost.toFixed(2)} CR/Boost</td>
												<td className='text-center'>
													<Form.Check
														aria-label='select to tune part'
														data-part-name={part.name}
														data-part-quantity={part.quantity}
														type='checkbox'
														checked={selectedParts.some(selectedPart => selectedPart.name === part.name)}
														onChange={onTuneChanged}
													/>
												</td>
											</tr>
										))
									}
								</tbody>
							</Table>
							<div className='text-end'>
								<Button aria-label='clear parts selection'
									disabled={!selectedParts.length}
									onClick={() => dispatchEvent(new ClearSelectedPartsEvent())}
								>
									<BsEraserFill className='mb-1' /> Clear
								</Button>
							</div>
						</React.Fragment>
					) :
					(
						<span>Select an engine to see its compatible parts.</span>
					)
			}
		</CardComponent>
	);
};

CompatiblePartsContainer.propTypes = {
	className: PropTypes.string,
};

export default CompatiblePartsContainer;