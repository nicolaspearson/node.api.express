import * as bcrypt from 'bcrypt';
import Boom from 'boom';

import LoginDto from '@dto/user.login.dto';
import RegisterUserDto from '@dto/user.register.dto';
import User from '@entities/user.entity';
import CookieUser from '@interfaces/cookie-user';
import Token from '@interfaces/token';
import TokenContents from '@interfaces/token-contents.interface';
import TokenData from '@interfaces/token-data.interface';
import UserRepository from '@repositories/user.repository';
import BaseService from '@services/base.service';

export default class UserService extends BaseService<User> {
	constructor(private userRepository: UserRepository) {
		super(userRepository);
	}

	public preSaveHook(user: User): void {
		// Executed before the save repository call
		delete user.id;
	}

	public preUpdateHook(user: User) {
		// Executed before the update repository call
		delete user.updatedAt;
	}

	public preDeleteHook(user: User) {
		// Executed before the delete repository call
		user.deletedAt = new Date();
	}

	public async register(userData: RegisterUserDto): Promise<CookieUser> {
		if (
			await this.userRepository.findOneByFilter({ where: { emailAddress: userData.emailAddress } })
		) {
			throw Boom.badRequest('That email address is already registered!');
		}
		const hashedPassword = await this.encryptPassword(userData.password);
		const user = await this.userRepository.saveRecord({
			...userData,
			password: hashedPassword
		});

		// Create a token for the user
		delete user.password;
		const tokenData = this.createToken(user);
		const cookie = this.createCookie(tokenData);
		return {
			cookie,
			user
		};
	}

	public async login(userData: LoginDto): Promise<CookieUser> {
		try {
			let userResult: User;
			try {
				// Fetch the user from the database
				userResult = await this.userRepository.findOneByFilter({
					where: {
						emailAddress: userData.emailAddress,
						enabled: true
					}
				});
			} catch (error) {
				// User not found / disabled
				throw Boom.unauthorized('Invalid credentials supplied');
			}

			// Validate the provided password
			const valid = await this.validatePassword(userResult.password, userData.password);
			if (!valid) {
				throw Boom.unauthorized('Invalid email address / password supplied');
			}

			// Create a token for the user
			delete userResult.password;
			const tokenData = this.createToken(userResult);
			const cookie = this.createCookie(tokenData);
			return {
				cookie,
				user: userResult
			};
		} catch (error) {
			if (error && error.isBoom) {
				throw error;
			}
			throw Boom.internal(error);
		}
	}

	public createToken(user: User): Token {
		const expiresIn = 60 * 60; // 1 hour
		const tokenContents: TokenContents = {
			id: user.id
		};
		// Create a token
		const token: Token = new Token();
		token.expiresIn = expiresIn;
		token.generateToken(tokenContents);
		return token;
	}

	public createCookie(tokenData: TokenData) {
		return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
	}

	private async encryptPassword(password: string): Promise<string> {
		try {
			const salt: string = await bcrypt.genSalt(10);
			return await bcrypt.hash(password, salt);
		} catch (error) {
			throw error;
		}
	}

	private async validatePassword(dbPassword: string, password: string): Promise<boolean> {
		try {
			return await bcrypt.compare(dbPassword, password);
		} catch (error) {
			throw error;
		}
	}
}
