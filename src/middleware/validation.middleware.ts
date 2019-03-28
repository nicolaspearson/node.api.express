import Boom from 'boom';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';

function validationMiddleware<T>(type: any, skipMissingProperties = false): RequestHandler {
	return (request, response, next) => {
		validate(plainToClass(type, request.body), { skipMissingProperties }).then(
			(errors: ValidationError[]) => {
				if (errors.length > 0) {
					const message = errors
						.map((error: ValidationError) => Object.values(error.constraints))
						.join(', ');
					next(Boom.badRequest(message));
				} else {
					next();
				}
			}
		);
	};
}

export default validationMiddleware;
