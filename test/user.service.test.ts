import * as typeorm from 'typeorm';

import TokenData from '../src/interfaces/token-data.interface';
import UserRepository from '../src/repositories/user.repository';
import UserService from '../src/services/user.service';

(typeorm as any).getRepository = jest.fn();

describe('UserService', () => {
	const userRepository = new UserRepository();
	const userService = new UserService(userRepository);
	describe('when creating a cookie', () => {
		const tokenData: TokenData = {
			token: '',
			expiresIn: 1
		};
		it('should return a string', () => {
			expect(typeof userService.createCookie(tokenData)).toEqual('string');
		});
	});
});
