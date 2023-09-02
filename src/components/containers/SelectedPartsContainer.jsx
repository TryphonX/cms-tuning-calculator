import React from 'react';
import { Table } from 'react-bootstrap';
import { CalculatorContext } from '../../modules/contexts';
import PropTypes from 'prop-types';
import CardComponent from './CardComponent';
import { PartSortBy, getCompareFn, getTunedPartByName } from '../../modules/common';
import PrePartsTableRow from './PrePartsTableRow';

/**
 * This is the card that contains all the selected parts
 * the user has selected (if they have selected any) and
 * the total stats of their tuning setup.
 * Uses CalculatorContext from CalculatorSection.
 */
const SelectedPartsContainer = ({ className }) => {

	const { selectedParts } = React.useContext(CalculatorContext);

	const [sortBy, setSortBy] = React.useState(PartSortBy.NameAsc);

	/**
	 * Total boost of all selected parts.
	 */
	const totalBoost = selectedParts.reduce((sum, current) => sum + (getTunedPartByName(current.name)?.boost * current.quantity), 0);

	/**
	 * Total cost of all selected parts.
	 */
	const totalCost = selectedParts.reduce((sum, current) => sum + (getTunedPartByName(current.name)?.cost * current.quantity), 0);

	/**
	 * Total cost per boost of all selected parts.
	 */
	const totalCostToBoost = totalBoost > 0 ? totalCost / totalBoost : 0;

	/**
	 * Sorted version of the `selectedParts` array using a comparison function
	 * determined by the `sortBy` parameter.
	 * @type {SelectedPart[] | undefined}
	 */
	const sortedSelectedParts = selectedParts?.sort(getCompareFn(sortBy));

	/**
	 * Updates the value of the "sortBy" state based on the selected option in the
	 * dropdown menu.
	 * @method
	 * @param {React.ChangeEvent} event
	 */
	const onSortByChange = ({target}) => setSortBy(target.value);
	
	return (
		<CardComponent className={className} title='Selected Parts'>
			<PrePartsTableRow onSortByChange={onSortByChange} />
			<Table bordered responsive='sm'>
				<thead>
					<tr>
						<th>Name</th>
						<th>Qt</th>
						<th>Boost</th>
						<th>Cost</th>
						<th>Cost / Boost</th>
					</tr>
				</thead>
				<tbody>
					{
						sortedSelectedParts.map(part => (
							<tr key={`res-${part.name}`}>
								<td>{part.name}</td>
								<td className='text-end'>{part.quantity}</td>
								<td className='text-end'>+{getTunedPartByName(part.name)?.boost.toFixed(2)}%</td>
								<td className='text-end'>{getTunedPartByName(part.name)?.cost} CR</td>
								<td className='text-end'>{getTunedPartByName(part.name)?.costToBoost.toFixed(2)} CR/Boost</td>
							</tr>
						))
					}
					<tr className='total-row'>
						<td colSpan={2}>Total:</td>
						<td className='text-end'>+{totalBoost.toFixed(2)}%</td>
						<td className='text-end'>{totalCost} CR</td>
						<td className='text-end'>{totalCostToBoost.toFixed(2)} CR/Boost</td>
					</tr>
				</tbody>
			</Table>
		</CardComponent>
	);
};

SelectedPartsContainer.propTypes = {
	className: PropTypes.string,
};

export default SelectedPartsContainer;