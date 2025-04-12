import jwt from 'jsonwebtoken';

import type { Secret } from 'jsonwebtoken';
import type { RequestHandler } from 'express';

const isAuth: RequestHandler = (req, res, next) => {
	try {
		const token = req.header("Authorization");
		
		if (!token) {
			res.json({
				status: 400,
				success: false,
				content: 'Invalid authentication',
			})

			return;
		};

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret, (err, user) => {
			if (err) {
				res.json({
					status: 400,
					success: false,
					content: `Invalid authentication: ${ err.message }`,
				});

				return;
			};

			req.user = user as { id: number };
			next();
		});

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

export default isAuth;