import type { APIHandler } from "types/express";

export type RootController = {
	getLogs: APIHandler;
};