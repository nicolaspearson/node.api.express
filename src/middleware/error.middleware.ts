import Boom from 'boom';
import { NextFunction, Request, Response } from 'express';

import HttpException from '@interfaces/http-exception.interface';

function errorMiddleware(
	error: HttpException,
	request: Request,
	response: Response,
	next: NextFunction
) {
	let statusCode = error.status || 500;
	const message = error.message || 'Internal Server Error';

	if (error && error.output && error.output.statusCode) {
		statusCode = error.output.statusCode;
	}

	if (!Boom.isBoom(error)) {
		error = Boom.boomify(error, { statusCode, message });
	}

	response.status(statusCode).send({
		message,
		status
	});
}

export default errorMiddleware;
