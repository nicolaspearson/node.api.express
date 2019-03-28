import Hero from '@entities/hero.entity';
import BaseRepository from '@repositories/base.repository';

export default class HeroRepository extends BaseRepository<Hero> {
	constructor() {
		super(Hero.name);
	}
}
