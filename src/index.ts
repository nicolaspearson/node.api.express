import 'dotenv/config';
import 'module-alias/register';
import 'reflect-metadata';

import { createConnection } from 'typeorm';

import App from '@app';
import * as db from '@db/config.db';
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
		// Connect to the database
		const connection = await createConnection(db.config);
		// Run migrations
		await connection.runMigrations();
	} catch (error) {
		logger.logger.error(`Database: Error connecting: ${JSON.stringify(error)}`);
		return error;
	}
	// Finally, initialize the app.
	const app = new App();
	app.listen();
})();
