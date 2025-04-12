import cn from '@lib/cn';

const Form = ({ className, onSubmit, children, ...props }) => {
	return (
		<form
			{ ...props }
			onSubmit={ onSubmit }
			className={cn(
				'group flex flex-col items-center justify-start w-full h-full gap-20',
				className
			)}
		>
			{ children }
		</form>
	);
};

const Footer = ({ className, children, ...props }) => {
	return (
		<div { ...props } className={cn('flex flex-col items-center justify-start relative pb-9 w-full', className)}>
			{ children }
		</div>
	);
};

const Buttons = ({ className, children, ...props }) => {
	return (
		<div
			{ ...props }
			className={cn(
				'flex items-center justify-between w-full gap-3',
				'[&_button]:flex [&_button]:items-center [&_button]:justify-center [&_button]:w-full [&_button]:h-14 [&_button]:rounded-xl [&_button]:cursor-not-allowed [&_button]:border-transparent [&_button]:text-mercury-50 [&_button]:bg-accent-600 [&_button]:opacity-50',
				'group-valid:[&_button:not(.loading)]:cursor-pointer group-valid:[&_button:not(.loading)]:opacity-100 group-data-[invalid=true]:[&_button:not(.loading)]:cursor-not-allowed group-data-[invalid=true]:[&_button:not(.loading)]:opacity-50',
				'[&_button[type="button"]]:font-semibold [&_button[type="button"]]:text-mercury-900 [&_button[type="button"]]:bg-transparent',
				'[&_button_span]:flex [&_button_span]:items-center [&_button_span]:relative',
				'[&_button_span_l-ring]:absolute [&_button_span_l-ring]:right-[120%]',
				className
			)}
		>
			{ children }
		</div>
	);
};

const Message = ({ className, children, ...props }) => {
	return (
		<span { ...props } className={cn('absolute bottom-0 text-sm [&_a]:text-accent-600 [&_a]:hover:underline', className)}>{ children }</span>
	);
};

Footer.Buttons = Buttons;
Footer.Message = Message;
Form.Footer = Footer;

export default Form;