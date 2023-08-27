import React from 'react';
import { Card, Container, Nav, Navbar, Tab, Tabs } from 'react-bootstrap';
import { CalculatorTab } from './modules/common';
//import logo from './logo.svg';
import './assets/css/style.css';
import './assets/css/bootstrap.css';
//import './assets/css/font-awesome.min.css';
import './assets/css/responsive.css';
import './assets/css/style.scss';

function App() {
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
				<Card>
					<Tabs
						defaultActiveKey={CalculatorTab.Engine}
						className="mb-3"
					>
						<Tab eventKey={CalculatorTab.Engine} title="Engine">
            Tab content for Home
						</Tab>
						<Tab eventKey={CalculatorTab.Vehicle} title="Vehicle">
           Tab content for Profile
						</Tab>
					</Tabs>
				</Card>
			</section>
		</Container>
	);
}

export default App;
