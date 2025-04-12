import { Prisma } from "prisma";

import prisma from "@lib/prisma";

import DONOR from '@constants/donor';
import LOGS from "@constants/logs";

import type {
    BloodTestController,
	BloodTestParsed,
	BloodResultParsed,
	BloodTestBody
} from 'types/donor';

const bloodTestCtrl: BloodTestController = {
	addBloodTest: async (req, res) => {
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
				include: { ci: true }
			});

			if (!donor || !donor.ci) return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida.'
			});

			const { bloodType, bloodResults } = req.body as BloodTestBody;

			if (!bloodResults?.length) return res.json({
				status: 400,
				success: false,
				content: 'Los resultados del análisis de sangre del donante son requeridos.'
			});

			for (let i = 0; i < bloodResults.length; i++) {
				const bloodResult = bloodResults[i];
				const [ MIN, MAX ] = DONOR.BLOOD_TEST_RESULTS.RANGE;
				
				if (isNaN(Number(bloodResult)) || Number(bloodResult) < MIN || Number(bloodResult) > MAX) return res.json({
					status: 400,
					success: false,
					content: 'El resultado del análisis de sangre del donante es inválido.'
				});
			};

			if (!donor.bloodType) {
				if (!bloodType) return res.json({
					status: 400,
					success: false,
					content: 'El tipo de sangre del donante es requerido.'
				});

				if (!DONOR.BLOOD_TYPES.includes(bloodType)) return res.json({
					status: 400,
					success: false,
					content: 'El tipo de sangre del donante es inválido.'
				});

				await prisma.donor.update({
					where: { id: donor.id },
					data: {
						bloodType,
						lastUpdatedBy: { connect: { id: user.id } }
					}
				});
			};

			const bloodTest: Prisma.BloodTestCreateInput = {
				bloodResults: {
					create: bloodResults.map(br => ({ type: Number(br) }))
				},
				donor: { connect: { id: donor.id } },
				createdBy: { connect: { id: user.id } }
			};
			
			await prisma.bloodTest.create({ data: bloodTest });

			await prisma.log.create({
				data: {
					description: `Se ha registrado un análisis de sangre para paciente con cédula ${ donor.ci.letter } - ${ new Intl.NumberFormat('es-VE').format(Number(donor.ci.number)) }.`,
					type: LOGS.BLOOD_TEST,
					by: { connect: { id: user.id } }
				}
			});

			return res.json({
				status: 200,
				success: true,
				content: 'Análisis de sangre registrado exitosamente.'
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
	getBloodTest: async (req, res) => {
		try {
			const queries = req.query;
			const limit = parseInt(queries?.limit) || 6;
			const page = (parseInt(queries?.page) || 1) - 1;
			
			const { donorId } = req.params;

			const count = await prisma.bloodTest.count({
				where: { donorId: Number(donorId) }
			});

			if (!count) return res.json({
				status: 400,
				success: false,
				content: {
					data: 'No hay exámenes de sangre registrados para este donante.',
					quantity: count
				}
			});

			const bloodTests = await prisma.bloodTest.findMany({
				skip: page * limit,
				take: limit,
				where: { donorId: Number(donorId) },
				orderBy: {
					createdAt: 'desc'
				},
				include: {
					bloodResults: {
						omit: { bloodTestId: true }
					},
					createdBy: {
						select: { name: true }
					}
				},
				omit: {
					donorId: true,
					createdById: true,
					updatedAt: true
				}
			});

			const parsedBTs: Array<BloodTestParsed> = [];

			for (let i = 0; i < bloodTests.length; i++) {
				const bloodTest = bloodTests[i];
				const { bloodResults } = bloodTest;

				const parsedBRs: Array<BloodResultParsed> = [];

				for (let j = 0; j < bloodResults.length; j++) {
					const bloodResult = bloodResults[j];
					const details = DONOR.BLOOD_TEST_RESULTS.entities[ bloodResult.type ];

					const br: BloodResultParsed = {
						...bloodResult,
						...details
					};

					parsedBRs.push(br);
				};

				const bt: BloodTestParsed = {
					...bloodTest,
					bloodResults: parsedBRs
				};

				parsedBTs.push(bt);
			};
			
			return res.json({
				status: 200,
				success: true,
				content: {
					data: parsedBTs,
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
	}
};

export default bloodTestCtrl;