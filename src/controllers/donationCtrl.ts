import jwt from 'jsonwebtoken';

import checkEligibility from '@lib/checkEligibility';
import prisma from "@lib/prisma";

import DONOR from '@constants/donor';
import LOGS from "@constants/logs";

import type { JwtPayload, Secret } from 'jsonwebtoken';
import type { DonationController, DonationBody } from 'types/donor';

const donationCtrl: DonationController = {
	addDonation: async (req, res) => {
		try {
			const user = await prisma.user.findUnique({
				where: { id: req.user.id }
			});

			if (user?.role !== 'USER') return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida'
			});

			const { donorId } = req.params;

			const donor = await prisma.donor.findUnique({
				where: { id: Number(donorId) },
				include: { 
					ci: true,
					donations: {
						take: 1,
						orderBy: { createdAt: 'desc' }
					}
				}
			});

			if (!donor || !donor.ci) return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida.'
			});

			const [ lastDonation ] = donor.donations;

			if (lastDonation?.completed && !lastDonation.completed) return res.json({
				status: 400,
				success: false,
				content: 'El donante no puede donar mientras tenga otra donación en curso.'
			});

			const { token, patientFirstName, patientLastName, patientLetter, patientNumber } = req.body as DonationBody;

			if (!token) return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida.'
			});

			const { canDonate } = jwt.verify(token, process.env.HASH_TOKEN_SECRET as Secret) as { canDonate: boolean };

			if (!canDonate) return res.json({
				status: 400,
				success: false,
				content: 'El donante no puede donar, actualice la historia clínica para ver el motivo.'
			});

			if (!patientFirstName) return res.json({
				status: 400,
				success: false,
				content: 'El nombre del paciente es requerido'
			});

			if (!patientLastName) return res.json({
				status: 400,
				success: false,
				content: 'El apellido del paciente es requerido'
			});

			if (!patientLetter || !patientNumber) return res.json({
				status: 400,
				success: false,
				content: 'La cédula del paciente es requerida.'
			});

			if (!DONOR.CI.TYPES.includes(patientLetter)) return res.json({
				status: 400,
				success: false,
				content: "El tipo de cédula es inválido."
			});

			if (patientNumber.length < DONOR.CI.MIN_LENGTH) return res.json({
				status: 400,
				success: false,
				content: `La cédula del paciente debe tener como mínimo ${ DONOR.CI.MIN_LENGTH } caracteres de longitud.`
			});

			if (patientNumber.length > DONOR.CI.MAX_LENGTH) return res.json({
				status: 400,
				success: false,
				content: `La cédula del paciente debe tener como máximo ${ DONOR.CI.MAX_LENGTH } caracteres de longitud.`
			});

			await prisma.donation.create({
				data: {
					donor: { connect: { id: donor.id } },
					patientFirstName,
					patientLastName,
					patientCiLetter: patientLetter,
					patientCi: patientNumber,
					createdBy: { connect: { id: user.id } }
				}
			});

			await prisma.log.create({
				data: {
					description: `Se ha registrado una donación proveniente del donante ${ donor.ci.letter } - ${ new Intl.NumberFormat('es-VE').format(Number(donor.ci.number)) }.`,
					type: LOGS.DONATION,
					by: { connect: { id: user.id } }
				}
			});

			return res.json({
				status: 200,
				success: true,
				content: 'Donación programada exitosamente.'
			});
		} catch (err) {
			const { message } = err as { message: string };

			return res.json({
				status: 500,
				success: false,
				content: message
			});
		}
	},
	getAll: async (req, res) => {
		try {
			const queries = req.query;
			const limit = parseInt(queries?.limit) || 6;
			const page = (parseInt(queries?.page) || 1) - 1;
			
			const { donorId } = req.params;

			const count = await prisma.donation.count({
				where: { donorId: Number(donorId) }
			});

			if (!count) return res.json({
				status: 400,
				success: false,
				content: {
					data: 'No hay donaciones registradas para este donante.',
					quantity: count
				}
			});

			const donations = await prisma.donation.findMany({
				skip: page * limit,
				take: limit,
				where: { donorId: Number(donorId) },
				orderBy: {
					createdAt: 'desc'
				},
				include: {
					completedBy: {
						select: { name: true }
					},
					createdBy: {
						select: { name: true }
					}
				},
				omit: {
					donorId: true,
					createdById: true,
					completedById: true
				}
			});
			
			return res.json({
				status: 200,
				success: true,
				content: {
					data: donations,
					quantity: count
				}
			});
		} catch (err) {
			const { message } = err as { message: string };

			return res.json({
				status: 500,
				success: false,
				content: message
			});
		};
	},
	completeDonation: async (req, res) => {
		try {
			const user = await prisma.user.findUnique({
				where: { id: req.user.id }
			});

			if (user?.role !== 'USER') return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida'
			});

			const { donorId, dntId } = req.params;

			const donor = await prisma.donor.findUnique({
				where: { id: Number(donorId) },
				include: {
					ci: true,
					donations: { where: { id: Number(dntId) } }
				}
			});

			if (!donor || !donor.ci) return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida.'
			});

			const [ donation ] = donor.donations;

			if (!donation || donation.completed) return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida'
			});

			const newDonation = await prisma.donation.update({
				where: { id: Number(dntId) },
				data: {
					completed: true,
					completedDate: new Date(),
					completedBy: { connect: { id: user.id } }
				},
				include: {
					createdBy: { 
						select: { name: true }
					},
					completedBy: { 
						select: { name: true }
					}
				},
				omit: {
					donorId: true,
					createdById: true,
					completedById: true,
					updatedAt: true
				}
			});	

			await prisma.log.create({
				data: {
					description: `Se ha completado una donación proveniente del donante ${ donor.ci.letter } - ${ new Intl.NumberFormat('es-VE').format(Number(donor.ci.number)) }.`,
					type: LOGS.DONATION,
					by: { connect: { id: user.id } }
				}
			});

			return res.json({
				status: 200,
				success: true,
				content: {
					message: 'Donación completada exitosamente.',
					data: newDonation
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
	},
	checkCanDonate: async (req, res) => {
		try {
			const { donorId } = req.params;
			const { key } = req.query;

			const donor = await prisma.donor.findUnique({
				where: { id: Number(donorId) },
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
			});

			if (!donor) return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida.'
			});

			const canDonate = checkEligibility(donor);

			if (key === 'true') {
				const payload = createToken({ canDonate: canDonate.status });

				return res.json({
					status: 200,
					success: true,
					content: payload
				});
			};

			return res.json({
				status: 200,
				success: true,
				content: canDonate
			});
		} catch (err) {
			const { message } = err as { message: string };

			return res.json({
				status: 500,
				success: false,
				content: message
			});
		};
	}
};

const createToken = (payload: JwtPayload) => {
	return jwt.sign(payload, process.env.HASH_TOKEN_SECRET as Secret, { expiresIn: '30s' });
};

export default donationCtrl;