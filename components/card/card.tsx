import { Action, BasePropsWithChildren } from '@/@types/globals';

type CardProps = BasePropsWithChildren &
	HeaderProps &
	FooterActionsProps & {
		title?: string;
	};

const getActionClassName = (action: Action) =>
	'btn join-item btn-sm ' +
	`btn-${action.variant ?? 'neutral'} ${action.className ?? ''}`;

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
	if (!actions || !actions.length) return;

	return (
		<div className='join'>
			{actions.map((action) => (
				<button
					key={`${action.label}-footeraction`}
					className={getActionClassName(action)}
					disabled={action.disabled}
					onClick={action.onClick}
				>
					{action.label}
				</button>
			))}
		</div>
	);
}

function Header({ title, actions }: HeaderProps) {
	if (!title) return;

	return (
		<>
			<div className='flex flex-row justify-between'>
				<span className='card-title'>{title}</span>
				<Actions actions={actions} />
			</div>
			<div className='divider my-0'></div>
		</>
	);
}

const getFActionClassName = (action: Action) =>
	`btn btn-${action.variant || 'primary'} ${action.className ?? ''}`;

function FooterActions({ footerActions }: FooterActionsProps) {
	if (!footerActions) return;

	return (
		<div className='card-actions justify-end'>
			{footerActions.map((action) => (
				<button
					key={`${action.label}-action`}
					className={getFActionClassName(action)}
					disabled={action.disabled}
					onClick={action.onClick}
				>
					{action.label}
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
	const getClassName = () => (className ? ` ${className}` : '');

	return (
		<div className={`card card-bordered shadow-xl${getClassName()}`}>
			<div className='card-body'>
				<Header title={title} actions={actions} />
				{children}
				<FooterActions footerActions={footerActions} />
			</div>
		</div>
	);
}
