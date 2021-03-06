import { IsNumber, IsString, Length } from 'class-validator';

export default class CreateHeroDto {
	@IsString()
	@Length(1, 500)
	public name: string;

	@IsString()
	@Length(1, 500)
	public identity: string;

	@IsString()
	@Length(1, 500)
	public hometown: string;

	@IsNumber()
	public age: number;
}
