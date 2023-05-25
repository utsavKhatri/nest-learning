import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBookDto extends PartialType(CreateBookDto) {
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
  isbn: number;

  @IsOptional()
  @IsString()
  coverImage?: string;
}
