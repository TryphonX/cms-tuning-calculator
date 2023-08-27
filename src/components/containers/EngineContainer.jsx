import React from 'react';
import { Card, Col, Container, Form, Image, Row, Table } from 'react-bootstrap';
import { engines } from '../../modules/common';
import { CalculatorContext } from '../../modules/contexts';

const EngineContainer = () => {

	const { currentEngine, setCurrentEngine } = React.useContext(CalculatorContext);

	const onEngineChange = ({target}) => {
		console.log(target);
		setCurrentEngine(engines[target.value] ?? null);
	};

	/*
	"template": {
		"name": "template",
		"imgUrl": "imgUrl",
		"specs": {
			"power": 0,
			"torque": 0,
			"gearbox": "Gearbox"
		},
		"availableParts": [
			{
				"partName": "Alternator",
				"quantity": 1,
				"price": 200
			}
		]
	},
	*/
	
	return (
		<Card>
			<Container fluid className='p-3'>
				<Form.Label>Engine</Form.Label>
				<Form.Select aria-label='engine selection' onChange={onEngineChange}>
					<option>-</option>
					{Object.keys(engines).map(engName => <option key={`${engName.replace(/\s/g, '-')}-option`}>{engName}</option>)}
				</Form.Select>
				<Container fluid className='p-0 mt-3'>
					{
						currentEngine ?
							(
								<Row>
									<Col xs='auto'>
										<Image src={currentEngine?.imgUrl ?? ''} rounded /><br />
									</Col>
									<Col>
										<Table bordered striped='columns' className='h-100'>
											<tbody>
												<tr>
													<td className='align-middle'>Power</td>
													<td className='align-middle'>{currentEngine.specs.power} hp</td>
												</tr>
												<tr>
													<td className='align-middle'>Torque</td>
													<td className='align-middle'>{currentEngine.specs.torque} N-m</td>
												</tr>
												<tr>
													<td className='align-middle'>Gearbox</td>
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
			</Container>
		</Card>
	);
};

export default EngineContainer;