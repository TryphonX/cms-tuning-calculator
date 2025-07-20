import React from 'react';
import { render } from '@testing-library/react';
import AutoGenModalLoading from '@/components/autoGenModal/autoGenModalLoading';

describe('AutoGenModalLoading', () => {
	it('renders the loading component', () => {
		const { container } = render(<AutoGenModalLoading />);

		// Check for loading element
		const loadingElement = container.querySelector('.loading');
		expect(loadingElement).toBeInTheDocument();
		expect(loadingElement).toHaveClass(
			'loading',
			'loading-bars',
			'w-28',
			'text-primary',
		);
	});

	it('renders with correct structure', () => {
		const { container } = render(<AutoGenModalLoading />);

		const outerDiv = container.firstChild as HTMLElement;
		expect(outerDiv).toHaveClass('text-center', 'mt-8');

		const loadingSpan = outerDiv.querySelector('span.loading');
		expect(loadingSpan).toBeInTheDocument();
	});

	it('has the correct loading animation classes', () => {
		const { container } = render(<AutoGenModalLoading />);

		const loadingElement = container.querySelector('.loading');
		expect(loadingElement?.className).toContain('loading-bars');
		expect(loadingElement?.className).toContain('w-28');
		expect(loadingElement?.className).toContain('text-primary');
	});
});
