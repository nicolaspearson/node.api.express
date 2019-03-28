import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'hero' })
export default class Hero {
	@PrimaryGeneratedColumn()
	public id?: number;

	@Column({ name: 'name', length: 500 })
	public name: string;

	@Column({ name: 'identity', length: 500 })
	public identity: string;

	@Column({ name: 'hometown', length: 500 })
	public hometown: string;

	@Column({ name: 'age' })
	public age: number;
}
