import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { Request } from 'express';
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('memepost'))
  create(
    @Body() createGalleryDto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.galleryService.create(createGalleryDto, file);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.galleryService.findAll(req);
  }

  @Post('search')
  @UseInterceptors(FileInterceptor('file'))
  search(@UploadedFile() file: Express.Multer.File) {
    return this.galleryService.search(file);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.galleryService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.galleryService.remove(+id);
  }
}
