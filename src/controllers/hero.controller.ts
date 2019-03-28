import Boom from 'boom';
import * as express from 'express';

import CreateHeroDto from '@dto/hero.create.dto';
import UpdateHeroDto from '@dto/hero.update.dto';

import Controller from '@interfaces/controller.interface';
import authMiddleware from '@middleware/auth.middleware';
import validationMiddleware from '@middleware/validation.middleware';
import HeroRepository from '@repositories/hero.repository';
import HeroService from '@services/hero.service';

export default class HeroController implements Controller {
	public path: string = '/hero';
	public router = express.Router();
	private heroService = new HeroService(new HeroRepository());

	constructor() {
		this.initializeRoutes();
	}

	public initializeRoutes() {
		this.router.get('/heroes', this.getHeroes);
		this.router.get(`${this.path}/:id`, this.getHeroById);

		this.router
			.all(`${this.path}/*`, authMiddleware)
			.put(`${this.path}/:id`, validationMiddleware(UpdateHeroDto, true), this.updateHero)
			.delete(`${this.path}/:id`, this.deleteHero)
			.post(this.path, authMiddleware, validationMiddleware(CreateHeroDto), this.createHero);
	}

	public getHeroes = async (request: express.Request, response: express.Response) => {
		const heroes = await this.heroService.findAll();
		response.send(heroes);
	};

	private getHeroById = async (
		request: express.Request,
		response: express.Response,
		next: express.NextFunction
	) => {
		const id = request.params.id;
		const hero = await this.heroService.findOneById(id);
		response.send(hero);
	};

	public createHero = async (request: express.Request, response: express.Response) => {
		const heroData: CreateHeroDto = request.body;
		const newHero = this.heroService.save(heroData);
		response.send(newHero);
	};

	private updateHero = async (
		request: express.Request,
		response: express.Response,
		next: express.NextFunction
	) => {
		const id = request.params.id;
		const heroData: UpdateHeroDto = request.body;
		const updatedHero = await this.heroService.update(id, heroData);
		response.send(updatedHero);
	};

	private deleteHero = async (
		request: express.Request,
		response: express.Response,
		next: express.NextFunction
	) => {
		const id = request.params.id;
		const deleteResponse = await this.heroService.delete(id);
		if (deleteResponse.affected && deleteResponse.affected > 0) {
			response.send({ statusCode: 200, message: 'Deleted!' });
		} else {
			next(Boom.notFound(`Hero with id ${id} not found!`));
		}
	};
}
