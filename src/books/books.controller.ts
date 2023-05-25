import { Jwtguard } from './../auth/guard/jwt.guard';
import { getUser } from './../auth/decorator/getUser.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(Jwtguard)
@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Post()
  @UseInterceptors(FileInterceptor('coverImage'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBookDto: CreateBookDto,
    @getUser('id') id: string,
  ) {
    const getResult = await this.booksService.uploadFileTocloudinary(file);
    createBookDto.coverImage = getResult.secure_url;
    return this.booksService.create(id, createBookDto);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
