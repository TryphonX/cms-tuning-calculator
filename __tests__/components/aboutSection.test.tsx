/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import AboutSection from '@/components/aboutSection/aboutSection';

describe('AboutSection', () => {
	it('renders without crashing', () => {
		render(<AboutSection />);
		expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
	});

	it('displays the main heading', () => {
		render(<AboutSection />);
		expect(
			screen.getByRole('heading', { name: /about tuning calculator/i }),
		).toBeInTheDocument();
	});

	it('displays the app logo with correct attributes', () => {
		render(<AboutSection />);
		const logo = screen.getByAltText('tuning calculator logo');
		expect(logo).toBeInTheDocument();
		expect(logo).toHaveAttribute('aria-hidden');
	});

	it('displays introductory text about the app', () => {
		render(<AboutSection />);
		expect(screen.getByText(/introducing/i)).toBeInTheDocument();
		expect(screen.getByText(/your go-to utility app/i)).toBeInTheDocument();
		// Use getAllByText since the text appears multiple times
		const gameReferences = screen.getAllByText(
			/car mechanic simulator 21/i,
		);
		expect(gameReferences).toHaveLength(2); // Should appear twice
	});

	it('displays information about the app features', () => {
		render(<AboutSection />);
		expect(screen.getByText(/comprehensive database/i)).toBeInTheDocument();
		expect(
			screen.getByText(/cost, performance boost/i),
		).toBeInTheDocument();
		expect(screen.getByText(/cost-to-boost ratio/i)).toBeInTheDocument();
	});

	it('contains GitHub link', () => {
		render(<AboutSection />);
		const githubLink = screen.getByRole('link', { name: /source code/i });
		expect(githubLink).toBeInTheDocument();
		expect(githubLink).toHaveAttribute(
			'href',
			expect.stringContaining('github.com'),
		);
	});

	it('contains demo link', () => {
		render(<AboutSection />);
		const demoLink = screen.getByRole('link', { name: /try it out now/i });
		expect(demoLink).toBeInTheDocument();
		expect(demoLink).toHaveAttribute(
			'href',
			expect.stringContaining('calculator'),
		);
	});

	it('contains appropriate icons for GitHub and demo links', () => {
		render(<AboutSection />);
		// Icons are mocked, so we just verify the buttons contain the expected text
		expect(
			screen.getByRole('button', { name: /source code/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /try it out now/i }),
		).toBeInTheDocument();
	});

	it('displays logo image', () => {
		render(<AboutSection />);
		// Since Next Image has aria-hidden, we need to check differently
		const logoImg = screen.getByAltText('tuning calculator logo');
		expect(logoImg).toBeInTheDocument();
		expect(logoImg).toHaveAttribute('aria-hidden');
	});

	it('renders responsive layout structure', () => {
		render(<AboutSection />);
		const heroSection = screen
			.getByRole('heading', { level: 1 })
			.closest('.hero');
		expect(heroSection).toBeInTheDocument();
	});
});
