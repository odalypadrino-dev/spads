import cn from "@lib/cn";

const Message = ({ className, children }) => {
	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center w-full h-full gap-4',
				className
			)}
		>
			{ children }
		</div>
	);
};

const Icon = ({ className, children }) => {
	return (
		<div
			className={cn(
				'rounded-full text-mercury-950 [&>svg]:w-12',
				className
			)}
		>
			{ children }
		</div>
	);
};

const Title = ({ className, children }) => {
	return (
		<h2
			className={cn(
				'font-bold text-mercury-950',
				className
			)}
		>
			{ children }
		</h2>
	);
};

const Description = ({ className, children }) => {
	return (
		<p
			className={cn(
				'text-sm font-medium text-mercury-800',
				className
			)}
		>
			{ children }
		</p>
	);
};

Message.Icon = Icon;
Message.Title = Title;
Message.Description = Description;

export default Message;