import nconf from 'nconf';
import * as path from 'path';

export function init() {
	nconf.argv().env();
	const environment = nconf.get('NODE_ENV') || 'development';
	nconf.file(environment, path.resolve(`dist/env/config.${environment.toLowerCase()}.json`));
	nconf.file('default', path.resolve(`dist/env/config.default.json`));
}

export interface IServerConfigurations {
	API_HOST: string | number;
	API_PORT: number | string;
	DB_HOST: string;
	DB_PORT: number | string;
	DB_NAME: string;
	DB_LOGGING:
		| boolean
		| 'all'
		| Array<'query' | 'schema' | 'error' | 'warn' | 'info' | 'log' | 'migration'>;
	DB_CONNECTION_NAME: string;
	DB_SCHEMA: string;
	DB_PASSWORD: string;
	DB_USERNAME: string;
}

export function get(): IServerConfigurations {
	return nconf.get();
}
