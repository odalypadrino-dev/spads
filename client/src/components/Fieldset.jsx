import { useState, useEffect, useRef } from "react";

import cn from "@lib/cn";

import SortDown from "@icons/SortDown";

const Fieldset = ({ title, classNames, children }) => {
	return (
		<div
			className={cn(
				'flex flex-col items-center justify-between w-full',
				classNames?.base
			)}
			role='group'
			aria-labelledby={ title }
		>
			{
				title ?
					<h2
						id={ title }
						className={cn(
							'text-6xl font-semibold leading-[3.6rem]',
							classNames?.label
						)}
					>
						{ title }
					</h2>
				:
					null
			}

			<div
				className={cn(
					'flex flex-col items-center justify-start mt-20 w-full h-full gap-3',
					classNames?.content
				)}
			>
				{ children }
			</div>
		</div>
	);
};

const Field = ({ className, children }) => {
	return (
		<div
			className={cn(
				'flex flex-col items-start relative w-full gap-[10px]',
				className
			)}
		>
			{ children }
		</div>
	);
};

const Description = ({ children }) => {
	return (
		<p className='text-[13px] text-[--messages-title-color]'>
			{ children }
		</p>
	);
};

const Container = ({ label, htmlFor, onEvents, hasDecorator, classNames, children }) => {
	return (
		<div
			className={cn(
				'flex items-center relative w-full h-full',
				'[&>input]:px-14',
				{ '[&>input]:px-6': !hasDecorator },
				'has-[:disabled]:opacity-50',
				'[&>svg]:absolute [&>svg]:left-[calc(1.25rem-2px)] [&>svg]:text-mercury-900 [&>svg]:pointer-events-none',
				'[&>.endContent]:flex [&>.endContent]:items-center [&>.endContent]:justify-center [&>.endContent]:absolute [&>.endContent]:right-0 [&>.endContent]:h-full [&>.endContent]:aspect-square [&>.endContent]:font-semibold [&>.endContent]:text-mercury-900 [&>.endContent]:opacity-0 [&>.endContent]:pointer-events-none [&>.endContent]:transition-opacity [&>.endContent]:[transition-timing-function:cubic-bezier(.4,0,.2,1)] [&>.endContent]:duration-100',
				classNames?.base
			)} 
			{ ...onEvents }
		>
			{ children }
			{
				label ?
					<>
						<span
							className={cn(
								'absolute top-[.6rem] left-14 text-mercury-900 pointer-events-none opacity-0 scale-75 transition-transform-opacity [transition-timing-function:cubic-bezier(.4,0,.2,1)]',
								'text-xs font-medium uppercase',
								{ 'left-[25px]': !hasDecorator },
								'[input:focus~&]:opacity-100 [input:focus~&]:scale-100 [.filled~&]:opacity-100 [.filled~&]:scale-100 [input:placeholder-shown&]:opacity-100 [input:placeholder-shown~&]:scale-100',
								'peer-required:after:content-["_*"] peer-required:after:text-red-500',
								classNames?.label
							)}
						>
							{ label }
						</span>
						<label
							className={cn(
								'absolute top-1/2 left-16 text-mercury-900 -translate-y-1/2 pointer-events-none transition-transform-opacity [transition-timing-function:cubic-bezier(.4,0,.2,1)]',
								'text-xs font-medium uppercase',
								{ '!left-[35px]': !hasDecorator },
								'[input:focus~&]:opacity-0 [input:focus~&]:scale-75 [.filled~&]:opacity-0 [.filled~&]:scale-75 [input:placeholder-shown~&]:opacity-0 [input:placeholder-shown~&]:scale-75',
								'peer-required:after:content-["_*"] peer-required:after:text-red-500',
								classNames?.placeholder
							)}
							htmlFor={ htmlFor }
						>
							{ label }
						</label>
					</>
				:
					null
			}
		</div>
	);
};

const Label = ({ htmlFor, required, className, children, ...props }) => {
	return (
		<label
			htmlFor={ htmlFor }
			className={cn(
				className,
				{ 'after:content-["_*"] after:text-red-500': required }
			)}
			{ ...props }
		>
			{ children }
		</label>
	);
};

const Input = ({ type = 'text', className, ...props }) => {
	return (
		<input
			type={ type }
			{ ...props }
			className={cn(
				'peer flex items-center justify-start pt-6 pb-2 w-full border border-transparent outline-none rounded-xl text-base font-bold text-primary bg-mercury-100 transition-colors-opacity [transition-timing-function:cubic-bezier(.4,0,.2,1)] overflow-hidden',
				'disabled:cursor-not-allowed',
				'[&:focus~.endContent]:opacity-100 [&:focus~.endContent[role="button"]]:pointer-events-auto [&:focus~.endContent[role="button"]]:cursor-pointer [&.filled~.endContent]:opacity-100 [&.filled~.endContent[role="button"]]:pointer-events-auto [&.filled~.endContent[role="button"]]:cursor-pointer',
				className
			)}
		/>
	);
};

