import { Prisma } from "prisma";

import prisma from "@lib/prisma";

import DONOR from '@constants/donor';
import LOGS from "@constants/logs";

import type {
    HealthConditionController,
	HealthConditionBody,
	HealthConditionParsed
} from 'types/donor';

const healthCondCtrl: HealthConditionController = {
	addHealthCondition: async (req, res) => {
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
					healthConditions: {
						omit: {
							id: true,
							donorId: true,
							createdById: true,
							dueTo: true,
							endedById: true,
							createdAt: true,
							updatedAt: true
						}
					}
				}
			});

			if (!donor || !donor.ci) return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida.'
			});

			const healthConditions = donor.healthConditions;

			const { type, date, ended, endDate, dueTo } = req.body as HealthConditionBody;
			
			if (!type) return res.json({
				status: 400,
				success: false,
				content: 'La condición de salud es obligatoria.'
			});

			const [ MIN, MAX ] = DONOR.HEALTH_CONDITIONS.RANGE;
			
			if (isNaN(Number(type)) || Number(type) < MIN || Number(type) > MAX) return res.json({
				status: 400,
				success: false,
				content: 'La condición de salud es inválida.'
			});
			
			if (dueTo && isNaN(Number(dueTo))) return res.json({
				status: 400,
				success: false,
				content: 'El motivo de finalización es inválido.'
			});

			const detailedType = DONOR.HEALTH_CONDITIONS.entities[ type ];
			const { level } = detailedType;

			for (let i = 0; i < healthConditions.length; i++) {
				const healthCondition = healthConditions[i];
				const details = DONOR.HEALTH_CONDITIONS.entities[ healthCondition.type ];
				const { level } = details;

				if (healthCondition.type === Number(type)) {
					if ([ 2, 3 ].includes(level) && !healthCondition.ended) return res.json({
						status: 400,
						success: false,
						content: 'No se puede añadir esta condición de salud mientras otra del mismo tipo no ha finalizado.'
					});

					if (level === 4) return res.json({
						status: 400,
						success: false,
						content: 'No se puede añadir otra condición de salud de este mismo tipo.'
					});
				};
			};

			const healthConditionData: Prisma.HealthConditionCreateInput = {
				type: Number(type),
				donor: { connect: { id: donor.id } },
				createdBy: { connect: { id: user.id } }
			};

			if (level === 1 || level === 3 || level === 4) {
				if (!date) return res.json({
					status: 400,
					success: false,
					content: 'La fecha es requerida para esta condición de salud.'
				});
			};

			if (level === 2) {
				if (detailedType.time && ended) {
					if (!endDate) return res.json({
						status: 400,
						success: false,
						content: 'La fecha de finalización es requerida'
					});

					healthConditionData.ended = ended;
					healthConditionData.endDate = endDate;
					healthConditionData.endDateTime = new Date();
					healthConditionData.endedBy = { connect: { id: user.id } };
				};

				if (!detailedType.time && ended) {
					healthConditionData.ended = ended;
					healthConditionData.endDateTime = new Date();
					healthConditionData.endedBy = { connect: { id: user.id } };
				};
			};

			if (level === 3) {
				if (ended) {
					if (!endDate) return res.json({
						status: 400,
						success: false,
						content: 'La fecha de finalización es requerida.'
					});
					
					if (!dueTo) return res.json({
						status: 400,
						success: false,
						content: 'El motivo de finalización es requerido.'
					});
				};

				if (endDate) {
					if (!ended) return res.json({
						status: 400,
						success: false,
						content: 'Acción inválida.'
					});
					
					if (!dueTo) return res.json({
						status: 400,
						success: false,
						content: 'El motivo de finalización es requerido.'
					});
				}

				if (dueTo) {
					if (!ended) return res.json({
						status: 400,
						success: false,
						content: 'Acción inválida.'
					});

					if (!endDate) return res.json({
						status: 400,
						success: false,
						content: 'La fecha de finalización es requerida.'
					});
				};

				if (ended && endDate && dueTo) {
					healthConditionData.ended = ended;
					healthConditionData.endDate = endDate;
					healthConditionData.endDateTime = new Date();
					healthConditionData.dueTo = Number(dueTo);
					healthConditionData.endedBy = { connect: { id: user.id } };
				};
			};

			if (date) healthConditionData.date = date;

			await prisma.healthCondition.create({ data: healthConditionData });

			await prisma.log.create({
				data: {
					description: `Se ha registrado una condición de salud para paciente con cédula ${ donor.ci.letter } - ${ new Intl.NumberFormat('es-VE').format(Number(donor.ci.number)) }.`,
					type: LOGS.HEALTH_CONDITION,
					by: { connect: { id: user.id } }
				}
			});

			return res.json({
				status: 200,
				success: true,
				content: 'Condición de salud registrada exitosamente.'
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
	getHealthConditions: async (req, res) => {
		try {
			const queries = req.query;
			const limit = parseInt(queries?.limit) || 6;
			const page = (parseInt(queries?.page) || 1) - 1;
			
			const { donorId } = req.params;

			const count = await prisma.healthCondition.count({
				where: { donorId: Number(donorId) }
			});

			if (!count) return res.json({
				status: 400,
				success: false,
				content: {
					data: 'No hay condiciones de salud registradas para este donante.',
					quantity: count
				}
			});

			const healthConditions = await prisma.healthCondition.findMany({
				skip: page * limit,
				take: limit,
				where: { donorId: Number(donorId) },
				orderBy: {
					createdAt: 'desc'
				},
				include: {
					createdBy: {
						select: { name: true }
					},
					endedBy: {
						select: { name: true }
					}
				},
				omit: {
					donorId: true,
					endedById: true,
					createdById: true,
					updatedAt: true
				}
			});

			const parsedHCs: Array<HealthConditionParsed> = [];

			for (let i = 0; i < healthConditions.length; i++) {
				const hc = healthConditions[i];
				const details = DONOR.HEALTH_CONDITIONS.entities[ hc.type ];

				const hcParser: HealthConditionParsed = {
					...hc,
					label: details.label,
					level: details.level,
					dueTo: hc.dueTo && details.level === 3 ? details.dueToOpts[ hc.dueTo ] : null,
					dueToOpts: details.level === 3 && !hc.endDate ? Object.values(details.dueToOpts) : undefined,
					time: details.time
				};

				parsedHCs.push(hcParser);
			};
			
			return res.json({
				status: 200,
				success: true,
				content: {
					data: parsedHCs,
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
	endHealthCondition: async (req, res) => {
		try {
			const user = await prisma.user.findUnique({
				where: { id: req.user.id }
			});

			if (user?.role !== 'USER') return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida'
			});

			const { donorId, hcId } = req.params;

			const donor = await prisma.donor.findUnique({
				where: { id: Number(donorId) },
				include: {
					ci: true,
					healthConditions: { where: { id: Number(hcId) } }
				}
			});

			if (!donor || !donor.ci) return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida.'
			});

			const [ healthCondition ] = donor.healthConditions;

			if (!healthCondition) return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida.'
			});

			const { type, endDate: endedDate } = healthCondition;

			if (endedDate) return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida.'
			});

			const { dueTo, endDate } = req.body as {
				dueTo?: string,
				endDate?: string
			};

			const data: Prisma.HealthConditionUpdateInput = {
				endedBy: { connect: { id: user.id } }
			};

			const detailedType = DONOR.HEALTH_CONDITIONS.entities[ type ];
			const { level } = detailedType;

			if (level === 1 || level === 4) return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida.'
			});

			if (level === 2 || level === 3) {
				if (!endDate) return res.json({
					status: 400,
					success: false,
					content: 'La fecha de finalización es requerida.'
				});

				data.ended = true;
				data.endDate = endDate;
				data.endDateTime = new Date();
			};

			if (level === 3) {
				if (!dueTo) return res.json({
					status: 400,
					success: false,
					content: 'El motivo de finalización es requerido.'
				});

				data.dueTo = Number(dueTo);
			};

			const endedHC = await prisma.healthCondition.update({
				where: { id: Number(hcId) },
				data,
				include: {
					createdBy: {
						select: { name: true }
					},
					endedBy: {
						select: { name: true }
					}
				},
				omit: {
					donorId: true,
					endedById: true,
					createdById: true,
					updatedAt: true
				}
			});

			await prisma.log.create({
				data: {
					description: `Se ha finalizado una condición de salud para paciente con cédula ${ donor.ci.letter } - ${ new Intl.NumberFormat('es-VE').format(Number(donor.ci.number)) }.`,
					type: LOGS.HEALTH_CONDITION,
					by: { connect: { id: user.id } }
				}
			});

			return res.json({
				status: 200,
				success: true,
				content: {
					message: 'Condición de salud finalizada exitosamente.',
					data: endedHC
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
	}
};

export default healthCondCtrl;