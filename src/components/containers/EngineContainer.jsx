import React from 'react';
import { Col, Container, Form, Image, Row, Table } from 'react-bootstrap';
import { engines } from '../../modules/common';
import { CalculatorContext } from '../../modules/contexts';
import { ClearSelectedPartsEvent, UpdateEngineEvent } from '../../modules/customEvents';
import CardComponent from './CardComponent';

/**
 * This is the card that contains the dropdown for the engine choice
 * as well as standard details about the
 * chosen engine (if one has been chosen).
 * Uses CalculatorContext from CalculatorSection.
 */
const EngineContainer = () => {

	const { currentEngine } = React.useContext(CalculatorContext);

	/**
	 * The function `onEngineChange` is used to handle a change event on an engine selection and dispatch
	 * events to update the selected engine and clear selected parts.
	 * @method
	 * @param {React.ChangeEvent} event
	 */
	const onEngineChange = ({target}) => {
		if (currentEngine?.name === target.value) return;

		dispatchEvent(new ClearSelectedPartsEvent());

		dispatchEvent(new UpdateEngineEvent(engines[target.value] ?? null));
	};
	
	return (
		<CardComponent title='Engine'>
			<Form.Select aria-label='engine selection' onChange={onEngineChange}>
				<option>-</option>
				{Object.keys(engines).map(engName => <option key={`${engName.replace(/\s/g, '-')}-option`}>{engName}</option>)}
			</Form.Select>
			<Container fluid className='p-0 mt-3'>
				{
					currentEngine ?
						(
							<Row>
								<Col xs='12' sm='auto' className='mb-4 text-center mb-sm-0 text-sm-start'>
									<Image src={currentEngine?.imgUrl ?? ''} rounded />
								</Col>
								<Col>
									<Table bordered striped='columns' className='h-100'>
										<tbody>
											<tr>
												<td className='align-middle fw-bold w-50'>Power</td>
												<td className='align-middle w-50'>{currentEngine.specs.power} hp</td>
											</tr>
											<tr>
												<td className='align-middle fw-bold'>Torque</td>
												<td className='align-middle'>{currentEngine.specs.torque} N-m</td>
											</tr>
											<tr>
												<td className='align-middle fw-bold'>Gearbox</td>
												<td className='align-middle'>{currentEngine.specs.gearbox}</td>
											</tr>
										</tbody>
									</Table>
								</Col>
							</Row>
						) :
						(
							<span>Please select an engine.</span>
						)
				}
			</Container>
		</CardComponent>
	);
};

export default EngineContainer;