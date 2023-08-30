import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { Github } from 'react-bootstrap-icons';

const AboutSection = () => {

	return (
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
					This app is a personal project and is not associated with the makers and/or publishers of the game in any way shape or form. This project is open source.
				</small>
				<small className='text-muted d-block'>
					Licensed under <a href='https://github.com/TryphonX/CMS-Tuning-Calculator/blob/main/COPYING.txt' rel='noreferrer' target='_blank' >GNU GENERAL PUBLIC LICENSE</a>.
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
	);
};

export default AboutSection;