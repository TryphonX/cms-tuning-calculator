import React from 'react';
import CardComponent from './CardComponent';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, Col, FormControl, InputGroup, Row, Spinner } from 'react-bootstrap';
import { CalculatorContext } from '../../modules/contexts';
import { calculateBestSolution as calculateBestSetup, getTunedPartByName } from '../../modules/common';
import { BsArrowRepeat, BsCalculator } from 'react-icons/bs';
import { UpdateSelectedPartsEvent } from '../../modules/customEvents';

const SetupSuggestionContainer = ({ className }) => {

	const [targetBoost, setTargetBoost] = React.useState(0);
	const [isCalculating, setIsCalculating] = React.useState(false);
	const [hasCalculatedSetup, setHasCalculatedSetup] = React.useState(false);

	/**
	 * @type {[TuningSetup | null, React.Dispatch<TuningPart | null>]} state
	 */
	const [suggestion, setSuggestion] = React.useState(null);
	
	const { currentEngine } = React.useContext(CalculatorContext);

	React.useEffect(() => {
		setHasCalculatedSetup(false);
		setSuggestion(null);
	}, [currentEngine]);

	/**
	 * Returns a suggestion text based on certain conditions.
	 * @returns {string}
	 */
	const getSuggestionText = () => {

		if (suggestion) return `Suggestion: +${suggestion?.boost}% boost | ${suggestion?.cost} CR`;
		else if (hasCalculatedSetup) return 'No setup meets these criteria.';
		else return 'No calculation has been made.';
	};

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
	 * Returns the best setup for a current engine based on compatible parts and a target boost.
	 * @method
	 * @returns {TuningSetup}
	 */
	const getSuggestion = () => {
		if (!currentEngine) return [[], 0];

		const tunedCompatibleParts = currentEngine.compatibleParts
			.map(part => ({ ...part, tunedPart: getTunedPartByName(part.name) }))
			.filter(part => part.tunedPart);

		// The cost and boost are multiplied by quantity here to make
		// calculations easier in calculateBestSetup method.
		return calculateBestSetup(tunedCompatibleParts.map(part => ({
			...part.tunedPart,
			cost: part.tunedPart.cost * part.quantity,
			boost: part.tunedPart.boost * part.quantity,
		})), targetBoost);
	};

	/**
	 * Dispatches an event with updated selected parts based on the app's suggestions.
	 * @method
	 */
	const onApplySuggestionClick = () => {
		dispatchEvent(new UpdateSelectedPartsEvent(
			currentEngine.compatibleParts.filter(part => suggestion.partNames.includes(part.name)).map(part => ({name: part.name, quantity: part.quantity}))),
		);
	};

	/**
	 * Sets the suggestion state by calling the "getSuggestion" function.
	 * @method
	 */
	const onCalculateClick = () => {
		setIsCalculating(true);
		setSuggestion(getSuggestion());
		setIsCalculating(false);
		setHasCalculatedSetup(true);
	};


	/** Determines whether the "Calculate" button should be disabled or not. */
	const isCalculateDisabled = !currentEngine || targetBoost < 1;

	/**
	 * Determines whether the "Apply" button should be disabled or not.
	 */
	const isApplyDisabled = !suggestion;

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
					<span>{getSuggestionText()}</span>
				</Col>
				<Col className='text-end'>
					<ButtonGroup>
						<Button
							disabled={isApplyDisabled}
							variant='outline-secondary'
							size='sm'
							onClick={onApplySuggestionClick}
						>
							<BsArrowRepeat className='mb-1' /> Apply
						</Button>
						<Button
							disabled={isCalculateDisabled || isCalculating}
							variant='outline-secondary'
							size='sm'
							onClick={onCalculateClick}
						>
							{
								isCalculating ?
									<Spinner size='sm'>
										<span className='visually-hidden'>Calculating...</span>
									</Spinner> :
									<BsCalculator className='mb-1' />
							} Calculate
						</Button>
					</ButtonGroup>
				</Col>
			</Row>
		</CardComponent>	
	);
};

SetupSuggestionContainer.propTypes = {
	className: PropTypes.string,
};

export default SetupSuggestionContainer;