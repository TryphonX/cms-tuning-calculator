import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock the child components
jest.mock('@/components/aboutSection/aboutSection', () => {
	return function MockAboutSection() {
		return <div data-testid="about-section">About Section</div>;
	};
});

jest.mock('@/components/githubIssueSection/githubIssueSection', () => {
	return function MockGithubIssueSection() {
		return (
			<div data-testid="github-issue-section">GitHub Issue Section</div>
		);
	};
});

describe('Home Page', () => {
	it('renders the home page with correct components', () => {
		render(<Home />);

		expect(screen.getByTestId('about-section')).toBeInTheDocument();
		expect(screen.getByTestId('github-issue-section')).toBeInTheDocument();
	});

	it('renders AboutSection before GithubIssueSection', () => {
		render(<Home />);

		const aboutSection = screen.getByTestId('about-section');
		const githubSection = screen.getByTestId('github-issue-section');

		// Check order in DOM
		expect(aboutSection.compareDocumentPosition(githubSection)).toBe(
			Node.DOCUMENT_POSITION_FOLLOWING,
		);
	});
});
