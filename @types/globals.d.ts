import { PartSortBy } from '@/modules/common';
import { ReactNode } from 'react';

export type BaseProps = {
	className?: string;
};

export type BasePropsWithChildren = BaseProps & {
	children?: ReactNode;
};

export type SortBy = PartSortBy;

export type Action = {
	className?: string;
	variant?: string;
	disabled?: boolean;
	label: ReactNode | ReactNode[];
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
