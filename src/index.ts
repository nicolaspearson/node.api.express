import 'module-alias/register';

import * as dotenv from 'dotenv';
import express from 'express';

import * as config from '@env';
import { init as initLogger, logger } from '@logger/app.logger';

// Init config
dotenv.config();
config.init();

// Init logger
initLogger();

// Create a new express application instance
const app: express.Application = express();

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(config.get().API_PORT, () => {
	logger.debug(`Example app listening on port ${config.get().API_PORT}!`);
});
