import express from 'express';

import { logger, setupAppLogger } from './logger/app.logger';

// Create a new express application instance
const app: express.Application = express();

// Setup up the logger
setupAppLogger();

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(3000, () => {
	logger.debug('Example app listening on port 3000!');
});
