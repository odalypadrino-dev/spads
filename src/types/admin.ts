import type { APIHandler } from "types/express";

export type AdminController = {
	getStats: APIHandler;
};