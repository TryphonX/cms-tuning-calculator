import { render, screen, fireEvent } from '@testing-library/react';
import Card from '@/components/card/card';
import { Action } from '@/@types/globals';

describe('Card Component - Edge Cases and Complex Scenarios', () => {
	const mockAction: Action = {
		label: 'Test Action',
		onClick: jest.fn(),
		className: 'btn-primary',
		optionalLabel: 'Optional',
	};

	const mockDisabledAction: Action = {
		label: 'Disabled Action',
		onClick: jest.fn(),
		disabled: true,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Action handling', () => {
		it('handles action clicks correctly', () => {
			const mockOnClick = jest.fn();
			const action: Action = {
				label: 'Clickable Action',
				onClick: mockOnClick,
			};

			render(<Card title="Test" actions={[action]} />);

			const actionButton = screen.getByText('Clickable Action');
			fireEvent.click(actionButton);

			expect(mockOnClick).toHaveBeenCalledTimes(1);
		});

		it('disables actions when disabled prop is true', () => {
			render(<Card title="Test" actions={[mockDisabledAction]} />);

			const actionButton = screen.getByText('Disabled Action');
			expect(actionButton).toBeDisabled();

			fireEvent.click(actionButton);
			expect(mockDisabledAction.onClick).not.toHaveBeenCalled();
		});

		it('shows optional labels only on larger screens', () => {
			render(<Card title="Test" actions={[mockAction]} />);

			const optionalLabel = screen.getByText('Optional');
			expect(optionalLabel).toHaveClass('max-sm:hidden');
		});

		it('handles actions without optional labels', () => {
			const actionWithoutOptional: Action = {
				label: 'Simple Action',
				onClick: jest.fn(),
			};

			render(<Card title="Test" actions={[actionWithoutOptional]} />);

			const actionButton = screen.getByText('Simple Action');
			expect(actionButton).toBeInTheDocument();
			expect(screen.queryByText('Optional')).not.toBeInTheDocument();
		});
	});

	describe('Footer actions', () => {
		it('handles footer action clicks', () => {
			const mockFooterClick = jest.fn();
			const footerAction: Action = {
				label: 'Footer Click',
				onClick: mockFooterClick,
			};

			render(<Card footerActions={[footerAction]} />);

			const footerButton = screen.getByText('Footer Click');
			fireEvent.click(footerButton);

			expect(mockFooterClick).toHaveBeenCalledTimes(1);
		});

		it('disables footer actions when disabled', () => {
			const disabledFooterAction: Action = {
				label: 'Disabled Footer',
				onClick: jest.fn(),
				disabled: true,
			};

			render(<Card footerActions={[disabledFooterAction]} />);

			const footerButton = screen.getByText('Disabled Footer');
			expect(footerButton).toBeDisabled();
		});
	});

	describe('Layout and styling', () => {
		it('applies custom className correctly', () => {
			render(<Card className="custom-class" />);

			const cardElement = document.querySelector('.card');
			expect(cardElement).toHaveClass('custom-class');
		});

		it('handles multiple custom classes', () => {
			render(<Card className="class1 class2 class3" />);

			const cardElement = document.querySelector('.card');
			expect(cardElement).toHaveClass('class1', 'class2', 'class3');
		});

		it('shows divider when title is present', () => {
			render(<Card title="Test Title" />);

			const divider = document.querySelector('.divider');
			expect(divider).toBeInTheDocument();
			expect(divider).toHaveClass('my-0');
		});

		it('does not show header or divider when no title', () => {
			render(<Card />);

			expect(screen.queryByText('.card-title')).not.toBeInTheDocument();
			expect(document.querySelector('.divider')).not.toBeInTheDocument();
		});
	});

	describe('Complex combinations', () => {
		it('handles card with title, actions, content, and footer actions', () => {
			const headerActions: Action[] = [
				{ label: 'Header Action', onClick: jest.fn() },
			];
			const footerActions: Action[] = [
				{ label: 'Footer Action', onClick: jest.fn() },
			];

			render(
				<Card
					title="Complete Card"
					actions={headerActions}
					footerActions={footerActions}
					className="custom-card"
				>
					<div data-testid="card-content">Card Content</div>
				</Card>,
			);

			// Check all elements are present
			expect(screen.getByText('Complete Card')).toBeInTheDocument();
			expect(screen.getByText('Header Action')).toBeInTheDocument();
			expect(screen.getByTestId('card-content')).toBeInTheDocument();
			expect(screen.getByText('Footer Action')).toBeInTheDocument();

			// Check styling
			const cardElement = document.querySelector('.card');
			expect(cardElement).toHaveClass('custom-card');
		});

		it('handles empty actions arrays', () => {
			render(<Card title="Test" actions={[]} footerActions={[]} />);

			expect(screen.getByText('Test')).toBeInTheDocument();
			expect(document.querySelector('.join')).not.toBeInTheDocument();
			expect(
				document.querySelector('.card-actions'),
			).not.toBeInTheDocument();
		});

		it('handles mixed enabled and disabled actions', () => {
			const mixedActions: Action[] = [
				{ label: 'Enabled', onClick: jest.fn() },
				{ label: 'Disabled', onClick: jest.fn(), disabled: true },
				{ label: 'Also Enabled', onClick: jest.fn() },
			];

			render(<Card title="Mixed Actions" actions={mixedActions} />);

			const enabledButton1 = screen.getByText('Enabled');
			const disabledButton = screen.getByText('Disabled');
			const enabledButton2 = screen.getByText('Also Enabled');

			expect(enabledButton1).not.toBeDisabled();
			expect(disabledButton).toBeDisabled();
			expect(enabledButton2).not.toBeDisabled();
		});

		it('handles actions with very long labels', () => {
			const longLabelAction: Action = {
				label: 'This is a very long action label that might cause layout issues',
				onClick: jest.fn(),
				optionalLabel: 'And this is an even longer optional label text',
			};

			render(<Card title="Long Labels" actions={[longLabelAction]} />);

			const actionButton = screen.getByText(
				'This is a very long action label that might cause layout issues',
			);
			const optionalLabel = screen.getByText(
				'And this is an even longer optional label text',
			);

			expect(actionButton).toBeInTheDocument();
			expect(optionalLabel).toHaveClass('max-sm:hidden');
		});

		it('maintains proper key uniqueness with similar action labels', () => {
			const similarActions: Action[] = [
				{ label: 'Action', onClick: jest.fn() },
				{ label: 'Action', onClick: jest.fn() }, // Duplicate label
			];

			// Should not throw key duplication warnings
			render(<Card title="Similar Actions" actions={similarActions} />);

			const actionButtons = screen.getAllByText('Action');
			expect(actionButtons).toHaveLength(2);
		});
	});

	describe('Children handling', () => {
		it('renders complex children content', () => {
			render(
				<Card title="Complex Content">
					<div data-testid="child1">Child 1</div>
					<ul data-testid="list">
						<li>Item 1</li>
						<li>Item 2</li>
					</ul>
					<button data-testid="child-button">Child Button</button>
				</Card>,
			);

			expect(screen.getByTestId('child1')).toBeInTheDocument();
			expect(screen.getByTestId('list')).toBeInTheDocument();
			expect(screen.getByTestId('child-button')).toBeInTheDocument();
			expect(screen.getByText('Item 1')).toBeInTheDocument();
			expect(screen.getByText('Item 2')).toBeInTheDocument();
		});

		it('handles null or undefined children', () => {
			render(<Card title="Empty Content">{null}</Card>);

			expect(screen.getByText('Empty Content')).toBeInTheDocument();
		});
	});
});
