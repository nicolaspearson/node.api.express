import Boom from 'boom';
import { NextFunction, Request, Response } from 'express';

import { HttpException } from '@models/http-exception.model';

function errorMiddleware(
	error: HttpException,
	request: Request,
	response: Response,
	next: NextFunction
) {
	const statusCode = error.status || error.output.statusCode || 500;
	const message = error.message || 'Internal Server Error';

	if (!Boom.isBoom(error)) {
		error = Boom.boomify(error, { statusCode, message });
	}

	response.status(statusCode).send({
		message,
		status
	});
}

export default errorMiddleware;
