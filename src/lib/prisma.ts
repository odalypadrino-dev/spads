import { Prisma, PrismaClient } from 'prisma';

import getAge from '@lib/getAge';
import parseDonor from '@lib/parseDonor';

import type { DonorWithoutRelationsUsers, Search } from 'types/donor'

type SearchMethod = Search<typeof prisma.donor>;

const prisma = new PrismaClient().$extends({
	model: {
		donor: {
			async search(
				...[{ query, page, limit }]: Parameters<SearchMethod>
			): ReturnType<SearchMethod> {
				const rawDonors = await prisma.$queryRaw<
					Array<
						DonorWithoutRelationsUsers<typeof prisma.donor> & {
							registeredByName: string,
							lastUpdatedByName: string,
							ciLetter: string,
							ciNumber: string
						}
					>
				>`
					SELECT 
						donor.id,
						donor.record,
						donor.names,
						donor.surnames,
						donor.ciString,
						donor.birthdate,
						donor.genre,
						donor.weight,
						donor.bloodType,
						donor.createdAt,
						ci.letter AS "ciLetter",
						ci.number AS "ciNumber",
						CONCAT(ru.firstName, ' ', ru.lastName) AS registeredByName, 
						CONCAT(lu.firstName, ' ', lu.lastName) AS lastUpdatedByName
					FROM donor
					LEFT JOIN ci ON donor.id = ci.donorId
					LEFT JOIN user ru ON donor.registeredById = ru.id
					LEFT JOIN user lu ON donor.lastUpdatedById = lu.id
					${
						query ?
							Prisma.sql`WHERE MATCH (donor.record, donor.ciString)
	AGAINST (${ query } IN BOOLEAN MODE)`
						:
							Prisma.empty
					}
					ORDER BY donor.createdAt DESC
					LIMIT ${ limit } OFFSET ${ page * limit }
				`;

				const [{ count }] = await prisma.$queryRaw<Array<{ count: number }>>`
					SELECT COUNT(*) as count
					FROM donor
					${
						query ?
							Prisma.sql`WHERE MATCH (donor.record, donor.ciString)
	AGAINST (${ query } IN BOOLEAN MODE)`
						:
							Prisma.empty
					}
				`;

				return {
					data: rawDonors.map(parseDonor),
					quantity: Number(count)
				};
			}
		}
	},
	result: {
		user: {
			name: {
				needs: { firstName: true, lastName: true },
				compute: ({ firstName, lastName }) => `${ firstName } ${ lastName }`
			}
		},
		donor: {
			name: {
				needs: { names: true, surnames: true },
				compute: ({ names, surnames }) => {
					const lastNames = surnames.split(' ');
					const lastNameIndex = lastNames.findIndex(l => l.length >= 4);
					
					return `${ names.split(' ')[0] } ${ lastNames.slice(0, lastNameIndex + 1).join(' ') }`;
				}
			},
			fullname: {
				needs: { names: true, surnames: true },
				compute: ({ names, surnames }) => `${ names } ${ surnames }`
			},
			age: {
				needs: { birthdate: true },
				compute: ({ birthdate }) => getAge(birthdate)
			}
		}
	}
});

export default prisma;