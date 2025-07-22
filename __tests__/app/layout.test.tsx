import { render, screen } from '@testing-library/react';
import RootLayout from '@/app/layout';

// Mock the Navbar component
jest.mock('@/components/Navbar', () => {
	return function MockNavbar() {
		return <nav data-testid="navbar">Navbar</nav>;
	};
});

// Mock the Footer component
jest.mock('@/components/Footer', () => {
	return function MockFooter() {
		return <footer data-testid="footer">Footer</footer>;
	};
});

// Mock Next.js font
jest.mock('next/font/google', () => ({
	Montserrat: () => ({
		className: 'mocked-montserrat-font',
	}),
}));

// Mock Next.js Head component
jest.mock('next/head', () => {
	return function MockHead({ children }: { children: React.ReactNode }) {
		return <div data-testid="head">{children}</div>;
	};
});

describe('RootLayout', () => {
	const mockChildren = (
		<div data-testid="page-content">Test Page Content</div>
	);

	it('includes Head component with preload links', () => {
		render(<RootLayout>{mockChildren}</RootLayout>);

		// Check that Head component is rendered
		expect(screen.getByTestId('head')).toBeInTheDocument();

		// Check for preload links in the Head component
		const headElement = screen.getByTestId('head');
		expect(headElement).toBeInTheDocument();
	});

	it('renders navbar at the top', () => {
		render(<RootLayout>{mockChildren}</RootLayout>);

		const navbar = screen.getByTestId('navbar');
		expect(navbar).toBeInTheDocument();
		expect(navbar).toHaveTextContent('Navbar');
	});

	it('renders children content in the middle', () => {
		render(<RootLayout>{mockChildren}</RootLayout>);

		const pageContent = screen.getByTestId('page-content');
		expect(pageContent).toBeInTheDocument();
		expect(pageContent).toHaveTextContent('Test Page Content');
	});

	it('renders footer at the bottom', () => {
		render(<RootLayout>{mockChildren}</RootLayout>);

		const footer = screen.getByTestId('footer');
		expect(footer).toBeInTheDocument();
		expect(footer).toHaveTextContent('Footer');
	});

	it('maintains correct order of elements', () => {
		render(<RootLayout>{mockChildren}</RootLayout>);

		// Check that key components are rendered in the correct order
		expect(screen.getByTestId('head')).toBeInTheDocument();
		expect(screen.getByTestId('navbar')).toBeInTheDocument();
		expect(screen.getByTestId('page-content')).toBeInTheDocument();
		expect(screen.getByTestId('footer')).toBeInTheDocument();
	});

	it('applies Montserrat font class to body', () => {
		const { container } = render(<RootLayout>{mockChildren}</RootLayout>);

		const bodyElement = container.querySelector('body');
		expect(bodyElement).toHaveClass('mocked-montserrat-font');
	});

	it('handles multiple children correctly', () => {
		const multipleChildren = (
			<>
				<div data-testid="child-1">Child 1</div>
				<div data-testid="child-2">Child 2</div>
			</>
		);

		render(<RootLayout>{multipleChildren}</RootLayout>);

		expect(screen.getByTestId('child-1')).toBeInTheDocument();
		expect(screen.getByTestId('child-2')).toBeInTheDocument();
		expect(screen.getByTestId('navbar')).toBeInTheDocument();
		expect(screen.getByTestId('footer')).toBeInTheDocument();
	});

	it('handles empty children', () => {
		render(<RootLayout>{null}</RootLayout>);

		// Navbar and Footer should still be present
		expect(screen.getByTestId('navbar')).toBeInTheDocument();
		expect(screen.getByTestId('footer')).toBeInTheDocument();
	});
});
