/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from '../../components/card/card';
import { Action } from '../../@types/globals';

describe('Card', () => {
	const mockOnClick = jest.fn();

	beforeEach(() => {
		mockOnClick.mockClear();
	});

	it('renders children content correctly', () => {
		render(
			<Card>
				<div data-testid="child-content">
					<p>Paragraph content</p>
					<span>Span content</span>
				</div>
			</Card>,
		);

		expect(screen.getByTestId('child-content')).toBeInTheDocument();
		expect(screen.getByText('Paragraph content')).toBeInTheDocument();
		expect(screen.getByText('Span content')).toBeInTheDocument();
	});

	describe('Header functionality', () => {
		it('renders title and divider when title is provided', () => {
			render(<Card title="Test Title">Content</Card>);

			expect(screen.getByText('Test Title')).toBeInTheDocument();

			const { container } = render(
				<Card title="Test Title">Content</Card>,
			);
			const divider = container.querySelector('.divider');
			expect(divider).toBeInTheDocument();
		});

		it('does not render header when title is not provided', () => {
			const { container } = render(<Card>Content</Card>);

			expect(
				container.querySelector('.card-title'),
			).not.toBeInTheDocument();
			expect(container.querySelector('.divider')).not.toBeInTheDocument();
		});

		it('renders header actions when provided', () => {
			const actions: Action[] = [
				{
					label: 'Action 1',
					onClick: mockOnClick,
				},
				{
					label: 'Action 2',
					onClick: mockOnClick,
					className: 'btn-secondary',
				},
			];

			render(
				<Card title="Test Title" actions={actions}>
					Content
				</Card>,
			);

			expect(
				screen.getByRole('button', { name: /action 1/i }),
			).toBeInTheDocument();
			expect(
				screen.getByRole('button', { name: /action 2/i }),
			).toHaveClass('btn-secondary');
		});

		it('applies custom className to header actions when provided', () => {
			const actions: Action[] = [
				{
					label: 'Custom Action',
					onClick: mockOnClick,
					className: 'btn-primary',
				},
			];

			render(
				<Card title="Test" actions={actions}>
					Content
				</Card>,
			);

			const button = screen.getByRole('button', {
				name: /custom action/i,
			});
			expect(button).toHaveClass('btn-primary');
		});

		it('handles disabled actions correctly', () => {
			const actions: Action[] = [
				{
					label: 'Disabled Action',
					onClick: mockOnClick,
					disabled: true,
				},
			];

			render(
				<Card title="Test" actions={actions}>
					Content
				</Card>,
			);

			const button = screen.getByRole('button', {
				name: /disabled action/i,
			});
			expect(button).toBeDisabled();
		});

		it('renders optional labels on larger screens', () => {
			const actions: Action[] = [
				{
					label: 'Save',
					optionalLabel: 'Document',
					onClick: mockOnClick,
				},
			];

			render(
				<Card title="Test" actions={actions}>
					Content
				</Card>,
			);

			const button = screen.getByRole('button', { name: /save/i });
			expect(button).toHaveTextContent('Save Document');
		});
	});

	describe('Footer actions functionality', () => {
		it('renders footer actions when provided', () => {
			const footerActions: Action[] = [
				{
					label: 'Cancel',
					onClick: mockOnClick,
				},
				{
					label: 'Save',
					onClick: mockOnClick,
				},
			];

			render(<Card footerActions={footerActions}>Content</Card>);

			expect(
				screen.getByRole('button', { name: /cancel/i }),
			).toBeInTheDocument();
			expect(
				screen.getByRole('button', { name: /save/i }),
			).toBeInTheDocument();
		});

		it('applies custom className to footer actions when provided', () => {
			const footerActions: Action[] = [
				{
					label: 'Save',
					onClick: mockOnClick,
					className: 'btn-primary',
				},
			];

			render(<Card footerActions={footerActions}>Content</Card>);

			const button = screen.getByRole('button', { name: /save/i });
			expect(button).toHaveClass('btn-primary');
		});

		it('does not render footer when no footer actions provided', () => {
			const { container } = render(<Card>Content</Card>);

			expect(
				container.querySelector('.card-actions'),
			).not.toBeInTheDocument();
		});
	});

	describe('User interactions', () => {
		it('calls onClick when header action is clicked', async () => {
			const user = userEvent.setup();
			const actions: Action[] = [
				{
					label: 'Clickable Action',
					onClick: mockOnClick,
				},
			];

			render(
				<Card title="Test" actions={actions}>
					Content
				</Card>,
			);

			const button = screen.getByRole('button', {
				name: /clickable action/i,
			});
			await user.click(button);

			expect(mockOnClick).toHaveBeenCalledTimes(1);
			expect(mockOnClick).toHaveBeenCalledWith(expect.any(Object));
		});

		it('calls onClick when footer action is clicked', async () => {
			const user = userEvent.setup();
			const footerActions: Action[] = [
				{
					label: 'Footer Click',
					onClick: mockOnClick,
				},
			];

			render(<Card footerActions={footerActions}>Content</Card>);

			const button = screen.getByRole('button', {
				name: /footer click/i,
			});
			await user.click(button);

			expect(mockOnClick).toHaveBeenCalledTimes(1);
		});

		it('does not call onClick when button is disabled', async () => {
			const user = userEvent.setup();
			const actions: Action[] = [
				{
					label: 'Disabled Button',
					onClick: mockOnClick,
					disabled: true,
				},
			];

			render(
				<Card title="Test" actions={actions}>
					Content
				</Card>,
			);

			const button = screen.getByRole('button', {
				name: /disabled button/i,
			});
			await user.click(button);

			expect(mockOnClick).not.toHaveBeenCalled();
		});
	});

	describe('Complex scenarios', () => {
		it('renders card with title, actions, content, and footer actions', () => {
			const headerActions: Action[] = [
				{ label: 'Edit', onClick: mockOnClick },
			];
			const footerActions: Action[] = [
				{ label: 'Cancel', onClick: mockOnClick },
				{
					label: 'Save',
					onClick: mockOnClick,
					className: 'btn-primary',
				},
			];

			render(
				<Card
					title="Complex Card"
					className="custom-card"
					actions={headerActions}
					footerActions={footerActions}
				>
					<div>
						<h3>Content Title</h3>
						<p>Content paragraph</p>
					</div>
				</Card>,
			);

			// Check all elements are present
			expect(screen.getByText('Complex Card')).toBeInTheDocument();
			expect(
				screen.getByRole('button', { name: /edit/i }),
			).toBeInTheDocument();
			expect(screen.getByText('Content Title')).toBeInTheDocument();
			expect(screen.getByText('Content paragraph')).toBeInTheDocument();
			expect(
				screen.getByRole('button', { name: /cancel/i }),
			).toBeInTheDocument();

			// Check custom className is applied
			const saveButton = screen.getByRole('button', { name: /save/i });
			expect(saveButton).toBeInTheDocument();
			expect(saveButton).toHaveClass('btn-primary');
		});

		it('handles empty actions array correctly', () => {
			const { container } = render(
				<Card title="Test" actions={[]} footerActions={[]}>
					Content
				</Card>,
			);

			expect(screen.getByText('Test')).toBeInTheDocument();
			expect(screen.getByText('Content')).toBeInTheDocument();

			// Should not render action containers for empty arrays
			expect(container.querySelector('.join')).not.toBeInTheDocument();
			// Footer actions container may still exist but be empty
			const footerActions = container.querySelector('.card-actions');
			if (footerActions) {
				expect(footerActions.children).toHaveLength(0);
			}
		});
	});
});
