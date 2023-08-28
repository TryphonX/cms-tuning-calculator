import React from 'react';
import { Button, Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import './assets/css/style.scss';
import EngineContainer from './components/containers/EngineContainer';
import { CalculatorContext } from './modules/contexts';
import AvailablePartsContainer from './components/containers/AvailablePartsContainer';
import ResultsContainer from './components/containers/ResultsContainer';
import { Github } from 'react-bootstrap-icons';

function App() {

	const [currentEngine, setCurrentEngine] = React.useState(null);
	const [selectedParts, setSelectedParts] = React.useState([]);

	const clearSelectedParts = () => setSelectedParts([]);

	React.useEffect(() => {
		document.getElementById('displayYear').innerText = new Date().getFullYear();
	}, []);

	return (
		<React.Fragment>
			<span className='position-absolute text-light' style={{ top: '.25vh', right: '.5vh', zIndex: 1 }} >v1.0.0</span>
			<Container fluid className="hero_area">
				<header className="header_section">
					<Container fluid>
						<Navbar expand='lg' className='custom_nav-container' >
							<Navbar.Brand href='/'>
								<span>
                Tuning Calculator <small className='fw-light fs-6 text-secondary'>Car Mechanic Simulator 21</small>
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
							clearSelectedParts,
						}}
					>
						<Container fluid className='mb-5'>
							<Row>
								<Col xl='5' xs='12'>
									<EngineContainer />
									<ResultsContainer className='mt-4' />
								</Col>
								<Col xl='7' xs='12'>
									<AvailablePartsContainer />
								</Col>
							</Row>
						</Container>
					</CalculatorContext.Provider>
				</section>
			</Container>
			<section className='service_section layout_padding'>
				<Container>
					<div className='heading_container'>
						<h2>About the Project</h2>
						<p>
							Useful tool for tuning cars in the game. Provides a lot of functionalities that make tuning considerably easier as well as allowing you to explore the most efficient way of tuning the car to the desired boost percentage. All tuning combinations by this tool will always be &quot;symmetrical&quot; - it will not allow you to switch some of the same part with tuned parts, it&apos;s either all or nothing. This tool is just a calculator (at least for now), it will not recommend tuning setups on its own, it will just provide you with all the information you need to make your decision.
						</p>
					</div>
					<div className='text-start'>
						<h5>Why use the calculator?</h5>
						<ul>
							<li>massively reduces the pool of parts that are available from the shop, to the engine-compatible parts for the engine you want to tune</li>
							<li>provides all necessary information for the compatible parts</li>
							<li>ease of use</li>
							<li>provides &quot;symmetrical&quot; solutions for your tuning needs</li>
							<li>provides all the information you want to have when tuning an engine: boost, cost and even cost to boost ratio</li>
						</ul>
					</div>
					<small className='text-muted d-block'>
							This app is a personal project and is not associated with the makers and/or publishers of the game in any way shape or form.
					</small>
					<Button
						className='mt-3'
						href='https://github.com/TryphonX/CMS-Tuning-Calculator'
						target='_blank'
						aria-label='Submit an issue on GitHub'
					>
						<Github className='mb-1' /> See source code
					</Button>
				</Container>
			</section>
			<div className='footer_container'>
				<section className='info_section'>
					<Container>
						<Row>
							<Col md='6' lg='4'>
								<div className='info_detail'>
									<h4>Suggestions</h4>
									<p>
										If you have any suggestions for improvement, feel free to let me know by clicking the button below.
									</p>
								</div>
							</Col>
							<Col md='6' lg='4'>
								<div className='info_detail'>
									<h4>Feedback & Bugs</h4>
									<p>
										Have any feedback about the app? Maybe you found a bug? Please take the time to submit an issue by clicking the button below.
									</p>
								</div>
							</Col>
							<Col md='6' lg='4'>
								<div className='info_detail'>
									<h4>Something wrong?</h4>
									<p>
										See anything wrong with the information about the engine specs, parts or missing links between parts and engines? Please take the time to submit an issue by clicking the button below.
									</p>
								</div>
							</Col>
						</Row>
						<Row>
							<Button
								variant='secondary text-light'
								href='https://github.com/TryphonX/CMS-Tuning-Calculator/issues/new'
								target='_blank'
								aria-label='Submit an issue on GitHub'
							>
								<Github className='mb-1' /> Submit an Issue
							</Button>
						</Row>
					</Container>
				</section>
				<footer className='footer_section'>
					<Container>
						<p>© <span id='displayYear'></span> Tryphon Ksydas. All rights reserved.</p>
					</Container>
				</footer>
			</div>
		</React.Fragment>
	);
}

export default App;
