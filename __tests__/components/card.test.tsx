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

	it('renders without crashing', () => {
		render(<Card>Test content</Card>);
		expect(screen.getByText('Test content')).toBeInTheDocument();
	});

	it('applies correct base classes and structure', () => {
		const { container } = render(<Card>Test content</Card>);
		const card = container.firstChild as HTMLElement;

		expect(card).toHaveClass(
			'card',
			'card-border',
			'rounded-2xl',
			'border-base-content/10',
			'shadow-xl',
			'shadow-base-200',
		);

		// Check for card-body structure
		const cardBody = card.querySelector('.card-body');
		expect(cardBody).toBeInTheDocument();
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

	it('applies custom className when provided', () => {
		const { container } = render(
			<Card className="custom-class">Test content</Card>,
		);
		const card = container.firstChild as HTMLElement;

		expect(card).toHaveClass('custom-class');
	});

	describe('Header functionality', () => {
		it('renders title when provided', () => {
			render(<Card title="Test Title">Content</Card>);

			expect(screen.getByText('Test Title')).toBeInTheDocument();
			expect(screen.getByText('Test Title')).toHaveClass('card-title');
		});

		it('renders divider after title', () => {
			const { container } = render(
				<Card title="Test Title">Content</Card>,
			);

			const divider = container.querySelector('.divider');
			expect(divider).toBeInTheDocument();
			expect(divider).toHaveClass('my-0');
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
					className: 'btn-primary',
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
			).toBeInTheDocument();
		});

		it('applies correct action button classes', () => {
			const actions: Action[] = [
				{
					label: 'Default Action',
					onClick: mockOnClick,
				},
				{
					label: 'Primary Action',
					onClick: mockOnClick,
					className: 'btn-primary',
				},
			];

			render(
				<Card title="Test" actions={actions}>
					Content
				</Card>,
			);

			const defaultButton = screen.getByRole('button', {
				name: /default action/i,
			});
			const primaryButton = screen.getByRole('button', {
				name: /primary action/i,
			});

			expect(defaultButton).toHaveClass(
				'btn',
				'join-item',
				'btn-sm',
				'btn-neutral',
			);
			expect(primaryButton).toHaveClass(
				'btn',
				'join-item',
				'btn-sm',
				'btn-primary',
			);
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

		it('displays optional labels on larger screens', () => {
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

			// Check that optional label has responsive hiding class
			const optionalSpan = button.querySelector('.max-sm\\:hidden');
			expect(optionalSpan).toBeInTheDocument();
			expect(optionalSpan).toHaveTextContent('Document');
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
					className: 'btn-primary',
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

		it('applies correct footer action classes and structure', () => {
			const footerActions: Action[] = [
				{
					label: 'Footer Action',
					onClick: mockOnClick,
					className: 'btn-secondary',
				},
			];

			const { container } = render(
				<Card footerActions={footerActions}>Content</Card>,
			);

			const footerContainer = container.querySelector('.card-actions');
			expect(footerContainer).toBeInTheDocument();
			expect(footerContainer).toHaveClass('justify-end');

			const button = screen.getByRole('button', {
				name: /footer action/i,
			});
			expect(button).toHaveClass('btn', 'btn-secondary');
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
			expect(
				screen.getByRole('button', { name: /save/i }),
			).toBeInTheDocument();
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
