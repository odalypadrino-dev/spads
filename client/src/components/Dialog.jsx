import cn from '@lib/cn';

import Loading from '@components/Loading';

const Dialog = ({ className, children }) => {
	return (
		<section
			className={cn(
				'flex flex-col justify-between min-w-96 max-h-[95vh] rounded-lg bg-mercury-50 overflow-hidden shadow-lg',
				className
			)}
		>
			{ children }
		</section>
	);
};

const Header = ({ className, children }) => {
	return (
		<header className={cn('p-4 w-full rounded-t-[inherit] bg-mercury-200/50', className)}>
			{ children }
		</header>
	);
};

const Title = ({ className, children }) => {
	return (
		<h3 className={cn('font-bold text-lg text-primary', className)}>
			{ children }
		</h3>
	);
};

const Description = ({ className, children }) => {
	return (
		<p className={cn('text-sm text-bunker-600', className)}>
			{ children }
		</p>
	);
};

const Buttons = ({ className, children }) => {
	return (
		<div className={cn('flex justify-end p-4 w-full border-t border-mercury-100 gap-3', className)}>
			{ children }
		</div>
	);
};

const Cancel = ({
	type = 'button',
	className,
	danger,
	isDisabled,
	children,
	...props
}) => {
	return (
		<button
			type={ type }
			className={cn(
				'flex items-center justify-center px-4 py-2 rounded bg-transparent gap-2',
				danger ? 'text-red-500' : 'text-bunker-500',
				{ 'cursor-not-allowed opacity-50': isDisabled },
				className
			)}
			disabled={ isDisabled }
			{ ...props }
		>
			{ children }
		</button>
	);
};

const Accept = ({
	type = 'button',
	classNames,
	danger,
	icon = null,
	isLoading,
	children,
	...props
}) => {
	
	return (
		<button 
			type={ type }
			className={cn(
				`flex items-center justify-center px-4 py-2 rounded gap-2 transition-[filter,color,border-color,background-color] duration-100 group-invalid:cursor-not-allowed group-invalid:opacity-50 group-data-[invalid=true]:cursor-not-allowed group-data-[invalid=true]:opacity-50`,
				danger ? 'bg-red-500' : '!bg-accent-500',
				{ 'group-data-[invalid=false]:group-valid:hover:brightness-110': !isLoading },
				isLoading && [ 'cursor-not-allowed opacity-80', danger ? 'hover:bg-red-500' : 'hover:!bg-accent-500' ],
				classNames?.base
			)}
			disabled={ isLoading }
			{ ...props }
		>

			{
				isLoading ?
					<Loading
						size={ classNames.loading?.size || '16' }
						stroke={ classNames.loading?.stroke || '1.5' }
						color={ classNames.loading?.color || 'black' }
					/>
				:
					icon
			}

			<span>{ children }</span>

		</button>
	);
};

Header.Title = Title;
Header.Description = Description;
Dialog.Header = Header;
Buttons.Cancel = Cancel;
Buttons.Accept = Accept;
Dialog.Buttons = Buttons;

export default Dialog;