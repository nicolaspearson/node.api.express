import * as path from 'path';
import { ConnectionOptions } from 'typeorm';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

import * as env from '@env';

const config: ConnectionOptions = {
	type: 'postgres',
	host: env.get().DB_HOST,
	port: Number(env.get().DB_PORT),
	username: env.get().DB_USERNAME,
	password: env.get().DB_PASSWORD,
	database: env.get().DB_NAME,
	schema: env.get().DB_SCHEMA,
	name: env.get().DB_CONNECTION_NAME,
	logging: getDatabaseLogLevel(),
	synchronize: env.environment() !== 'production',
	entities: [path.resolve('dist/entities/*.js')],
	migrations: [path.resolve('dist/migrations/*.js')],
	cli: {
		migrationsDir: path.resolve('src/migrations')
	}
};

function getDatabaseLogLevel() {
	let logLevel: LoggerOptions = false;
	if (env.get().DB_LOGGING) {
		logLevel = env.get().DB_LOGGING;
	}
	return logLevel;
}

export = config;
