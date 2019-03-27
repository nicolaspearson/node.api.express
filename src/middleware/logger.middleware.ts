import * as express from 'express';

import { logger } from '@logger';

function loggerMiddleware(request: express.Request, response: express.Response, next: () => void) {
	logger.debug(`${request.method} ${request.path}`);
	next();
}

export default loggerMiddleware;
