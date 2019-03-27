import * as express from 'express';

import { Hero } from '@models/hero.model';

class HeroController {
	public router = express.Router();

	private heroes: Hero[] = [
		{
			id: 1,
			name: 'Spiderman',
			identity: 'Peter Parker',
			hometown: 'New York',
			age: 21
		}
	];

	constructor() {
		this.initializeRoutes();
	}

	public initializeRoutes() {
		this.router.get('/heroes', this.getHeroes);
		this.router.post('/hero', this.createHero);
	}

	public getHeroes = (request: express.Request, response: express.Response) => {
		response.send(this.heroes);
	};

	public createHero = (request: express.Request, response: express.Response) => {
		const hero: Hero = request.body;
		this.heroes.push(hero);
		response.send(hero);
	};
}

export default HeroController;
