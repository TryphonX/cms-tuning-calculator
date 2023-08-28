import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Github } from 'react-bootstrap-icons';

const FooterInfoSection = () => {

	return (
		<section className='info_section'>
			<Container>
				<Row>
					<Col md='6' lg='4'>
						<div className='info_detail px-md-5 px-lg-0 px-0'>
							<h4>Suggestions</h4>
							<p className='px-3 px-sm-2 px-md-0'>
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
						variant='secondary'
						href='https://github.com/TryphonX/CMS-Tuning-Calculator/issues/new'
						target='_blank'
						aria-label='Submit an issue on GitHub'
					>
						<Github className='mb-1' /> Submit an Issue
					</Button>
				</Row>
			</Container>
		</section>
	);
};

export default FooterInfoSection;