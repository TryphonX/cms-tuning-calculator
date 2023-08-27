import React from 'react';
import { Card, Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import './assets/css/style.scss';
import EngineContainer from './components/containers/EngineContainer';
import { CalculatorContext } from './modules/contexts';

function App() {

	const [currentEngine, setCurrentEngine] = React.useState(null);

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
					}}
				>
					<Container fluid>
						<Row>
							<Col xl='6' xs='12'>
								<EngineContainer />
							</Col>
							<Col xl='6' xs='12'>
								<Card>
								Tab content for Profile
								</Card>
							</Col>
						</Row>
					</Container>
				</CalculatorContext.Provider>
			</section>
		</Container>
	);
}

export default App;
