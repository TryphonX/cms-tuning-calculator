'use client';

import { PartSortBy } from '@/@types/globals';
import { UpdateSortEvent } from '@/modules/customEvents';
import { useCallback } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6';

type SortBtnProps = {
	sortBy: PartSortBy;
	values: [PartSortBy, PartSortBy];
};

export default function SortBtn({ sortBy, values }: SortBtnProps) {
	const handleClick = useCallback(() => {
		UpdateSortEvent.dispatch(
			sortBy === (values[0] as PartSortBy)
				? (values[1] as PartSortBy)
				: (values[0] as PartSortBy),
		);
	}, [sortBy, values]);

	return (
		<button
			className={`btn btn-xs btn-square btn-ghost ${
				values.some((val) => val === sortBy) ? 'btn-active' : ''
			}`}
			onClick={handleClick}
		>
			{sortBy === values[0] ? (
				<FaCaretUp aria-label="Sort ascending" />
			) : (
				<FaCaretDown aria-label="Sort descending" />
			)}
		</button>
	);
}
