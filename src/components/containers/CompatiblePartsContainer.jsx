import React from 'react';
import { Button, Card, Container, Form, Table } from 'react-bootstrap';
import { CalculatorContext } from '../../modules/contexts';
import tuningParts from '../../modules/tuning-parts-v4.json';
import { XLg } from 'react-bootstrap-icons';
import { compareBasedOnName } from '../../modules/common';

const CompatiblePartsContainer = () => {

	const { currentEngine, selectedParts, setSelectedParts, clearSelectedParts } = React.useContext(CalculatorContext);

	const onTuneChanged = ({target}) => {
		
		const partName = target.dataset.partName;
		const partQt = target.dataset.partQuantity;

		if (selectedParts.some(selectedPart => selectedPart.name === partName)) {
			setSelectedParts(selectedParts.filter(selectedPart => selectedPart.name !== partName));
		}
		else {
			setSelectedParts([...selectedParts, { name: partName, quantity: partQt }].sort(compareBasedOnName));
		}
	};

	return (
		<Card>
			<Card.Header>
				<Card.Title className='mt-1'>Compatible Parts</Card.Title>
			</Card.Header>
			<Card.Body>
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
											currentEngine.compatibleParts.map(part => (
												<tr key={part.name}>
													<td>{part.name}</td>
													<td className='text-end'>{part.quantity}</td>
													<td className='text-end'>+{tuningParts[part.name]?.boost.toFixed(2)}%</td>
													<td className='text-end'>{tuningParts[part.name]?.cost} CR</td>
													<td className='text-end'>{tuningParts[part.name]?.costToBoost} CR/Boost</td>
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
										onClick={clearSelectedParts}
									>
										<XLg className='mb-1' /> Clear
									</Button>
								</div>
							</React.Fragment>
						) :
						(
							<Container fluid className='p-0'>
								<span>Select an engine to see its compatible parts.</span>
							</Container>
						)
				}
			</Card.Body>
		</Card>
	);
};

export default CompatiblePartsContainer;