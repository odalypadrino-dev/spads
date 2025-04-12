import jwt from 'jsonwebtoken';
import prisma from "@lib/prisma";
import bcrypt from 'bcrypt';

import USER from '@constants/user';
import LOGS from "@constants/logs";

import type { CookieOptions } from "express";
import type { JwtPayload, Secret } from 'jsonwebtoken';
import type { Prisma } from "prisma";
import type { APIHandler } from "types/express";

type UserController = {
	register: APIHandler,
	login: APIHandler,
	logout: APIHandler,
	refreshToken: APIHandler,
	getInfo: APIHandler
};

const userCtrl: UserController = {
	register: async (req, res) => {
		try {
			const admin = await prisma.user.count({
				where: {
					role: 'ADMIN'
				}
			});

			const { firstName, lastName, ci, password, confirmPassword } = req.body as Prisma.UserCreateWithoutLogsInput & { confirmPassword: string };

			if (!firstName) return res.json({
				status: 400,
				success: false,
				content: 'El nombre es requerido.'
			});

			if (firstName.length < USER.FIRST_NAME.MIN_LENGTH) return res.json({
				status: 400,
				success: false,
				content: `El nombre debe tener como mínimo ${ USER.FIRST_NAME.MIN_LENGTH } caracteres de longitud.`
			});

			if (!lastName) return res.json({
				status: 400,
				success: false,
				content: 'El apellido es requerido.'
			});

			if (lastName.length < USER.LAST_NAME.MIN_LENGTH) return res.json({
				status: 400,
				success: false,
				content: `El apellido debe tener como mínimo ${ USER.LAST_NAME.MIN_LENGTH } caracteres de longitud.`
			});

			if (!ci) return res.json({
				status: 400,
				success: false,
				content: 'La cédula es requerida.'
			});

			if (isNaN(Number(ci))) return res.json({
				status: 400,
				success: false,
				content: 'La cédula es inválida.'
			});

			if (ci.length < USER.CI.MIN_LENGTH) return res.json({
				status: 400,
				success: false,
				content: `La cédula debe tener como mínimo ${ USER.CI.MIN_LENGTH } dígitos.`
			});

			if (ci.length > USER.CI.MAX_LENGTH) return res.json({
				status: 400,
				success: false,
				content: `La cédula debe tener como máximo ${ USER.CI.MAX_LENGTH } dígitos.`
			});

			const drExist = await prisma.user.findUnique({
				where: { ci }
			});

			if (drExist) return res.json({
				status: 400,
				success: false,
				content: 'La cédula ya está registrada.'
			});

			if (password?.length < USER.PASSWORD.MIN_LENGTH) return res.json({
				status: 400,
				success: false,
				content: `La contraseña debe tener como mínimo ${ USER.PASSWORD.MIN_LENGTH } caracteres de longitud.`
			});

			if (password !== confirmPassword) return res.json({
				status: 400,
				success: false,
				content: "Las contraseñas deben ser iguales."
			});

			const passwordHash = await bcrypt.hash(password, 10);

			const user: Prisma.UserCreateInput = {
				firstName,
				lastName,
				ci,
				password: passwordHash,
				...( !admin ? { role: 'ADMIN' } : {} ),
				logs: {
					create: {
						description: `Se ha registrado el usuario ${ firstName } ${ lastName } con cédula ${ new Intl.NumberFormat('es-VE').format(Number(ci)) }`,
						type: LOGS.REGISTER
					}
				}
			};

			await prisma.user.create({ data: user });

			return res.json({
				status: 200,
				success: true,
				content: 'Se ha registrado exitosamente.'
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
	login: async (req, res) => {
		try {
			const { ci, password, keepSession } = req.body as Prisma.UserCreateWithoutLogsInput & { keepSession: boolean };

			if (!ci) return res.json({
				status: 400,
				success: false,
				content: "La cédula es obligatoria."
			});

			if (ci.length < USER.CI.MIN_LENGTH) return res.json({
				status: 400,
				success: false,
				content: `La cédula debe tener como mínimo ${ USER.CI.MIN_LENGTH } dígitos.`
			});

			if (ci.length > USER.CI.MAX_LENGTH) return res.json({
				status: 400,
				success: false,
				content: `La cédula debe tener como máximo ${ USER.CI.MAX_LENGTH } dígitos.`
			});

			if (!password) return res.json({
				status: 400,
				success: false,
				content: "Contraseña obligatoria."
			});

			const user = await prisma.user.findUnique({
				where: { ci }
			});

			if (!user) return res.json({
				status: 400,
				success: false,
				content: "Datos incorrectos."
			});

			const passwordMatch = await bcrypt.compare(password, user.password);

			if (!passwordMatch) return res.json({
				status: 400,
				success: false,
				content: 'Datos incorrectos.'
			});

			const refreshToken = createRefreshToken({ id: user.id, keepSession });
			
			const accessToken = createAccessToken({ id: user.id });

			const cookieSetting: CookieOptions = {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				path: '/user/a983bfd8826c0c5cd605a6370cfe02'
			};

			await prisma.log.create({
				data: {
					description: `El usuario ${ user.firstName } ${ user.lastName } de cédula ${ new Intl.NumberFormat('es-VE').format(Number(user.ci)) } ha iniciado sesión.`,
					type: LOGS.LOGIN,
					by: {
						connect: { id: user.id }
					}
				}
			});

			if (keepSession) {
				cookieSetting.expires = new Date(Date.now() + 7 * 24 * 3600000);
				cookieSetting.maxAge = 7 * 24 * 3600000;

				res.cookie('a983bfd8826c0c5cd605a6370cfe02', refreshToken, cookieSetting);

				return res.json({
					status: 200,
					success: true,
					content: accessToken
				});
			};

			res.cookie('a983bfd8826c0c5cd605a6370cfe02', refreshToken, cookieSetting);

			return res.json({
				status: 200,
				success: true,
				content: accessToken
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
	logout: async (req, res) => {
		try {
			res.clearCookie('a983bfd8826c0c5cd605a6370cfe02', {
				path: '/user/a983bfd8826c0c5cd605a6370cfe02'
			});

			return res.json({
				status: 200,
				success: true
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
	refreshToken: async (req, res) => {
		try {
			const rf_token = req.cookies["a983bfd8826c0c5cd605a6370cfe02"];

			if (!rf_token) {
				return res.json({
					status: 400,
					success: false,
					content: "Please login or register."
				});
			};
	
			const user = jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET as Secret) as { id: number, keepSession: boolean };

			const accessToken = createAccessToken({ id: user.id });

			if (user.keepSession) {
				const newRefreshToken = createRefreshToken({ id: user.id, keepSession: user.keepSession });

				res.cookie('a983bfd8826c0c5cd605a6370cfe02', newRefreshToken, {
					httpOnly: false,
					secure: false,
					sameSite: 'lax',
					path: '/user/a983bfd8826c0c5cd605a6370cfe02',
					expires: new Date(Date.now() + 7 * 24 * 3600000),
					maxAge: 7 * 24 * 3600000
				});
			};

			return res.json({
				status: 200,
				success: true,
				content: accessToken
			});
		} catch (err) {
			res.clearCookie('a983bfd8826c0c5cd605a6370cfe02', {
				path: '/user/a983bfd8826c0c5cd605a6370cfe02'
			});
			return res.json({
				status: 400,
				success: false,
				content: "Please login or register."
			});
		};
	},
	getInfo: async (req, res) => {
		try {
			const userId = req.user.id;

			const user = await prisma.user.findUnique({
				where: { id: userId },
				omit: {
					id: true,
					password: true,
					createdAt: true,
					updatedAt: true
				}
			});

			if (!user) return res.json({
				status: 400,
				success: false,
				content: "El usuario no existe."
			});

			return res.json({
				status: 200,
				success: true,
				content: user
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

const createAccessToken = (user: JwtPayload) => {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as Secret, { expiresIn: '15m' });
};

const createRefreshToken = (user: JwtPayload) => {
	return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as Secret, { expiresIn: '7d' });
};

export default userCtrl;