import React from 'react';
import { Button, Card, Container, Form, Table } from 'react-bootstrap';
import { CalculatorContext } from '../../modules/contexts';
import tuningParts from '../../modules/tuning-parts-v4.json';
import { XLg } from 'react-bootstrap-icons';

const AvailablePartsContainer = () => {

	const { currentEngine, selectedParts, setSelectedParts } = React.useContext(CalculatorContext);

	const onTuneChanged = ({target}) => {
		
		const partName = target.dataset.partName;

		if (selectedParts.includes(partName)) {
			setSelectedParts(selectedParts.filter(part => part !== partName));
		}
		else {
			setSelectedParts([...selectedParts, partName].sort());
		}

		console.log(selectedParts);
	};

	return (
		<Card>
			<Container fluid className='p-3'>
				<Form.Label>Available Parts</Form.Label>
				{
					currentEngine ?
						(
							<React.Fragment>
								<Table bordered striped='columns'>
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
											currentEngine.availableParts.map(part => (
												<tr key={part.name}>
													<td>{part.name}</td>
													<td>{part.quantity}</td>
													<td>+{tuningParts[part.name]?.boost}</td>
													<td>{tuningParts[part.name]?.cost} CR</td>
													<td>{tuningParts[part.name]?.costToBoost} CR</td>
													<td className='text-center'>
														<Form.Check
															aria-label='select to tune part'
															data-part-name={part.name}
															type='checkbox'
															checked={selectedParts.includes(part.name)}
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
										onClick={() => setSelectedParts([])}
									>
										<XLg className='mb-1' /> Clear
									</Button>
								</div>
							</React.Fragment>
						) :
						(
							<Container fluid className='p-0'>
								<span>Please select an engine.</span>
							</Container>
						)
				}
			</Container>
		</Card>
	);
};

export default AvailablePartsContainer;