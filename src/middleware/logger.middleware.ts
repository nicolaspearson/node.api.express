import { NextFunction, Request, Response } from 'express';

import { logger } from '@logger';

function loggerMiddleware(request: Request, response: Response, next: NextFunction) {
	logger.debug(`${request.method} ${request.path}`);
	next();
}

export default loggerMiddleware;
