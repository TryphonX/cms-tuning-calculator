import { render, screen } from '@testing-library/react';
import Loading from '@/app/loading';

describe('Loading Component', () => {
	it('renders the loading component', () => {
		render(<Loading />);

		const loadingElement = screen.getByLabelText('Loading');
		expect(loadingElement).toBeInTheDocument();
	});

	it('has correct aria-label for accessibility', () => {
		render(<Loading />);

		const loadingElement = screen.getByLabelText('Loading');
		expect(loadingElement).toHaveAttribute('aria-label', 'Loading');
	});
});