const Checkbox = ({ label, htmlFor, ...props }) => {
	return (
		<>
			<input
				type='checkbox'
				{ ...props }
				className={cn(
					'accent-accent-500',
					'disabled:cursor-not-allowed'
				)}
			/>
			<label htmlFor={ htmlFor }>{ label }</label>
		</>
	);
};

const Dropdown = ({
	label,
	name,
	selected,
	items,
	onChange,
	title = '',
	decorator,
	classNames,
	...props
}) => {
	const [ expandedDropdown, setExpandedDropdown ] = useState(false);
	const dropdownRef = useRef();

	const itemHandler = item => {
		setExpandedDropdown(!expandedDropdown);
		onChange({
			name,
			value: item
		});
	};

	const clickHandler = e => {
		if (e.currentTarget.ariaDisabled !== 'true') setExpandedDropdown(!expandedDropdown);
	};

	useEffect(() => {
		const handleClick = e => {
			if (!expandedDropdown && dropdownRef.current && dropdownRef.current.contains(e.target)) return;
			setExpandedDropdown(false);
		};
		window.addEventListener("click", handleClick);
		
		return () => window.removeEventListener("click", handleClick);
	}, []);

	return (
		<div 
			className={cn(
				'group/dropdown flex flex-col items-center justify-center relative px-14 w-full border border-transparent outline-none rounded-xl text-base font-bold text-primary bg-mercury-100 transition-colors-opacity [transition-timing-function:cubic-bezier(.4,0,.2,1)] cursor-pointer',
				{ 'px-6': !decorator },
				'aria-[disabled="false"]:hover:bg-mercury-200',
				'aria-disabled:opacity-50 aria-disabled:cursor-not-allowed',
				'[&>svg]:absolute [&>svg]:left-[calc(1.25rem-2px)] [&>svg]:text-mercury-900 [&>svg]:pointer-events-none',
				classNames?.base
			)}
			onClick={ clickHandler }
			ref={ dropdownRef }
			{ ...props }
		>

			<div
				className={cn(
					'flex flex-col items-start justify-between pt-6 pb-2 w-full h-full'
				)}
				title={ title }
			>

				<label
					className={cn(
						'absolute top-[.6rem] left-14 text-mercury-900 pointer-events-none transition-transform-opacity [transition-timing-function:cubic-bezier(.4,0,.2,1)]',
						'text-xs font-medium uppercase',
						{ 'left-[25px]': !decorator },
						'group-aria-required/dropdown:after:content-["_*"] group-aria-required/dropdown:after:text-red-500',
						{ 'opacity-0 scale-75': !selected },
						classNames?.label
					)}
				>
					{ label }

				</label>

				<span
					className={cn(
						'absolute top-1/2 left-16 text-mercury-900 -translate-y-1/2 pointer-events-none transition-transform-opacity [transition-timing-function:cubic-bezier(.4,0,.2,1)]',
						'text-xs font-medium uppercase',
						{ 'left-[35px]': !decorator },
						'group-aria-required/dropdown:after:content-["_*"] group-aria-required/dropdown:after:text-red-500',
						{ 'opacity-0 scale-75': selected },
						classNames?.placeholder
					)}
				>
					{ label }
				</span>

				<span
					className={cn(
						'opacity-0 transition-opacity',
						{ 'opacity-100': selected },
						classNames?.selected
					)}
				>
					{ selected || label }
				</span>

			</div>
			
			<div
				className={cn(
					'absolute right-6',
					'[&>svg]:w-[10px] [&>svg]:text-mercury-900 [&>svg]:-rotate-180 [&>svg]:transition-transform [&>svg]:duration-100',
					{ '[&>svg]:rotate-0': expandedDropdown }
				)}
			>
				<SortDown />
			</div>

			{ decorator }

			<ul
				className={cn(
					'flex flex-col absolute top-[98%] left-0 w-full max-h-52 rounded-xl bg-white scale-95 -translate-y-2 opacity-0 -z-10 shadow-lg [transition:transform_.1s,opacity_.1s,z-index_0s_.1s] pointer-events-none overflow-y-auto',
					{ 'scale-100 translate-y-0 opacity-100 z-10 [transition:transform_.1s,opacity_.1s,z-index_0s_.0s] pointer-events-auto': expandedDropdown },
					classNames?.list
				)}
			>
				{
					items.map(({ value, label }, ind) =>
						<li
							className={cn(
								'px-6 py-2 transition-colors duration-100',
								selected === label ? 'bg-accent-400 text-mercury-50' : 'hover:bg-accent-100',
								classNames?.item
							)}
							key={ `value-${ ind }` }
							onClick={ () => itemHandler(value) }
						>
							{ label }
						</li>
					)
				}
			</ul>
		</div>
	);
};

Field.Label = Label;
Field.Description = Description;
Container.Input = Input;
Container.Checkbox = Checkbox;
Container.Dropdown = Dropdown;
Field.Container = Container;
Fieldset.Field = Field;

export default Fieldset;