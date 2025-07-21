/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import MissingPartAlert from '@/components/MissingPartAlert';

// Mock Next.js Link component
jest.mock('next/link', () => {
	const MockLink = ({
		children,
		href,
		target,
		className,
	}: {
		children: React.ReactNode;
		href: string;
		target?: string;
		className?: string;
	}) => (
		<a href={href} target={target} className={className}>
			{children}
		</a>
	);
	MockLink.displayName = 'MockLink';
	return MockLink;
});

// Mock React Icons
jest.mock('react-icons/fa6', () => ({
	FaTriangleExclamation: () => (
		<span aria-hidden data-testid="warning-icon" />
	),
}));

describe('MissingPartAlert', () => {
	it('renders alert when partMissing is true', () => {
		render(<MissingPartAlert partMissing={true} />);

		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.getByTestId('warning-icon')).toBeInTheDocument();
	});

	it('does not render anything when partMissing is false', () => {
		render(<MissingPartAlert partMissing={false} />);

		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
		expect(screen.queryByTestId('warning-icon')).not.toBeInTheDocument();
	});

	it('displays main warning message', () => {
		render(<MissingPartAlert partMissing={true} />);

		expect(
			screen.getByText(/Some parts are missing data!/),
		).toBeInTheDocument();
		expect(
			screen.getByText(/Please double check within the game/),
		).toBeInTheDocument();
	});

	it('displays help message', () => {
		render(<MissingPartAlert partMissing={true} />);

		expect(
			screen.getByText(
				/Any help filling in the missing data is welcome!/,
			),
		).toBeInTheDocument();
	});

	it('contains GitHub issue link', () => {
		render(<MissingPartAlert partMissing={true} />);

		const link = screen.getByRole('link', {
			name: /Open an issue on GitHub/,
		});
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute(
			'href',
			'https://github.com/TryphonX/CMS-Tuning-Calculator/issues/new',
		);
		expect(link).toHaveAttribute('target', '_blank');
	});

	it('has warning icon with proper accessibility', () => {
		render(<MissingPartAlert partMissing={true} />);

		const icon = screen.getByTestId('warning-icon');
		expect(icon).toBeInTheDocument();
		// Icon should be aria-hidden since it's decorative
		expect(icon).toHaveAttribute('aria-hidden');
	});

	it('returns null correctly when partMissing is false', () => {
		const { container } = render(<MissingPartAlert partMissing={false} />);
		expect(container.firstChild).toBeNull();
	});
});
