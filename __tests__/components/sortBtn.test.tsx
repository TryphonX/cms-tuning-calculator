/* eslint-env jest */
import { render, screen, fireEvent } from '@testing-library/react';
import SortBtn from '@/components/SortBtn';
import { PartSortBy } from '@/@types/globals';

// Mock the custom events module
jest.mock('@/modules/customEvents', () => ({
	UpdateSortEvent: {
		dispatch: jest.fn(),
	},
}));

import { UpdateSortEvent } from '@/modules/customEvents';

describe('SortBtn', () => {
	const mockValues: [PartSortBy, PartSortBy] = ['cost_asc', 'cost_desc'];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders without crashing', () => {
		render(<SortBtn sortBy="cost_asc" values={mockValues} />);
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it('displays up caret when sortBy matches first value', () => {
		render(<SortBtn sortBy="cost_asc" values={mockValues} />);
		expect(screen.getByLabelText('Sort ascending')).toBeInTheDocument();
		expect(
			screen.queryByLabelText('Sort descending'),
		).not.toBeInTheDocument();
	});

	it('displays down caret when sortBy matches second value', () => {
		render(<SortBtn sortBy="cost_desc" values={mockValues} />);
		expect(screen.getByLabelText('Sort descending')).toBeInTheDocument();
		expect(
			screen.queryByLabelText('Sort ascending'),
		).not.toBeInTheDocument();
	});

	it('displays down caret when sortBy does not match any value', () => {
		render(<SortBtn sortBy="boost_asc" values={mockValues} />);
		expect(screen.getByLabelText('Sort descending')).toBeInTheDocument();
		expect(
			screen.queryByLabelText('Sort ascending'),
		).not.toBeInTheDocument();
	});

	it('applies active styling when sortBy matches one of the values', () => {
		render(<SortBtn sortBy="cost_asc" values={mockValues} />);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('btn-active');
	});

	it('does not apply active styling when sortBy does not match any value', () => {
		render(<SortBtn sortBy="boost_asc" values={mockValues} />);
		const button = screen.getByRole('button');
		expect(button).not.toHaveClass('btn-active');
	});

	it('dispatches correct event when clicked - from first to second value', () => {
		render(<SortBtn sortBy="cost_asc" values={mockValues} />);
		const button = screen.getByRole('button');

		fireEvent.click(button);

		expect(UpdateSortEvent.dispatch).toHaveBeenCalledWith('cost_desc');
		expect(UpdateSortEvent.dispatch).toHaveBeenCalledTimes(1);
	});

	it('dispatches correct event when clicked - from second to first value', () => {
		render(<SortBtn sortBy="cost_desc" values={mockValues} />);
		const button = screen.getByRole('button');

		fireEvent.click(button);

		expect(UpdateSortEvent.dispatch).toHaveBeenCalledWith('cost_asc');
		expect(UpdateSortEvent.dispatch).toHaveBeenCalledTimes(1);
	});

	it('dispatches first value when current sortBy does not match any value', () => {
		render(<SortBtn sortBy="boost_asc" values={mockValues} />);
		const button = screen.getByRole('button');

		fireEvent.click(button);

		expect(UpdateSortEvent.dispatch).toHaveBeenCalledWith('cost_asc');
		expect(UpdateSortEvent.dispatch).toHaveBeenCalledTimes(1);
	});

	it('handles different sort value combinations', () => {
		const boostValues: [PartSortBy, PartSortBy] = [
			'boost_asc',
			'boost_desc',
		];
		render(<SortBtn sortBy="boost_asc" values={boostValues} />);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(UpdateSortEvent.dispatch).toHaveBeenCalledWith('boost_desc');
	});

	it('maintains callback stability across re-renders', () => {
		const { rerender } = render(
			<SortBtn sortBy="cost_asc" values={mockValues} />,
		);
		const button = screen.getByRole('button');

		fireEvent.click(button);
		expect(UpdateSortEvent.dispatch).toHaveBeenCalledTimes(1);

		// Re-render with same props
		rerender(<SortBtn sortBy="cost_asc" values={mockValues} />);
		fireEvent.click(button);
		expect(UpdateSortEvent.dispatch).toHaveBeenCalledTimes(2);
	});

	it('works with all different sort types', () => {
		const testCases: Array<{
			values: [PartSortBy, PartSortBy];
			current: PartSortBy;
			expected: PartSortBy;
		}> = [
			{
				values: ['name_asc', 'name_desc'],
				current: 'name_asc',
				expected: 'name_desc',
			},
			{
				values: ['quantity_asc', 'quantity_desc'],
				current: 'quantity_desc',
				expected: 'quantity_asc',
			},
			{
				values: ['costToBoost_asc', 'costToBoost_desc'],
				current: 'costToBoost_asc',
				expected: 'costToBoost_desc',
			},
		];

		testCases.forEach(({ values, current, expected }) => {
			const { unmount } = render(
				<SortBtn sortBy={current} values={values} />,
			);
			const button = screen.getByRole('button');

			fireEvent.click(button);

			expect(UpdateSortEvent.dispatch).toHaveBeenCalledWith(expected);

			// Clean up after each test to avoid multiple elements
			unmount();
		});
	});
});
