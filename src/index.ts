import 'module-alias/register';

import * as dotenv from 'dotenv';
import express from 'express';

import * as config from '@env';
import { init as initLogger, logger } from '@logger';
import loggerMiddleware from '@middleware/logger.middleware';

// Init config
dotenv.config();
config.init();

// Init logger
initLogger();

// Create a new express application instance
const app: express.Application = express();

// Add middleware
app.use(loggerMiddleware);

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(config.get().API_PORT, () => {
	logger.debug(`App: Listening on port ${config.get().API_PORT}!`);
});
