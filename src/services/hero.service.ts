import Hero from '@entities/hero.entity';
import HeroRepository from '@repositories/hero.repository';
import BaseService from '@services/base.service';

export default class HeroService extends BaseService<Hero> {
	constructor(heroRepository: HeroRepository) {
		super(heroRepository);
	}

	public preSaveHook(hero: Hero): void {
		// Executed before the save repository call
		delete hero.id;
	}

	public preUpdateHook(hero: Hero) {
		// Executed before the update repository call
		delete hero.updatedAt;
	}

	public preDeleteHook(hero: Hero) {
		// Executed before the delete repository call
		hero.deletedAt = new Date();
	}
}
