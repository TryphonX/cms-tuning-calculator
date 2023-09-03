import React from 'react';
import CardComponent from './CardComponent';
import PropTypes from 'prop-types';
import { Button, Col, FormControl, InputGroup, Row } from 'react-bootstrap';
import { CalculatorContext } from '../../modules/contexts';
import { compareCostToBoostAsc, getTunedPartByName } from '../../modules/common';
import { BsArrowRepeat } from 'react-icons/bs';
import { UpdateSelectedPartsEvent } from '../../modules/customEvents';

const SetupSuggestion = ({ className }) => {

	const [targetBoost, setTargetBoost] = React.useState(0);
	
	const { currentEngine } = React.useContext(CalculatorContext);

	/**
	 * @typedef {[string[], number]} StrArrayNumberTuple
	 */

	/**
 * @type {[StrArrayNumberTuple, React.Dispatch<StrArrayNumberTuple>]} state
 */
	const [suggestion, setSuggestion] = React.useState([[], 0]);

	/**
	 * Ensures that the value of target boost is within the range of 0 to 100.
	 * @method
	 * @param {React.ChangeEvent} event 
	 */
	const onTargetBoostChange = ({ target }) => {
		if (target.value < 0) setTargetBoost(0);
		else if (target.value > 100) setTargetBoost(100);
		else setTargetBoost(target.value);
	};

	/**
	 * Calculates the "best" combination of compatible parts for a current engine based on
	 * their boost and cost and returns the suggested part names and the total boost produced.
	 * @method
	 * @returns {StrArrayNumberTuple}
	 */
	const calculateBestCombination = () => {
		if (!currentEngine) return [[], 0];

		const tunedCompatibleParts = currentEngine.compatibleParts
			.map(part => ({ ...part, tunedPart: getTunedPartByName(part.name) }))
			.filter(part => part.tunedPart)
			.sort(compareCostToBoostAsc);

		let sum = 0;

		const suggestedPartNames = [];

		for (const iterator of tunedCompatibleParts) {

			if (!iterator.tunedPart) continue;
	
			sum += iterator.tunedPart.boost * iterator.quantity;
			suggestedPartNames.push(iterator.tunedPart.name);

			if (sum >= targetBoost) break;
		}

		return [suggestedPartNames, sum];
	};

	/**
	 * Dispatches an event with updated selected parts based on the app's suggestions.
	 * @method
	 */
	const onApplySuggestionClick = () => {
		dispatchEvent(new UpdateSelectedPartsEvent(
			currentEngine.compatibleParts.filter(part => suggestion[0].includes(part.name)).map(part => ({name: part.name, quantity: part.quantity}))),
		);
	};

	React.useEffect(() => {

		if (targetBoost > 0) {
			setSuggestion(calculateBestCombination());
		}

	}, [currentEngine, targetBoost]);

	return (
		<CardComponent title='Setup Suggestion' className={className}>
			<InputGroup className='mb-3'>
				<InputGroup.Text>Target boost increase:</InputGroup.Text>
				<FormControl
					className='text-end'
					value={targetBoost}
					min={0} max={100}
					type='number'
					size='sm'
					onChange={onTargetBoostChange}
				/>
				<InputGroup.Text>%</InputGroup.Text>
			</InputGroup>

			<Row>
				<Col className='pt-1'>
					<span>Suggested combination produces {suggestion[1].toFixed(2)}% of boost.</span>
				</Col>
				<Col className='text-end'>
					<Button
						variant='secondary'
						size='sm'
						onClick={onApplySuggestionClick}
					>
						<BsArrowRepeat className='mb-1' /> Apply
					</Button>
				</Col>
			</Row>
		</CardComponent>	
	);
};

SetupSuggestion.propTypes = {
	className: PropTypes.string,
};

export default SetupSuggestion;