import { DateTime } from "luxon";

import getAge from "@lib/getAge";
import prisma from "@lib/prisma";

import DONOR from '@constants/donor';

import type {
	DonorEligibility,
	HealthConditionParsed,
	BloodResultParsed,
	DonationStatus
} from 'types/donor';

const checkEligibility = (donor: DonorEligibility<typeof prisma.donor>) => {
	const currentTime = DateTime.now();

	const {
		birthdate,
		weight,
		healthConditions,
		bloodTests,
		donations
	} = donor;

	const age = getAge(birthdate);

	const canDonate: DonationStatus = {
		status: true,
		dueTo: []
	};

	const [ MIN_AGE, MAX_AGE ] = DONOR.AGE.RANGE;
	
	if (!donor.bloodType) {
		canDonate.status = false;
		canDonate.dueTo.push({
			type: 1
		});
	};

	if (bloodTests.length) {
		const [ bloodTest ] = bloodTests;
		const { bloodResults } = bloodTest;

		const bloodResultsCustom: Array<BloodResultParsed> = [];

		for (let i = 0; i < bloodResults.length; i++) {
			const bloodResult = bloodResults[i];
			const detailedResult = DONOR.BLOOD_TEST_RESULTS.entities[ bloodResult.type ];

			bloodResultsCustom.push({
				id: bloodResult.id,
				type: bloodResult.type,
				label: detailedResult.label
			});
		};

		if (bloodResults.some(({ type }) => type !== 1)) {
			canDonate.status = false;
			canDonate.dueTo.push({
				type: 2,
				data: {
					id: bloodTest.id,
					bloodResults: bloodResultsCustom,
					createdBy: bloodTest.createdBy,
					createdAt: bloodTest.createdAt
				}
			});
		};
	};

	if (age < MIN_AGE || age > MAX_AGE) {
		canDonate.status = false;
		canDonate.dueTo.push({
			type: 3,
			data: {
				age,
				ageRange: DONOR.AGE.RANGE
			}
		});
	};

	if (weight < DONOR.WEIGHT.MIN) {
		canDonate.status = false;
		canDonate.dueTo.push({
			type: 4,
			data: {
				weight,
				minWeight: DONOR.WEIGHT.MIN
			}
		});
	};

	if (healthConditions.length) {
		const data: Array<HealthConditionParsed> = [];

		for (let i = 0; i < healthConditions.length; i++) {
			const healthCondition = healthConditions[i];
			const { type, date, ended, endDate, endDateTime } = healthCondition;

			const detailedType = DONOR.HEALTH_CONDITIONS.entities[ type ];
			const { label, level: hcLevel, time } = detailedType;

			const healthConditionCustom: HealthConditionParsed = {
				id: healthCondition.id,
				type,
				label,
				level: hcLevel,
				date,
				ended,
				endDate,
				endDateTime,
				time,
				createdBy: healthCondition.createdBy,
				endedBy: healthCondition.endedBy,
				createdAt: healthCondition.createdAt
			};

			if (hcLevel === 1 && date && time) {
				const { value: endDuration, unit } = time;

				const availDate = DateTime.fromISO(date).plus({ [ unit ]: endDuration });
				
				if (availDate > currentTime) data.push(healthConditionCustom);
			};

			if (hcLevel === 2) {
				if (!ended) {
					data.push(healthConditionCustom)
					continue;
				};

				if (time && endDate) {
					const { value: endDuration, unit } = time;

					const availDate = DateTime.fromISO(endDate).plus({ [ unit ]: endDuration });
					
					if (availDate > currentTime) data.push(healthConditionCustom);
				};
			};

			if (hcLevel === 3 && date && time) {
				if (!endDate || !healthCondition.dueTo) {
					data.push(healthConditionCustom)
					continue;
				};

				const { value: endDuration, unit } = time;

				const availDate = DateTime.fromISO(endDate).plus({ [ unit ]: endDuration });

				healthConditionCustom.dueTo = detailedType.dueToOpts[ healthCondition.dueTo ];

				if (availDate > currentTime) data.push(healthConditionCustom);
			};

			if (hcLevel === 4) data.push(healthConditionCustom);
		};

		if (data.length) {
			canDonate.status = false;
			canDonate.dueTo.push({
				type: 5,
				data
			});
		};
	};

	if (donations.length) {
		const [ donation ] = donations;
		const { completed, completedDate } = donation;

		if (!completed) {
			canDonate.status = false;
			canDonate.dueTo.push({
				type: 6,
				data: donation
			});
		};

		if (completed && completedDate) {
			const { value, unit } = DONOR.DONATIONS.time;
			const endedDate = DateTime.fromJSDate(completedDate)
				.plus({ [ unit ]: value })
				.startOf('day');

			if (endedDate > currentTime) {
				canDonate.status = false;
				canDonate.dueTo.push({
					type: 7,
					data: donation
				});
			};
		};
	};

	return canDonate;
};

export default checkEligibility;