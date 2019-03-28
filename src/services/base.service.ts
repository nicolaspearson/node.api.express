import Boom from 'boom';
import { validate, ValidationError } from 'class-validator';
import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';

import BaseRepository from '@repositories/base.repository';

export default abstract class BaseService<T extends DeepPartial<T>> {
	constructor(private repository: BaseRepository<T>) {
		// Empty constructor
	}

	public preSaveHook(entity: T): void {
		// Executed before the save repository call
	}

	public preUpdateHook(entity: T): void {
		// Executed before the update repository call
	}

	public preDeleteHook(entity: T): void {
		// Executed before the delete repository call
	}

	public validId(id: number): boolean {
		return id !== undefined && id > 0;
	}

	public async isValid(entity: T): Promise<boolean> {
		try {
			const errors: ValidationError[] = await validate(entity, {
				validationError: { target: false, value: false }
			});
			if (errors.length > 0) {
				throw Boom.badRequest('Validation failed on the provided request', errors);
			}
			return true;
		} catch (error) {
			if (Boom.isBoom(error)) {
				throw Boom.boomify(error);
			}
			throw Boom.badRequest('Unable to validate request: ' + error);
		}
	}

	public async findAll(): Promise<T[]> {
		try {
			return await this.repository.getAll();
		} catch (error) {
			if (Boom.isBoom(error)) {
				throw Boom.boomify(error);
			}
			throw Boom.internal(error);
		}
	}

	public async findAllByFilter(filter: FindManyOptions<T>): Promise<T[]> {
		try {
			return await this.repository.findManyByFilter(filter);
		} catch (error) {
			if (Boom.isBoom(error)) {
				throw Boom.boomify(error);
			}
			throw Boom.internal(error);
		}
	}

	public async findOneById(id: number): Promise<T> {
		try {
			if (!this.validId(id) || isNaN(id)) {
				throw Boom.badRequest('Incorrect / invalid parameters supplied');
			}
			return await this.repository.findOneById(id);
		} catch (error) {
			if (Boom.isBoom(error)) {
				throw Boom.boomify(error);
			}
			throw Boom.internal(error);
		}
	}

	public async findOneByFilter(filter: FindOneOptions<T>): Promise<T> {
		try {
			return await this.repository.findOneByFilter(filter);
		} catch (error) {
			if (Boom.isBoom(error)) {
				throw Boom.boomify(error);
			}
			throw Boom.internal(error);
		}
	}

	public async save(entity: T): Promise<T> {
		try {
			// Check if the entity is valid
			const entityIsValid = await this.isValid(entity);
			if (!entityIsValid) {
				throw Boom.badRequest('Incorrect / invalid parameters supplied');
			}
			// Execute the hook
			this.preSaveHook(entity);
			// Save the entity to the database
			return await this.repository.save(entity);
		} catch (error) {
			if (Boom.isBoom(error)) {
				throw Boom.boomify(error);
			}
			throw Boom.internal(error);
		}
	}

	public async saveAll(entities: T[]): Promise<T[]> {
		try {
			for (const entity of entities) {
				// Check if the entity is valid
				const entityIsValid = await this.isValid(entity);
				if (!entityIsValid) {
					throw Boom.badRequest('Incorrect / invalid parameters supplied');
				}
				// Execute the hook
				this.preSaveHook(entity);
			}
			// Save the entity to the database
			return await this.repository.saveAll(entities);
		} catch (error) {
			if (Boom.isBoom(error)) {
				throw Boom.boomify(error);
			}
			throw Boom.internal(error);
		}
	}

	public async update(entity: T, id: number): Promise<T> {
		try {
			// Check if the entity is valid
			const entityIsValid = await this.isValid(entity);
			if (!entityIsValid || !this.validId(id)) {
				throw Boom.badRequest('Incorrect / invalid parameters supplied');
			}
			// Execute the hook
			this.preUpdateHook(entity);
			// Update the entity on the database
			return await this.repository.updateOneById(id, entity);
		} catch (error) {
			if (Boom.isBoom(error)) {
				throw Boom.boomify(error);
			}
			throw Boom.internal(error);
		}
	}

	public async delete(id: number): Promise<T> {
		try {
			if (!this.validId(id)) {
				throw Boom.badRequest('Incorrect / invalid parameters supplied');
			}
			const entityResult: T = await this.repository.findOneById(id);
			// Execute the hook
			this.preDeleteHook(entityResult);
			// Delete the record
			await this.repository.delete(entityResult);
			return entityResult;
		} catch (error) {
			if (Boom.isBoom(error)) {
				throw Boom.boomify(error);
			}
			throw Boom.internal(error);
		}
	}

	public async softDelete(id: number): Promise<T> {
		try {
			if (!this.validId(id)) {
				throw Boom.badRequest('Incorrect / invalid parameters supplied');
			}
			const entityResult: T = await this.repository.findOneById(id);
			// Execute the hook
			this.preDeleteHook(entityResult);
			// Save the record
			await this.repository.save(entityResult);
			return entityResult;
		} catch (error) {
			if (Boom.isBoom(error)) {
				throw Boom.boomify(error);
			}
			throw Boom.internal(error);
		}
	}
}
