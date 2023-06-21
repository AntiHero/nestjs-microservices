import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @Length(6, 30)
  @IsString()
  public username: string;

  @IsEmail()
  @Length(1, 100)
  public email: string;

  @IsString()
  @Length(6, 20)
  public password: string;
}
