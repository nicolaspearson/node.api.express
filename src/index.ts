import 'dotenv/config';
import 'module-alias/register';
import 'reflect-metadata';

import { createConnection } from 'typeorm';

import App from '@app';
import * as env from '@env';
import * as logger from '@logger';

// We use dotenv and nconf to control
// environment variables in the app.
env.init();

// Winston is used for logging, lets
// prepare the logger implementation.
logger.init();

(async () => {
	try {
		const dbConfig = await import('@db/config.db');
		// Connect to the database
		const connection = await createConnection(dbConfig);
		// Run migrations
		await connection.runMigrations();
	} catch (error) {
		logger.logger.error(`Database: Error connecting!`, error);
		return error;
	}
	// Finally, initialize the app.
	const app = new App();
	app.listen();
})();
