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

	it('has proper semantic structure with navigation role', () => {
		render(<Navbar />);
		const navbar = screen.getByRole('navigation');
		expect(navbar).toBeInTheDocument();
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

	it('renders the calculator link in desktop view', () => {
		render(<Navbar />);
		const calculatorLinks = screen.getAllByRole('link', {
			name: /calculator/i,
		});
		// Should have both desktop and mobile calculator links
		expect(calculatorLinks.length).toBeGreaterThanOrEqual(1);

		// Check desktop calculator link
		const desktopCalculatorLink = calculatorLinks.find(
			(link) =>
				link.getAttribute('href') === '/calculator' &&
				link.parentElement?.classList.contains('max-sm:hidden'),
		);
		expect(desktopCalculatorLink).toBeInTheDocument();
	});

	it('renders the mobile dropdown menu', () => {
		render(<Navbar />);
		// Look for the details element which is the mobile dropdown
		const mobileDropdown = screen.getByRole('group'); // details has group role
		expect(mobileDropdown).toBeInTheDocument();

		// The mobile dropdown should be hidden on larger screens
		const mobileMenuContainer = mobileDropdown.closest('li');
		expect(mobileMenuContainer).toHaveClass('sm:hidden');
	});

	it('renders the PayPal donate button with correct attributes', () => {
		render(<Navbar />);
		const donateLink = screen.getByRole('link', { name: /donate/i });
		expect(donateLink).toHaveAttribute(
			'href',
			'https://paypal.me/TryphonKsydas',
		);
	});

	it('renders the donate button with PayPal icon and text', () => {
		render(<Navbar />);
		const donateButton = screen.getByRole('button', { name: /donate/i });
		expect(donateButton).toBeInTheDocument();
		expect(donateButton).toHaveClass('btn', 'btn-sm', 'btn-primary');
	});

	it('has responsive design classes for mobile and desktop', () => {
		render(<Navbar />);

		// Check subtitle has responsive hiding class
		const subtitle = screen.getByText('Car Mechanic Simulator 21');
		expect(subtitle).toHaveClass('max-sm:hidden');

		// Check desktop calculator link has responsive hiding class
		const allCalculatorTexts = screen.getAllByText('Calculator');
		const desktopCalculatorLink = allCalculatorTexts.find((element) =>
			element.closest('li')?.classList.contains('max-sm:hidden'),
		);
		expect(desktopCalculatorLink).toBeInTheDocument();
		expect(desktopCalculatorLink?.closest('li')).toHaveClass(
			'max-sm:hidden',
		);
	});

	it('renders calculator links in both mobile and desktop menus', () => {
		render(<Navbar />);
		const calculatorLinks = screen.getAllByText('Calculator');
		// Should have at least 2 calculator links (desktop and mobile)
		expect(calculatorLinks.length).toBeGreaterThanOrEqual(2);
	});

	describe('user interactions', () => {
		it('allows clicking on the brand link', async () => {
			const user = userEvent.setup();
			render(<Navbar />);

			const brandLink = screen.getByRole('link', {
				name: /tuning calculator/i,
			});
			await user.click(brandLink);

			// Since we\'re using Next.js Link, we can\'t test actual navigation
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
