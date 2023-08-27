import React from 'react';
import { Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import './assets/css/style.scss';
import EngineContainer from './components/containers/EngineContainer';
import { CalculatorContext } from './modules/contexts';
import AvailablePartsContainer from './components/containers/AvailablePartsContainer';

function App() {

	const [currentEngine, setCurrentEngine] = React.useState(null);
	const [selectedParts, setSelectedParts] = React.useState([]);

	return (
		<Container fluid className="hero_area">
			<header className="header_section">
				<Container fluid>
					<Navbar expand='lg' className='custom_nav-container' >
						<Navbar.Brand href='index.html'>
							<span>
                Tuning Calculator<br />
								<small>Some text</small>
							</span>
						</Navbar.Brand>
						<Navbar.Toggle type='button' aria-controls="navbarSupportedContent" aria-label="Toggle navigation" />
						<Navbar.Collapse className='collapse' id='navbarSupportedContent'>
							<Nav as='ul'>
								{
									/*<Nav.Item as='li' className='nav-link'>
										<Nav.Link href='index.html'>Home</Nav.Link>
									</Nav.Item>*/
								}
							</Nav>
							<div className="quote_btn-container">
								<a href="" className="quote_btn">Donate</a>
							</div>
						</Navbar.Collapse>
					</Navbar>
				</Container>
			</header>

			<section>
				<CalculatorContext.Provider
					value={{
						currentEngine,
						setCurrentEngine,
						selectedParts,
						setSelectedParts,
					}}
				>
					<Container fluid className='mb-5'>
						<Row>
							<Col xl='5' xs='12'>
								<EngineContainer />
							</Col>
							<Col xl='7' xs='12'>
								<AvailablePartsContainer />
							</Col>
						</Row>
					</Container>
				</CalculatorContext.Provider>
			</section>
		</Container>
	);
}

export default App;
