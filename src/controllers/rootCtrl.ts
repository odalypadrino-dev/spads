import parsedSearch from "@lib/parsedSearch";
import prisma from "@lib/prisma";

import type { RootController } from "types/root";

const rootCtrl: RootController = {
	getLogs: async (req, res) => {
		try {
			const queries = req.query;
			const limit = parseInt(queries?.limit) || 10;
			const page = (parseInt(queries?.page) || 1) - 1;
			const search = queries?.search ? parsedSearch(queries.search) : "";

			const count = await prisma.log.count();

			if (!count) return res.json({
				status: 400,
				success: false,
				content: {
					data: 'No hay acciones registradas.',
					quantity: count
				}
			});

			const logs = await prisma.log.findMany({
				...(search ? { where: { by: { ci: { search } } } } : {}),
				take: limit,
				skip: page * limit,
				orderBy: { createdAt: 'desc' },
				include: {
					by: {
						select: {
							name: true,
							ci: true,
							role: true
						}
					}
				},
				omit: {
					byId: true,
					updatedAt: true
				}
			});

			const countBySearch = await prisma.log.count({
				...(search ? { where: { by: { ci: { search } } } } : {}),
			})

			if (!countBySearch) return res.json({
				status: 400,
				success: false,
				content: {
					data: 'No hay acciones registradas con este criterio de búsqueda.',
					quantity: countBySearch
				}
			});

			return res.json({
				status: 200,
				success: true,
				content: {
					data: logs,
					quantity: countBySearch
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

export default rootCtrl;