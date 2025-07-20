/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import Footer from '../../components/footer/footer';

// Mock react-icons to avoid potential issues
jest.mock('react-icons/fa6', () => ({
	FaGithub: () => <span data-testid="github-icon">GitHub Icon</span>,
}));

describe('Footer', () => {
	beforeEach(() => {
		// Reset environment variables for consistent testing
		process.env.APP_VERSION = '2.2.1';
		process.env.LAST_PUBLISH = '2025-01-15T10:00:00.000Z';
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders without crashing', () => {
		render(<Footer />);
		expect(screen.getByRole('contentinfo')).toBeInTheDocument();
	});

	it('displays the copyright year correctly', () => {
		render(<Footer />);
		const currentYear = new Date().getFullYear();
		expect(
			screen.getByText(`Copyright © ${currentYear} - All right reserved`),
		).toBeInTheDocument();
	});

	it('displays the app version from environment variable', () => {
		render(<Footer />);
		expect(screen.getByText(/v2\.2\.1/)).toBeInTheDocument();
	});

	it('formats and displays the last publish date correctly', () => {
		render(<Footer />);
		// The date should be formatted as "January 15, 2025"
		expect(screen.getByText(/January 15, 2025/)).toBeInTheDocument();
	});

	it('renders the TryphonX portfolio link with correct attributes', () => {
		render(<Footer />);
		const portfolioLink = screen.getByLabelText("To TryphonX's Portfolio");
		expect(portfolioLink).toHaveAttribute(
			'href',
			'https://tryphonx.github.io/',
		);
		expect(portfolioLink).toHaveAttribute('target', '_blank');
	});

	it('renders the avatar image with correct attributes', () => {
		render(<Footer />);
		const avatarImage = screen.getByAltText("TryphonX's avatar");
		expect(avatarImage).toHaveAttribute(
			'src',
			'/CMS-Tuning-Calculator/images/Avatar2020.webp',
		);
		expect(avatarImage).toHaveAttribute('width', '54');
		expect(avatarImage).toHaveAttribute('height', '54');
	});

	it('renders the GitHub issues link with correct attributes', () => {
		render(<Footer />);
		const githubLink = screen.getByRole('link', { name: /open an issue/i });
		expect(githubLink).toHaveAttribute(
			'href',
			'https://github.com/TryphonX/CMS-Tuning-Calculator/issues/new',
		);
		expect(githubLink).toHaveAttribute('target', '_blank');
	});

	it('renders the GitHub button with icon and text', () => {
		render(<Footer />);
		const githubButton = screen.getByRole('button', {
			name: /open an issue/i,
		});
		expect(githubButton).toBeInTheDocument();
		// Check that the GitHub icon is present
		expect(screen.getByTestId('github-icon')).toBeInTheDocument();
	});

	it('has proper semantic structure with footer element', () => {
		render(<Footer />);
		const footer = screen.getByRole('contentinfo');
		expect(footer).toHaveClass('footer', 'md:footer-horizontal');
	});

	it('handles different date formats in LAST_PUBLISH environment variable', () => {
		// Test with a different date
		process.env.LAST_PUBLISH = '2024-12-25T15:30:00.000Z';
		render(<Footer />);
		expect(screen.getByText(/December 25, 2024/)).toBeInTheDocument();
	});

	it('displays version and date in the same line with proper styling', () => {
		render(<Footer />);
		const versionElement = screen.getByText('v2.2.1');
		expect(versionElement).toBeInTheDocument();

		// Check that version and date are in the same paragraph
		const versionParagraph = versionElement.closest('p');
		expect(versionParagraph).toHaveTextContent('v2.2.1 | January 15, 2025');
	});
});
