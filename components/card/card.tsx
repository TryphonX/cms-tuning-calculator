import { Action, BasePropsWithChildren } from '@/@types/globals';
import { useCallback } from 'react';

type CardProps = BasePropsWithChildren &
	HeaderProps &
	FooterActionsProps & {
		title?: string;
	};

const getActionClassName = (action: Action) =>
	'btn join-item btn-sm ' + `${action.className ?? 'btn-neutral'}`;

type HeaderProps = ActionsProps & {
	title?: string;
};

type ActionsProps = {
	actions?: Action[];
};

type FooterActionsProps = {
	footerActions?: Action[];
};

function Actions({ actions }: { actions?: Action[] }) {
	if (!actions || !actions.length) return null;

	return (
		<div className="join">
			{actions.map((action) => (
				<button
					key={`${action.label}-action`}
					className={getActionClassName(action)}
					disabled={action.disabled}
					onClick={action.onClick}
				>
					{action.label}{' '}
					<span className="max-sm:hidden">
						{action.optionalLabel}
					</span>
				</button>
			))}
		</div>
	);
}

function Header({ title, actions }: HeaderProps) {
	if (!title) return;

	return (
		<>
			<div className="flex flex-row justify-between">
				<span className="card-title">{title}</span>
				<Actions actions={actions} />
			</div>
			<div className="divider my-0"></div>
		</>
	);
}

const getFActionClassName = (action: Action) => `btn ${action.className ?? ''}`;

function FooterActions({ footerActions }: FooterActionsProps) {
	if (!footerActions || !footerActions.length) return null;

	return (
		<div className="card-actions justify-end">
			{footerActions.map((action) => (
				<button
					key={`${action.label}-footeraction`}
					className={getFActionClassName(action)}
					disabled={action.disabled}
					onClick={action.onClick}
				>
					{action.label}{' '}
					<span className="max-sm:hidden">
						{action.optionalLabel}
					</span>
				</button>
			))}
		</div>
	);
}

export default function Card({
	className,
	title,
	actions,
	children,
	footerActions,
}: CardProps) {
	const getClassName = useCallback(
		() => (className ? ` ${className}` : ''),
		[className],
	);

	return (
		<div
			className={`card card-border rounded-2xl border-base-content/10 shadow-xl shadow-base-200 ${getClassName()}`}
		>
			<div className="card-body">
				<Header title={title} actions={actions} />
				{children}
				<FooterActions footerActions={footerActions} />
			</div>
		</div>
	);
}
