import React from 'react';
import { Container } from 'react-bootstrap';
import './assets/css/style.scss';
import NavbarSection from './components/sections/NavbarSection';
import CalculatorSection from './components/sections/CalculatorSection';
import AboutSection from './components/sections/AboutSection';
import FooterInfoSection from './components/sections/FooterInfoSection';

function App() {

	React.useEffect(() => {
		document.getElementById('displayYear').innerText = new Date().getFullYear();
	}, []);

	return (
		<React.Fragment>
			<Container fluid className="hero_area">
				<NavbarSection />
				
				<CalculatorSection />
			
			</Container>

			<AboutSection />
			
			<div className='footer_container'>

				<FooterInfoSection />
				
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
