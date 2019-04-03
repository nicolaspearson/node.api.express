import * as bodyParser from 'body-parser';
import express from 'express';

import AuthController from '@controllers/auth.controller';
import HeroController from '@controllers/hero.controller';
import * as env from '@env';
import { logger } from '@logger';
import errorMiddleware from '@middleware/error.middleware';
import loggerMiddleware from '@middleware/logger.middleware';

class App {
	private app: express.Application;

	constructor() {
		this.app = express();
		this.initializeMiddleware();
		this.initializeControllers();
		this.initializeErrorHandling();
	}

	public getServer(): express.Application {
		return this.app;
	}

	public listen() {
		const port: number = Number(env.get().API_PORT);
		this.app.listen(port, () => {
			logger.debug(`App: Listening on port ${port}!`);
		});
	}

	private initializeMiddleware() {
		this.app.use(loggerMiddleware);
		this.app.use(bodyParser.json());
	}

	private initializeErrorHandling() {
		this.app.use(errorMiddleware);
	}

	private initializeControllers() {
		const controllers = [];
		controllers.push(new AuthController());
		controllers.push(new HeroController());

		controllers.forEach(controller => {
			this.app.use('/', controller.router);
		});
	}
}

export default App;
