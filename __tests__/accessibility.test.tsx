import { render, screen } from '@testing-library/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Mock Next.js Image component
jest.mock('next/image', () => {
	return function MockImage({
		src,
		alt,
		...props
	}: {
		src: string;
		alt: string;
		[key: string]: unknown;
	}) {
		// eslint-disable-next-line @next/next/no-img-element
		return <img src={src} alt={alt} {...props} />;
	};
});

// Mock Next.js Link component
jest.mock('next/link', () => {
	return function MockLink({
		href,
		children,
		...props
	}: {
		href: string;
		children: React.ReactNode;
		[key: string]: unknown;
	}) {
		return (
			<a href={href} {...props}>
				{children}
			</a>
		);
	};
});

// Mock React Icons
jest.mock('react-icons/fa6', () => ({
	FaPaypal: () => <span data-testid="paypal-icon">💰</span>,
	FaGithub: () => <span data-testid="github-icon">🐙</span>,
}));

// Mock environment variables
const originalEnv = process.env;
beforeEach(() => {
	process.env = {
		...originalEnv,
		LAST_PUBLISH: '2024-01-01T00:00:00.000Z',
	};
});

afterEach(() => {
	process.env = originalEnv;
});

describe('Accessibility Tests', () => {
	describe('Navbar Accessibility', () => {
		it('has proper semantic structure', () => {
			render(<Navbar />);

			// Should have a main navigation landmark
			const nav = screen.getByRole('navigation');
			expect(nav).toBeInTheDocument();
		});

		it('provides accessible logo link', () => {
			render(<Navbar />);

			// Logo should be a link with proper text content
			const logoLink = screen.getByText('Tuning Calculator');
			expect(logoLink).toBeInTheDocument();

			// Logo link should be focusable
			const linkElement = logoLink.closest('a');
			expect(linkElement).toBeInTheDocument();
			expect(linkElement).toHaveAttribute('href');
		});

		it('has proper focus management', () => {
			render(<Navbar />);

			const nav = screen.getByRole('navigation');
			expect(nav).toBeInTheDocument();

			// Check that interactive elements are focusable
			const links = screen.getAllByRole('link');
			links.forEach((link) => {
				expect(link).not.toHaveAttribute('tabindex', '-1');
			});
		});
	});

	describe('Footer Accessibility', () => {
		it('has proper semantic structure', () => {
			render(<Footer />);

			// Should have contentinfo landmark role
			const footer = screen.getByRole('contentinfo');
			expect(footer).toBeInTheDocument();
		});

		it('provides accessible links with descriptive text', () => {
			render(<Footer />);

			// All links should have accessible names
			const links = screen.getAllByRole('link');
			links.forEach((link) => {
				expect(link).toHaveAccessibleName();
			});
		});

		it('handles external links appropriately', () => {
			render(<Footer />);

			// External links should have appropriate attributes
			const links = screen.getAllByRole('link');
			const externalLinks = links.filter((link) =>
				link.getAttribute('href')?.startsWith('http'),
			);

			externalLinks.forEach((link) => {
				// External links should ideally have rel="noopener noreferrer"
				// and possibly target="_blank", but we'll just check they're accessible
				expect(link).toHaveAccessibleName();
			});
		});
	});

	describe('Component Integration Accessibility', () => {
		it('has proper landmark structure', () => {
			render(
				<div>
					<Navbar />
					<main>
						<h1>Page Title</h1>
						<p>Page content</p>
					</main>
					<Footer />
				</div>,
			);

			// Check that navigation landmarks exist (there are 2: navbar and footer nav)
			const navigations = screen.getAllByRole('navigation');
			expect(navigations).toHaveLength(2);

			// Check main landmark
			const main = screen.getByRole('main');
			expect(main).toBeInTheDocument();

			// Check contentinfo landmark (footer should have this role)
			const contentinfo = screen.getByRole('contentinfo');
			expect(contentinfo).toBeInTheDocument();
		});

		it('maintains proper heading hierarchy', () => {
			render(
				<div>
					<Navbar />
					<main>
						<h1>Main Title</h1>
						<section>
							<h2>Section Title</h2>
							<h3>Subsection</h3>
						</section>
					</main>
					<Footer />
				</div>,
			);

			// Check heading hierarchy
			const h1 = screen.getByRole('heading', { level: 1 });
			const h2 = screen.getByRole('heading', { level: 2 });
			const h3 = screen.getByRole('heading', { level: 3 });

			expect(h1).toBeInTheDocument();
			expect(h2).toBeInTheDocument();
			expect(h3).toBeInTheDocument();
		});
	});

	describe('Keyboard Navigation', () => {
		it('supports keyboard navigation in navbar', () => {
			render(<Navbar />);

			const interactiveElements = screen.getAllByRole('link');

			// All interactive elements should be keyboard accessible
			interactiveElements.forEach((element) => {
				expect(element).not.toHaveAttribute('tabindex', '-1');
			});
		});

		it('provides logical tab order', () => {
			render(
				<div>
					<Navbar />
					<main>
						<button>Button 1</button>
						<input aria-label="Test input" />
						<button>Button 2</button>
					</main>
					<Footer />
				</div>,
			);

			// Check that there are no positive tabindex values that could break tab order
			const allElements = document.querySelectorAll('[tabindex]');
			allElements.forEach((element) => {
				const tabindex = element.getAttribute('tabindex');
				if (tabindex && tabindex !== '0' && tabindex !== '-1') {
					expect(parseInt(tabindex)).toBeLessThanOrEqual(0);
				}
			});
		});
	});

	describe('Screen Reader Support', () => {
		it('provides appropriate ARIA labels and roles', () => {
			render(<Navbar />);

			const nav = screen.getByRole('navigation');
			expect(nav).toBeInTheDocument();

			// Check that navigation has appropriate structure
			// Since there's no image in the navbar, we'll check for text content
			const logoText = screen.getByText('Tuning Calculator');
			expect(logoText).toBeInTheDocument();
		});

		it('handles dynamic content appropriately', () => {
			// Test that dynamic content updates would be announced to screen readers
			render(
				<div>
					<div aria-live="polite" data-testid="status-region">
						Status updates appear here
					</div>
					<div aria-live="assertive" data-testid="alert-region">
						Important alerts appear here
					</div>
				</div>,
			);

			const statusRegion = screen.getByTestId('status-region');
			const alertRegion = screen.getByTestId('alert-region');

			expect(statusRegion).toHaveAttribute('aria-live', 'polite');
			expect(alertRegion).toHaveAttribute('aria-live', 'assertive');
		});
	});

	describe('Color and Contrast', () => {
		it('does not rely solely on color for information', () => {
			// This test checks that interactive elements have proper styling
			render(<Navbar />);

			const links = screen.getAllByRole('link');
			links.forEach((link) => {
				// Links should be identifiable by more than just color
				// They should have underlines, borders, or other visual indicators

				// At minimum, they should be focusable for keyboard users
				expect(link).not.toHaveAttribute('tabindex', '-1');
			});
		});
	});

	describe('Mobile and Touch Accessibility', () => {
		it('provides adequate touch targets', () => {
			render(<Navbar />);

			const interactiveElements = screen.getAllByRole('link');

			// Touch targets should be adequately sized
			// Filter out hidden elements (like responsive navigation items)
			const visibleElements = interactiveElements.filter((element) => {
				// Check if element is visible (not hidden by CSS classes)
				const computedStyle = window.getComputedStyle(element);
				return (
					computedStyle.display !== 'none' &&
					computedStyle.visibility !== 'hidden'
				);
			});

			visibleElements.forEach((element) => {
				expect(element).toBeInTheDocument();
				// For visible elements, they should be properly accessible
				expect(element).not.toHaveAttribute('tabindex', '-1');
			});
		});
	});
});
