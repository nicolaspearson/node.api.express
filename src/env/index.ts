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
	API_PORT: string | number;
	DB_NAME: string;
}

export function getServerConfig(): IServerConfigurations {
	return nconf.get();
}
