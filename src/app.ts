import * as bodyParser from 'body-parser';
import express from 'express';

import * as config from '@env';
import { logger } from '@logger';
import loggerMiddleware from '@middleware/logger.middleware';

class App {
	public app: express.Application;

	constructor() {
		this.app = express();
		this.initializeMiddleware();
		this.initializeControllers();
	}

	public listen() {
		const port: number = config.get().API_PORT;
		this.app.listen(port, () => {
			logger.debug(`App: Listening on port ${port}!`);
		});
	}

	private initializeMiddleware() {
		this.app.use(loggerMiddleware);
		this.app.use(bodyParser.json());
	}

	private initializeControllers() {
		// controllers.forEach(controller => {
		// 	this.app.use('/', controller.router);
		// });
	}
}

export default App;
