import { PrismaClient } from 'prisma';

import getAge from '@lib/getAge';

import type { DonorWithoutRelationsUsers } from 'types/donor'

const prisma = new PrismaClient();

const parseDonor = (
	rawDonor: DonorWithoutRelationsUsers<typeof prisma.donor> & {
		registeredByName: string;
		lastUpdatedByName: string;
		ciLetter: string;
		ciNumber: string;
	}
) => {
	const { names, surnames, birthdate, registeredByName, lastUpdatedByName, ciLetter, ciNumber, ciString, ...rest } = rawDonor;

	rawDonor

	return {
		...rest,
		ci: {
			letter: ciLetter,
			number: ciNumber
		},
		fullname: `${ names } ${ surnames }`,
		age: getAge(birthdate)
	};
};

export default parseDonor;