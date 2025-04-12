import prisma from '@lib/prisma';

import USER from '@constants/user';

import type { RequestHandler } from 'express';

const isAdmin: RequestHandler = async (req, res, next) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.user.id }
		});

		if (user!.role !== USER.ROLES.ADMIN) return res.json({
			status: 400,
			success: false,
			content: "Admin resources access denied."
		});

		next();
	} catch (err) {
		const { message } = err as { message: string };

		const error = {
			status: 500,
			success: false,
			content: message
		};

		res.json(error);
	};
};

export default isAdmin;