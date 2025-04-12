import prisma from '@lib/prisma';

import USER from '@constants/user';

import type { RequestHandler } from 'express';

const isRootAdmin: RequestHandler = async (req, res, next) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.user.id }
		});

		if (![ USER.ROLES.ROOT, USER.ROLES.ADMIN ].includes(user!.role)) return res.json({
			status: 400,
			success: false,
			content: "Elevated resources access denied."
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

export default isRootAdmin;