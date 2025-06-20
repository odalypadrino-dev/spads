import { Prisma } from "prisma";

import parsedSearch from "@lib/parsedSearch";
import prisma from "@lib/prisma";

import DONOR from '@constants/donor';
import LOGS from "@constants/logs";

import type {
	DonorController,
	DonorBody
} from 'types/donor';
import getAge from "@lib/getAge";

const donorCtrl: DonorController = {
	register: async (req, res) => {
		try {
			const user = await prisma.user.findUnique({
				where: { id: req.user.id }
			});

			if (user?.role !== 'USER') return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida'
			});

			const {
				names,
				surnames,
				letter,
				number,
				birthdate,
				genre,
				phone,
				dir,
				weight
			} = req.body as DonorBody;

			if (!names) return res.json({
				status: 400,
				success: false,
				content: 'Los nombres son requeridos.'
			});

			if (names.length < DONOR.NAMES.MIN_LENGTH) return res.json({
				status: 400,
				success: false,
				content: `El campo de nombres deben tener como mínimo ${ DONOR.NAMES.MIN_LENGTH } caracteres de longitud.`
			});

			if (!surnames) return res.json({
				status: 400,
				success: false,
				content: 'Los apellidos son requeridos.'
			});

			if (names.length < DONOR.SURNAMES.MIN_LENGTH) return res.json({
				status: 400,
				success: false,
				content: `El campo de apellidos deben tener como mínimo ${ DONOR.SURNAMES.MIN_LENGTH } caracteres de longitud.`
			});

			if (!letter || !number) return res.json({
				status: 400,
				success: false,
				content: 'La cédula del donante es requerida.'
			});

			if (!DONOR.CI.TYPES.includes(letter)) return res.json({
				status: 400,
				success: false,
				content: "El tipo de cédula es inválido."
			});

			if (String(number).length < DONOR.CI.MIN_LENGTH) return res.json({
				status: 400,
				success: false,
				content: `La cédula del donante debe tener como mínimo ${ DONOR.CI.MIN_LENGTH } caracteres de longitud.`
			});

			if (String(number).length > DONOR.CI.MAX_LENGTH) return res.json({
				status: 400,
				success: false,
				content: `La cédula del donante debe tener como máximo ${ DONOR.CI.MAX_LENGTH } caracteres de longitud.`
			});

			const donor = await prisma.donor.findFirst({
				where: {
					ci: { letter, number }
				},
				include: { ci: true }
			});

			if (donor) return res.json({
				status: 400,
				success: false,
				content: `El donante con cédula ${ letter } - ${ new Intl.NumberFormat('es-VE').format(Number(number)) } ya está registrado.`
			});

			if (!birthdate) return res.json({
				status: 400,
				success: false,
				content: 'La fecha de nacimiento del donante es requerida.'
			});

			const age = getAge(birthdate);

			const [ MIN_AGE, MAX_AGE ] = DONOR.AGE.RANGE;

			if (age < MIN_AGE) return res.json({
				status: 400,
				success: false,
				content: `El donante debe tener ${ MIN_AGE } años de edad o más.`
			});

			if (age > MAX_AGE) return res.json({
				status: 400,
				success: false,
				content: `El donante tiene más de ${ MAX_AGE } años de edad.`
			});

			if (!genre) return res.json({
				status: 400,
				success: false,
				content: 'El genero del donante es requerido.'
			});

			if (!DONOR.GENRE.includes(genre)) return res.json({
				status: 400,
				success: false,
				content: 'El genero del donante es inválido.'
			});

			if (!phone) return res.json({
				status: 400,
				success: false,
				content: 'El teléfono del donante es requerido.'
			});

			if (isNaN(Number(phone)) || phone.length !== DONOR.PHONE.LENGTH) return res.json({
				status: 400,
				success: false,
				content: 'El teléfono del donante es inválido.'
			});

			if (!dir) return res.json({
				status: 400,
				success: false,
				content: 'La dirección del donante es requerida.'
			});

			if (dir.length < DONOR.DIR.MIN_LENGTH) return res.json({
				status: 400,
				success: false,
				content: `La dirección del donante debe tener como mínimo ${ DONOR.DIR.MIN_LENGTH } caracteres de longitud.`
			});

			if (dir.length > DONOR.DIR.MAX_LENGTH) return res.json({
				status: 400,
				success: false,
				content: `La dirección del donante debe tener como máximo ${ DONOR.DIR.MAX_LENGTH } caracteres de longitud.`
			});

			if (!weight) return res.json({
				status: 400,
				success: false,
				content: 'El peso del donante es requerido.'
			});

			if (isNaN(Number(weight))) return res.json({
				status: 400,
				success: false,
				content: 'El peso del donante es inválido.'
			});

			const [ lastDonor ] = await prisma.donor.findMany({
				take: 1,
				orderBy: { id: 'desc' }
			});

			const record = `#${ String(lastDonor?.id + 1 || 1).padStart(4, '0') }`;

			const donorData: Prisma.DonorCreateInput = {
				record,
				names,
				surnames,
				birthdate,
				genre,
				phone,
				dir,
				weight: Number(weight),
				ci: { 
					create: {
						letter,
						number
					}
				},
				ciString: `${ letter }${ number }`,
				registeredBy: { connect: { id: user.id } },
				lastUpdatedBy: { connect: { id: user.id } }
			};

			const newDonor = await prisma.donor.create({ data: donorData });

			await prisma.log.create({
				data: {
					description: `Se ha registrado una historia clínica sobre el paciente con cédula ${ letter } - ${ new Intl.NumberFormat('es-VE').format(Number(number)) }.`,
					type: LOGS.DONOR,
					by: { connect: { id: user.id } }
				}
			});

			return res.json({
				status: 200,
				success: true,
				content: {
					message: 'Donante añadido exitosamente.',
					data: newDonor.id
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
	getById: async (req, res) => {
		try {
			const { donorId } = req.params;

			const donor = await prisma.donor.findUnique({
				where: { id: Number(donorId) },
				include: {
					ci: {
						omit: {
							id: true,
							donorId: true
						}
					},
					registeredBy: {
						select: { name: true }
					},
					lastUpdatedBy: {
						select: { name: true }
					}
				},
				omit: {
					names: true,
					surnames: true,
					birthdate: true,
					registeredById: true,
					lastUpdatedById: true
				}
			});

			if (!donor) return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida.'
			});

			return res.json({
				status: 200,
				success: true,
				content: donor
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
	getAll: async (req, res) => {
		try {
			const queries = req.query;
			const limit = parseInt(queries?.limit) || 10;
			const page = (parseInt(queries?.page) || 1) - 1;
			const search = queries?.search ? parsedSearch(queries.search) : "";

			const count = await prisma.donor.count();

			if (!count) return res.json({
				status: 400,
				success: false,
				content: {
					data: 'No hay donantes registrados.',
					quantity: count
				}
			});

			const donors = await prisma.donor.search({ query: search, page, limit })

			if (!donors.quantity) return res.json({
				status: 400,
				success: false,
				content: {
					data: 'No hay donantes registrados con estos criterios de búsqueda.',
					quantity: donors.quantity
				}
			});

			return res.json({
				status: 200,
				success: true,
				content: donors
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
	edit: async (req, res) => {
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

			const fields = req.body as {
				phone?: string;
				dir?: string;
				weight?: string;
			};

			if (!Object.keys(fields).length) return res.json({
				status: 400,
				success: false,
				content: "No hay datos por actualizar."
			});

			if (Object.keys(fields).some(f => ![ 'phone', 'dir', 'weight' ].includes(f))) return res.json({
				status: 400,
				success: false,
				content: 'Acción inválida.'
			});

			if (fields.phone && isNaN(Number(fields.phone))) return res.json({
				status: 400,
				success: false,
				content: 'El número de teléfono del donante es inválido.'
			});

			if (fields.weight && isNaN(Number(fields.weight))) return res.json({
				status: 400,
				success: false,
				content: 'El peso del donante es inválido.'
			});

			const data: Prisma.DonorUpdateInput = {
				...(fields.weight ? { weight: Number(fields.weight) } : {}),
				...(fields.phone ? { phone: fields.phone } : {}),
				...(fields.dir ? { dir: fields.dir } : {})
			};

			await prisma.donor.update({
				where: { id: donor.id },
				data: {
					...data,
					lastUpdatedBy: { connect: { id: user.id } }
				}
			});

			await prisma.log.create({
				data: {
					description: `Se ha actualizado la información del paciente con cédula ${ donor.ci.letter } - ${ new Intl.NumberFormat('es-VE').format(Number(donor.ci.number)) }.`,
					type: LOGS.DONOR,
					by: { connect: { id: user.id } }
				}
			});

			return res.json({
				status: 200,
				success: true,
				content: 'La información del donante ha sido actualizada exitosamente.'
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

export default donorCtrl;