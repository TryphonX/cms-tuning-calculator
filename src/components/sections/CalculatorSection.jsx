import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { CalculatorContext } from '../../modules/contexts';
import { ClearSelectedPartsEvent, UpdateEngineEvent, UpdateSelectedPartsEvent } from '../../modules/customEvents';
import EngineCard from '../containers/EngineCard';
import SetupSuggestionCard from '../containers/SetupSuggestionCard';
import SelectedPartsCard from '../containers/SelectedPartsCard';
import CompatiblePartsCard from '../containers/CompatiblePartsCard';

/**
 * This section includes all the components necessary for the Calculator.
 * Uses CalculatorContext.
 */
const CalculatorSection = () => {

	const [currentEngine, setCurrentEngine] = React.useState(null);
	const [selectedParts, setSelectedParts] = React.useState([]);

	const clearSelectedParts = () => setSelectedParts([]);

	React.useEffect(() => {
		window.addEventListener(ClearSelectedPartsEvent.eventName, clearSelectedParts);
		window.addEventListener(UpdateSelectedPartsEvent.eventName, ({ detail }) => setSelectedParts(detail));
		window.addEventListener(UpdateEngineEvent.eventName, ({ detail }) => setCurrentEngine(detail));
	}, []);

	return (
		<CalculatorContext.Provider
			value={{
				currentEngine,
				selectedParts,
			}}
		>
			<section>
				<Container fluid>
					<Row>
						<Col xl='5' xs='12'>
							<EngineCard />
							<SelectedPartsCard className='mt-4 d-none d-xl-block' />
						</Col>
						<Col xl='7' xs='12' className='mt-xl-0 mt-4'>
							<SetupSuggestionCard />
							<CompatiblePartsCard className='mt-4' />
						</Col>
						<Col className='d-block d-xl-none'>
							<SelectedPartsCard className='mt-4' />
						</Col>
					</Row>
				</Container>
			</section>
		</CalculatorContext.Provider>
	);
};

export default CalculatorSection;