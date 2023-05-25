import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditBookmarkDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  bookId?: string;
}
