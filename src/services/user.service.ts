import User from '@entities/user.entity';
import UserRepository from '@repositories/user.repository';
import BaseService from '@services/base.service';

export default class UserService extends BaseService<User> {
	constructor(userRepository: UserRepository) {
		super(userRepository);
	}

	public preSaveHook(user: User): void {
		// Executed before the save repository call
		delete user.id;
	}

	public preUpdateHook(user: User) {
		// Executed before the update repository call
		delete user.updatedAt;
	}

	public preDeleteHook(user: User) {
		// Executed before the delete repository call
		user.deletedAt = new Date();
	}
}
