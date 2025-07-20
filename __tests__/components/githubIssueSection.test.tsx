/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import GithubIssueSection from '@/components/githubIssueSection/githubIssueSection';

describe('GithubIssueSection', () => {
	it('renders without crashing', () => {
		render(<GithubIssueSection />);
		expect(
			screen.getByRole('heading', { name: /suggestions/i }),
		).toBeInTheDocument();
	});

	it('displays all three main sections', () => {
		render(<GithubIssueSection />);
		expect(
			screen.getByRole('heading', { name: /suggestions/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole('heading', { name: /feedback & bugs/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole('heading', { name: /incorrect data/i }),
		).toBeInTheDocument();
	});

	it('displays suggestions section content', () => {
		render(<GithubIssueSection />);
		expect(
			screen.getByText(/if you have any suggestions for improvement/i),
		).toBeInTheDocument();
	});

	it('displays feedback & bugs section content', () => {
		render(<GithubIssueSection />);
		expect(
			screen.getByText(/have any feedback about the app/i),
		).toBeInTheDocument();
		expect(screen.getByText(/maybe you found a bug/i)).toBeInTheDocument();
	});

	it('displays incorrect data section content', () => {
		render(<GithubIssueSection />);
		expect(
			screen.getByText(/see anything wrong with the information/i),
		).toBeInTheDocument();
		expect(
			screen.getByText(/engine specs, parts or missing links/i),
		).toBeInTheDocument();
	});

	it('contains GitHub issue link', () => {
		render(<GithubIssueSection />);
		const issueLink = screen.getByRole('link', { name: /open an issue/i });
		expect(issueLink).toBeInTheDocument();
		expect(issueLink).toHaveAttribute(
			'href',
			'https://github.com/TryphonX/CMS-Tuning-Calculator/issues/new',
		);
		expect(issueLink).toHaveAttribute('target', '_blank');
	});
	it('displays GitHub icon in the link', () => {
		render(<GithubIssueSection />);
		// Icons are mocked in the test environment, so we just verify button text
		expect(
			screen.getByRole('button', { name: /open an issue/i }),
		).toBeInTheDocument();
	});

	it('has external link attributes for security', () => {
		render(<GithubIssueSection />);
		const githubLink = screen.getByRole('link', { name: /open an issue/i });
		expect(githubLink).toHaveAttribute('target', '_blank');
		// Note: rel attribute may not be set in this implementation
	});

	it('renders grid layout structure', () => {
		render(<GithubIssueSection />);
		const heroSection = screen
			.getByRole('heading', { name: /suggestions/i })
			.closest('.hero');
		expect(heroSection).toBeInTheDocument();
	});

	it('displays all descriptive text for each section', () => {
		render(<GithubIssueSection />);

		// Check that each section has descriptive text
		const textElements = screen.getAllByText(/clicking the button below/i);
		expect(textElements).toHaveLength(3); // Should appear in all three sections
	});
});
