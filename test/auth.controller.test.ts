import request from 'supertest';
import * as typeorm from 'typeorm';

import App from '../src/app';
import AuthController from '../src/controllers/auth.controller';
import LoginUserDto from '../src/dto/user.login.dto';
import RegisterUserDto from '../src/dto/user.register.dto';
import * as env from '../src/env';
import * as logger from '../src/logger';

(typeorm as any).getRepository = jest.fn();

env.init();
logger.init();

describe('AuthController', () => {
	const authController = new AuthController();

	describe('POST /auth/register', () => {
		describe('if the email address is not in use', () => {
			it('response should have the Set-Cookie header with the Authorization token', async () => {
				const userData: RegisterUserDto = {
					firstName: 'John',
					lastName: 'Doe',
					emailAddress: 'john.doe@test.com',
					password: 'testing'
				};
				process.env.JWT_SECRET = 'secret';
				(typeorm as any).getRepository.mockReturnValue({
					findOne: () => Promise.resolve(undefined),
					save: () =>
						Promise.resolve({
							...userData,
							id: 0
						})
				});
				const app = new App();
				app.listen();
				const response = request(app.getExpressApp())
					.post(`${authController.path}/register`)
					.send(userData);
				response.expect('Set-Cookie', /^Authorization=.+/);
				app.getServer().close();
				return response;
			});
		});
	});

	describe('POST /auth/login', () => {
		describe('if the email address is valid', () => {
			it('response should have the Set-Cookie header with the Authorization token', async () => {
				const userData: LoginUserDto = {
					emailAddress: 'john.doe@test.com',
					password: 'testing'
				};
				process.env.JWT_SECRET = 'secret';

				const encryptedPassword = await authController.userService.encryptPassword(
					userData.password
				);
				(typeorm as any).getRepository.mockReturnValue({
					findOne: () =>
						Promise.resolve({
							emailAddress: userData.emailAddress,
							password: encryptedPassword
						})
				});
				const app = new App();
				app.listen();
				const response = request(app.getExpressApp())
					.post(`${authController.path}/login`)
					.send(userData);
				response.expect('Set-Cookie', /^Authorization=.+/);
				app.getServer().close();
				return response;
			});
		});
	});
});
