import React from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { Paypal } from 'react-bootstrap-icons';

const NavbarSection = () => {

	return (
		<header className="header_section">
			<Container fluid>
				<Navbar expand='lg' className='custom_nav-container' >
					<Navbar.Brand href='/'>
						<span>
									Tuning Calculator <small className='fw-light fs-6 text-secondary text-sm-show d-none d-sm-inline'>Car Mechanic Simulator 21</small><small className='fw-light fs-6 text-secondary text-sm-show d-inline d-sm-none'>CMS 21</small>
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
						<Button
							href='https://paypal.me/TryphonKsydas'
							variant='secondary'
							className='btn-hover-lift'
							target='_blank'
						>
							<Paypal className='mb-1' /> Donate
						</Button>
					</Navbar.Collapse>
				</Navbar>
			</Container>
		</header>
	);
};

export default NavbarSection;