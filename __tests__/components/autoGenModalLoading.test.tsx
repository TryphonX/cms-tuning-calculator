import React from 'react';
import { render } from '@testing-library/react';
import AutoGenModalLoading from '@/components/autoGenModal/autoGenModalLoading';

describe('AutoGenModalLoading', () => {
	it('renders the loading component', () => {
		const { container } = render(<AutoGenModalLoading />);

		// Check for loading element
		const loadingElement = container.querySelector('.loading');
		expect(loadingElement).toBeInTheDocument();
	});
});
