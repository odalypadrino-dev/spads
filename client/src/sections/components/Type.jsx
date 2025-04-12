import cn from "@lib/cn";

import LOGS from "@consts/logs";

const Type = ({ type, className }) => {
	const { classNames, label } = LOGS[ type ];

	return (
		<div
			className={cn(
				'flex items-center justify-center px-4 py-1 w-fit border rounded-full font-medium',
				classNames,
				className
			)}
		>
			{ label }
		</div>
	);
};

export default Type;