import { NextFunction, Request, Response } from 'express';

async function authMiddleware(request: Request, response: Response, next: NextFunction) {
	next();
}

export default authMiddleware;
