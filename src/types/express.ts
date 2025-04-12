import type { NextFunction, ParamsDictionary, Request, Response } from "express-serve-static-core";

interface CustomResponse extends Response {
    /**
     * Send JSON response.
     *
     * Examples:
     *
     *     res.json({ status: 200, success: true, content: 'success action' });
     */
	json: (body: { status: 200 | 400 | 500, success: boolean, content?: any }) => this;
};

type ParsedQs = {
	[ q: string ]: string;
}

export type APIHandler<
	P = ParamsDictionary,
	ReqQuery = ParsedQs
> = (
		req: Request<P, {}, {}, ReqQuery>,
		res: CustomResponse,
		next: NextFunction,
) => void;