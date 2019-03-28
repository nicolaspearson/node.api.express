import Boom from 'boom';
import * as express from 'express';
import { getRepository } from 'typeorm';

import CreateHeroDto from '@dto/hero.create.dto';
import UpdateHeroDto from '@dto/hero.update.dto';
import Hero from '@entities/hero.entity';
import Controller from '@interfaces/controller.interface';
import authMiddleware from '@middleware/auth.middleware';
import validationMiddleware from '@middleware/validation.middleware';

export default class HeroController implements Controller {
	public path: string = '/hero';
	public router = express.Router();
	private heroRepository = getRepository(Hero);

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
		const heroes = await this.heroRepository.find();
		response.send(heroes);
	};

	private getHeroById = async (
		request: express.Request,
		response: express.Response,
		next: express.NextFunction
	) => {
		const id = request.params.id;
		const hero = await this.heroRepository.findOne(id);
		if (hero) {
			response.send(hero);
		} else {
			next(Boom.notFound(`Hero with id ${id} not found!`));
		}
	};

	public createHero = async (request: express.Request, response: express.Response) => {
		const heroData: CreateHeroDto = request.body;
		const newHero = this.heroRepository.create(heroData);
		await this.heroRepository.save(newHero);
		response.send(newHero);
	};

	private updateHero = async (
		request: express.Request,
		response: express.Response,
		next: express.NextFunction
	) => {
		const id = request.params.id;
		const heroData: UpdateHeroDto = request.body;
		await this.heroRepository.update(id, heroData);
		const updatedHero = await this.heroRepository.findOne(id);
		if (updatedHero) {
			response.send(updatedHero);
		} else {
			next(Boom.notFound(`Hero with id ${id} not found!`));
		}
	};

	private deleteHero = async (
		request: express.Request,
		response: express.Response,
		next: express.NextFunction
	) => {
		const id = request.params.id;
		const deleteResponse = await this.heroRepository.delete(id);
		if (deleteResponse.raw[1]) {
			response.sendStatus(200);
		} else {
			next(Boom.notFound(`Hero with id ${id} not found!`));
		}
	};
}
