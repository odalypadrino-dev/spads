import { DateTime } from "luxon";

import checkEligibility from "@lib/checkEligibility";
import getAge from "@lib/getAge";
import prisma from "@lib/prisma";

import DONOR from "@constants/donor";

import type { DateTimeUnit } from "luxon"
import type { AdminController } from "types/admin";

const adminCtrl: AdminController = {
	getStats: async (req, res) => {
		try {
			const queries = req.query;
			const timeRange: DateTimeUnit = queries?.timeRange as 'month' | 'week' | 'day' || 'day';

			const now = DateTime.local();
			const startTime = now.startOf(timeRange);
			const endTime = now.endOf(timeRange);

			const TIME_LABEL = {
				month: {
					unit: 'month',
					value: startTime.setLocale('es-VE').toLocaleString({ month: 'long' })
				},
				week: {
					unit: 'week',
					value: `${ startTime.setLocale('es-VE').toLocaleString({ day: '2-digit', month: '2-digit', year: 'numeric' }) } hasta el ${ endTime.setLocale('es-VE').toLocaleString({ day: '2-digit', month: '2-digit', year: 'numeric' }) }`
				},
				day: {
					unit: 'day',
					value: startTime.setLocale('es-VE').toLocaleString(DateTime.DATE_FULL)
				}
			} as Record<'month' | 'week' | 'day', Record<string, string>>;

			const [
				newDonors,
				newDonorsCount,
				newDonations,
				completedDonations,
				uncompletedDonations,
				rawAges,
				genres,
				avgWeight,
				bloodType
			] = await Promise.all([
				prisma.donor.findMany({
					where: {
						createdAt: {
							gte: startTime.toJSDate(),
							lte: endTime.toJSDate(),
						}
					},
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
				}),
				prisma.donor.count({
					where: {
						createdAt: {
							gte: startTime.toJSDate(),
							lte: endTime.toJSDate(),
						}
					}
				}),
				prisma.donation.count({
					where: {
						createdAt: {
							gte: startTime.toJSDate(),
							lte: endTime.toJSDate(),
						}
					}
				}),
				prisma.donation.aggregate({
					_count: {
						completed: true,
					},
					where: {
						completed: true,
						createdAt: {
							gte: startTime.toJSDate(),
							lte: endTime.toJSDate(),
						}
					}
				}),
				prisma.donation.aggregate({
					_count: {
						completed: true,
					},
					where: {
						completed: false,
						createdAt: {
							gte: startTime.toJSDate(),
							lte: endTime.toJSDate(),
						}
					}
				}),
				prisma.donor.findMany({
					select: {
						birthdate: true
					},
					where: {
						createdAt: {
							gte: startTime.toJSDate(),
							lte: endTime.toJSDate(),
						}
					}
				}),
				prisma.$queryRaw`
					SELECT genre, COUNT(donation.id) as donationCount
					FROM donor
					LEFT JOIN donation ON donation.donorId = donor.id
					WHERE donation.createdAt BETWEEN ${ startTime.toISO() } AND ${ endTime.toISO() }
					GROUP BY genre
				`,
				prisma.donor.aggregate({
					_avg: {
						weight: true
					},
					where: {
						createdAt: {
							gte: startTime.toJSDate(),
							lte: endTime.toJSDate(),
						}
					}
				}),
				prisma.$queryRaw`
					SELECT bloodType, COUNT(donation.id) as donationCount
					FROM donor
					LEFT JOIN donation ON donation.donorId = donor.id
					WHERE donor.bloodType IS NOT NULL
						AND donation.createdAt BETWEEN ${ startTime.toISO() } AND ${ endTime.toISO() }
					GROUP BY bloodType
				`
			]);

			const data = {
				donors: {
					total: newDonorsCount,
					eligibility: newDonors.map(checkEligibility).reduce((eligibility, donationStatus) => {
						const { eligible, ineligible } = eligibility;
						const { status } = donationStatus;

						return {
							...eligibility,
							...(status ? { eligible: eligible + 1 } : { ineligible: ineligible + 1 })
						};
					}, { eligible: 0, ineligible: 0 })
				},
				donations: {
					total: newDonations,
					completed: completedDonations._count.completed,
					pending: uncompletedDonations._count.completed
				},
				avgAge: rawAges.map(({ birthdate }) => getAge(birthdate))
					.reduce((total, age) => total + age, 0) / rawAges.length || 0,
				genres: DONOR.GENRE.map(gnr => {
					const donationCount = (genres as Array<{ genre: string, donationCount: number }>).find(({ genre }) => genre === gnr)?.donationCount || 0;
					
					return { genre: gnr, donationCount: Number(donationCount) };
				}),
				avgWeight: avgWeight._avg.weight,
				bloodType: DONOR.BLOOD_TYPES.map(bt => {
					const donationCount = (bloodType as Array<{ bloodType: string, donationCount: number }>).find(({ bloodType }) => bloodType === bt)?.donationCount || 0;
					
					return { bloodType: bt, donationCount: Number(donationCount) };
				})
			};

			return res.json({
				status: 200,
				success: true,
				content: {
					time: TIME_LABEL[ timeRange ],
					data
				}
			});
		} catch (err) {
			const { message } = err as { message: string };

			return res.json({
				status: 500,
				success: false,
				content: message
			});
		}
	}
};

export default adminCtrl;