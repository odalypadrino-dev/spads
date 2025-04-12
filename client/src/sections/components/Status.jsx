import { DateTime } from "luxon";

import cn from "@lib/cn";

const Status = ({ className, data }) => {
	const { level, date, ended, endDate, time } = data;
	const currentTime = DateTime.now();
	
	const STATUSES = {
		PERMANENT: {
			classNames: 'border-red-300 text-red-700 bg-red-100',
			label: 'Permanente'
		},
		ACTIVE: {
			classNames: 'border-orange-300 text-orange-700 bg-orange-100',
			label: 'Activo'
		},
		WAITING: {
			classNames: 'border-amber-300 text-amber-700 bg-amber-100',
			label: 'En espera'
		},
		ENDED: {
			classNames: 'border-green-300 text-green-700 bg-green-100',
			label: 'Finalizado'
		},
		DONE: {
			classNames: 'border-green-300 text-green-700 bg-green-100',
			label: 'Realizado'
		}
	};

	const status = () => {
		if (level === 1) {
			const { value: endDuration, unit } = time;

			const availDate = DateTime.fromISO(date).plus({ [ unit ]: endDuration });
			
			if (availDate > currentTime) return STATUSES.WAITING;
			return STATUSES.DONE;
		};

		if (level === 2) {
			if (!ended) return STATUSES.ACTIVE;

			if (time) {
				const { value: endDuration, unit } = time;

				const availDate = DateTime.fromISO(endDate).plus({ [ unit ]: endDuration });
				
				if (availDate > currentTime) return STATUSES.WAITING;
			};

			return STATUSES.ENDED;
		};

		if (level === 3) {
			if (!ended) return STATUSES.ACTIVE;

			const { value: endDuration, unit } = time;

			const availDate = DateTime.fromISO(endDate).plus({ [ unit ]: endDuration });
			
			if (availDate > currentTime) return STATUSES.WAITING;

			return STATUSES.ENDED;
		}

		if (level === 4) return STATUSES.PERMANENT;
	};

	const { classNames, label } = status();

	return (
		<div
			className={cn(
				'flex items-center justify-center px-2 py-1 border rounded-full font-medium',
				classNames,
				className
			)}
		>
			{ label }
		</div>
	);
};

export default Status;