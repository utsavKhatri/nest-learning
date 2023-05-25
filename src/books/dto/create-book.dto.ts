import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  isbn: number;

  @IsOptional()
  @IsString()
  coverImage?: string;
}
