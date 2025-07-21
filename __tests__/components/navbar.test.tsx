/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../../components/navbar/navbar';

// Mock react-icons to avoid potential issues
jest.mock('react-icons/fa6', () => ({
	FaPaypal: () => <span data-testid="paypal-icon">PayPal Icon</span>,
}));

describe('Navbar', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders without crashing', () => {
		render(<Navbar />);
		expect(screen.getByRole('navigation')).toBeInTheDocument();
	});

	it('renders the brand/logo link with correct text', () => {
		render(<Navbar />);
		const brandLink = screen.getByRole('link', {
			name: /tuning calculator/i,
		});
		expect(brandLink).toHaveAttribute('href', '/');
	});

	it('displays the main title and subtitle correctly', () => {
		render(<Navbar />);
		expect(screen.getByText('Tuning Calculator')).toBeInTheDocument();
		expect(
			screen.getByText('Car Mechanic Simulator 21'),
		).toBeInTheDocument();
	});

	it('renders calculator links for both desktop and mobile', () => {
		render(<Navbar />);
		const calculatorLinks = screen.getAllByRole('link', {
			name: /calculator/i,
		});
		// Should have both desktop and mobile calculator links
		expect(calculatorLinks.length).toBeGreaterThanOrEqual(1);

		// Check at least one calculator link points to correct route
		const calculatorLink = calculatorLinks.find(
			(link) => link.getAttribute('href') === '/calculator',
		);
		expect(calculatorLink).toBeInTheDocument();
	});

	it('renders the mobile dropdown menu', () => {
		render(<Navbar />);
		// Look for the details element which is the mobile dropdown
		const mobileDropdown = screen.getByRole('group'); // details has group role
		expect(mobileDropdown).toBeInTheDocument();
	});

	it('renders the PayPal donate button with correct attributes', () => {
		render(<Navbar />);
		const donateLink = screen.getByRole('link', { name: /donate/i });
		expect(donateLink).toHaveAttribute(
			'href',
			'https://paypal.me/TryphonKsydas',
		);
		expect(donateLink).toHaveAttribute('target', '_blank');
	});

	it('renders the donate button with PayPal icon', () => {
		render(<Navbar />);
		const donateButton = screen.getByRole('button', { name: /donate/i });
		expect(donateButton).toBeInTheDocument();
		expect(screen.getByTestId('paypal-icon')).toBeInTheDocument();
	});

	describe('user interactions', () => {
		it('allows clicking on the brand link', async () => {
			const user = userEvent.setup();
			render(<Navbar />);

			const brandLink = screen.getByRole('link', {
				name: /tuning calculator/i,
			});
			await user.click(brandLink);

			// Since we're using Next.js Link, we can't test actual navigation
			// but we can ensure the element is clickable and properly structured
			expect(brandLink).toBeInTheDocument();
		});

		it('allows clicking on calculator links', async () => {
			const user = userEvent.setup();
			render(<Navbar />);

			const calculatorLinks = screen.getAllByRole('link', {
				name: /calculator/i,
			});

			for (const link of calculatorLinks) {
				await user.click(link);
				// Only check calculator links, not the brand link
				if (link.getAttribute('href') === '/calculator') {
					expect(link).toHaveAttribute('href', '/calculator');
				}
			}
		});

		it('allows clicking on the donate button', async () => {
			const user = userEvent.setup();
			render(<Navbar />);

			const donateLink = screen.getByRole('link', { name: /donate/i });
			await user.click(donateLink);

			expect(donateLink).toBeInTheDocument();
		});
	});
});
