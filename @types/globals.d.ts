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
	disabled?: boolean;
	label: ReactNode | ReactNode[];
	optionalLabel?: ReactNode | ReactNode[];
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
