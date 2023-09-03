import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { PartSortBy } from '../../modules/common';
import PropTypes from 'prop-types';

/**
 * Used before the tables in the CompatiblePartsContainer and SelectedPartsContainer.
 * Includes sorting choice and disclaimer for visibility on small screens.
 */
const PrePartsTableRow = ({ onSortByChange }) => {

	return (
		<Row className='justify-content-end mb-3'>
			<Col>
				<small className='d-block d-sm-none mb-sm-0 text-muted'>This table might need to be scrolled horizontally to be viewed properly on smaller devices.</small>
			</Col>
			<Col xs='auto'>
				<Form.Select
					aria-label='sorting by'
					onChange={onSortByChange}
					size='sm'
				>
					<option value={PartSortBy.NameAsc}>Name: A-Z</option>
					<option value={PartSortBy.NameDesc}>Name: Z-A</option>

					<option value={PartSortBy.QuantityAsc}>Quantity: Low-High</option>
					<option value={PartSortBy.QuantityDesc}>Quantity: High-Low</option>

					<option value={PartSortBy.BoostAsc}>Boost: Low-High</option>
					<option value={PartSortBy.BoostDesc}>Boost: High-Low</option>

					<option value={PartSortBy.CostAsc}>Cost: Low-High</option>
					<option value={PartSortBy.CostDesc}>Cost: High-Low</option>

					<option value={PartSortBy.CostToBoostAsc}>Cost / Boost: Low-High</option>
					<option value={PartSortBy.CostToBoostDesc}>Cost / Boost: High-Low</option>
				</Form.Select>
			</Col>
		</Row>
	);
};

PrePartsTableRow.propTypes = {
	/**
	 * The method used to change value of sortBy
	 * @method
	 * @param {React.ChangeEvent} event
	 */
	onSortByChange: PropTypes.func.isRequired,
};

export default PrePartsTableRow;