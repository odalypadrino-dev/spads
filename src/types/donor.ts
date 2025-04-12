import { Prisma } from "prisma";

import type { APIHandler } from "types/express";
import type { DurationObjectUnits } from "luxon";

const bloodTestWithoutDonor = Prisma.validator<Prisma.BloodTestDefaultArgs>()({
	include: {
		bloodResults: {
			omit: { id: true, bloodTestId: true }
		} 
	},
	omit: { donorId: true, updatedAt: true }
});

const DonationWithoutDonor = Prisma.validator<Prisma.DonationDefaultArgs>()({
	omit: { donorId: true, updatedAt: true }
});

export type Donor<Model> = Prisma.Result<Model, { include: { ci: { omit: { id: true, donorId: true } } }, omit: { registeredById: true, lastUpdatedById: true, updatedAt: true, name: true, dir: true, phone: true } }, 'findFirstOrThrow'>;
export type DonorWithoutRelationsUsers<Model> = Omit<Donor<Model>, 'registeredBy' | 'lastUpdatedBy'>;
export type Search<Model> = ({ query, page, limit }: { query: string, page: number, limit: number }) => Promise<{
	data: Array<Omit<Donor<Model>, 'names' | 'surnames' | 'birthdate' | 'ciString'>>;
	quantity: number;
}>;

export type DonorEligibility<Model> = Prisma.Result<Model,
	{
		select: {
			birthdate: true,
			weight: true,
			bloodType: true,
			healthConditions: {
				include: {
					createdBy: { select: { name: true } },
					endedBy: { select: { name: true } }
				},
				omit: {
					donorId: true,
					createdById: true,
					endedById: true,
					updatedAt: true
				}
			},
			bloodTests: {
				include: {
					bloodResults: true,
					createdBy: { select: { name: true } }
				},
				omit: {
					donorId: true,
					createdById: true,
					updatedAt: true
				},
				take: 1,
				orderBy: { createdAt: 'desc' }
			},
			donations: {
				include: {
					createdBy: { select: { name: true } },
					completedBy: { select: { name: true } }
				},
				omit: {
					donorId: true,
					createdById: true,
					completedById: true,
					updatedAt: true
				},
				take: 1,
				orderBy: { createdAt: 'desc' }
			}
		}
	},
	'findUniqueOrThrow'
>;

export type DonorBody = {
	names?: string;
	surnames?: string;
	letter?: string;
	number?: string;
	birthdate?: string;
	genre?: 'Hombre' | 'Mujer';
	phone?: string;
	dir?: string;
	weight?: string;
};

export type BloodTestBody = {
	bloodType?: string;
	bloodResults?: Array<string>;
};

export type HealthConditionBody = {
	type?: string;
	date?: string;
	ended: boolean;
	endDate?: string;
	dueTo?: string;
};

export type HealthConditionParsed = {
	id: number;
	type: number;
	label: string;
	level: 1 | 2 | 3 | 4;
	date: string | null;
	ended: boolean;
	endDate: string | null;
	endDateTime: Date | null;
	time?: {
		value: number;
		unit: keyof DurationObjectUnits;
	};
	dueTo?: {
		id: number;
		value: string;
	} | null;
	dueToOpts?: Array<{
		id: number;
		value: string;
	}>;
	createdBy: {
		name: string;
	};
	endedBy: {
		name: string;
	} | null;
	createdAt: Date;
};

export type BloodResultParsed = {
	id: number;
	type: number;
	label: string;
};

export type BloodTestParsed = {
	id: number;
	bloodResults: Array<BloodResultParsed>;
	createdBy: {
		name: string;
	};
	createdAt: Date;
};

export type BloodTest = Prisma.BloodTestGetPayload<typeof bloodTestWithoutDonor>;

export type Donation = Omit<Prisma.DonationGetPayload<typeof DonationWithoutDonor>, 'createdById' | 'completedById'>;

export type DueTo = 
	{
		type: 1;
	} |
	{
		type: 2;
		data: BloodTestParsed;
	} |
	{
		type: 3;
		data: {
			age: number;
			ageRange: Array<number>;
		};
	} |
	{
		type: 4;
		data: {
			weight: number;
			minWeight: number;
		};
	} |
	{
		type: 5;
		data: Array<HealthConditionParsed>;
	} |
	{
		type: 6 | 7;
		data: Donation;
	}
;

export type HealthConditionEntities = {
	[ id: string ]: {
		type: number;
		label: string;
		level: 1 | 2 | 4;
		time?: {
			value: number;
			unit: keyof DurationObjectUnits;
		};
	} | {
		type: number;
		label: string;
		level: 3;
		dueToOpts: {
			[ id: string ]: {
				id: number;
				value: string;
			};
		};
		time?: {
			value: number;
			unit: keyof DurationObjectUnits;
		};
	};
};

export type BloodTestResultsEntities = {
	[ id: string ]: {
		type: number;
		label: string;
	};
};

export type DonationStatus = {
	status: boolean;
	dueTo: Array<DueTo>
};

export type DonationBody = {
	token?: string;
	patientFirstName?: string;
	patientLastName?: string
	patientLetter?: string;
	patientNumber?: string;
};

export type DonorController = {
	register: APIHandler;
	getById: APIHandler<{ donorId: string }>;
	getAll: APIHandler<{ donorId: string }>;
	edit: APIHandler<{ donorId: string }>;
};

export type HealthConditionController = {
	addHealthCondition: APIHandler<{ donorId: string }>;
	getHealthConditions: APIHandler<{ donorId: string }>;
	endHealthCondition: APIHandler<{ donorId: string, hcId: string }>;
};

export type BloodTestController = {
	addBloodTest: APIHandler<{ donorId: string }>;
	getBloodTest: APIHandler<{ donorId: string }>;
};

export type DonationController = {
	addDonation: APIHandler<{ donorId: string }>;
	getAll: APIHandler<{ donorId: string }>;
	completeDonation: APIHandler<{ donorId: string, dntId: string }>;
	checkCanDonate: APIHandler<{ donorId: string }, { key?: 'true' | 'false' }>;
};