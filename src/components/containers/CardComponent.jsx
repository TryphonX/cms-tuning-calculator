import React from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

/**
 * A simple card component used to store other containers in a more presentable way.
 */
const CardComponent = ({ className, title, children }) => {

	return (
		<Card className={className}>
			{
				title ? <Card.Header>
					<Card.Title className='mt-1'>{title}</Card.Title>
				</Card.Header> : null
			}
			<Card.Body>
				{children}
			</Card.Body>
		</Card>
	);
};

CardComponent.propTypes = {
	className: PropTypes.string,
	/**
	 * The title to be shown in the card header
	 */
	title: PropTypes.string,
	children: PropTypes.oneOfType([
		PropTypes.node,
		PropTypes.arrayOf(PropTypes.node),
	]),
};

export default CardComponent;