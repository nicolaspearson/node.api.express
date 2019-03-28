import * as jwt from 'jsonwebtoken';

import * as env from '@env';
import TokenContents from '@interfaces/token-contents.interface';

export default class Token {
	constructor(token?: string) {
		if (token) {
			this.token = token;
		}
	}
	public token: string;

	public expiresIn?: number | string;

	public generateToken(contents: TokenContents) {
		this.token = jwt.sign(contents, env.get().JWT_SECRET, this.getTokenSigningOptions());
	}

	private getTokenSigningOptions(): jwt.SignOptions {
		return { expiresIn: this.expiresIn || env.get().JWT_EXPIRATION };
	}

	public verifyToken() {
		return jwt.verify(this.token, env.get().JWT_SECRET, { ignoreExpiration: false });
	}
}
