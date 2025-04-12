import { DateTime } from "luxon";

const getStatus = data => {
	const { level, date, ended, endDate, time } = data;
	const currentTime = DateTime.now();
	
	if (level === 1) {
		const { value: endDuration, unit } = time;

		const availDate = DateTime.fromISO(date).plus({ [ unit ]: endDuration });
		
		if (availDate > currentTime) return {
			status: 'WAITING',
			until: availDate.setLocale('es-VE').toLocaleString(DateTime.DATE_FULL)
		};
		
		return {
			status: 'DONE'
		};
	};

	if (level === 2) {
		if (!ended) return {
			status: 'ACTIVE'
		};

		if (time) {
			const { value: endDuration, unit } = time;

			const availDate = DateTime.fromISO(endDate).plus({ [ unit ]: endDuration });
			
			if (availDate > currentTime) return {
				status: 'WAITING',
				until: availDate.setLocale('es-VE').toLocaleString(DateTime.DATE_FULL)
			};
		};

		return {
			status: 'ENDED'
		};
	};

	if (level === 3) {
		if (!ended) return {
			status: 'ACTIVE'
		};

		const { value: endDuration, unit } = time;

		const availDate = DateTime.fromISO(endDate).plus({ [ unit ]: endDuration });
		
		if (availDate > currentTime) return {
			status: 'WAITING',
			until: availDate.setLocale('es-VE').toLocaleString(DateTime.DATE_FULL)
		};

		return {
			status: 'ENDED'
		};
	};

	if (level === 4) return {
		status: 'PERMANENT'
	};
};

export default getStatus;