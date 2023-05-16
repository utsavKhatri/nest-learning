import { EditBookmarkDto } from './dto/editBookmark.dto';
import { CreateBookmarkDto } from './dto/createBookmark.dto';
import { getUser } from '../auth/decorator';
import { BookmarkService } from './bookmark.service';
import { Jwtguard } from './../auth/guard/jwt.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

@UseGuards(Jwtguard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}
  @Get()
  getBookmarks(@getUser('id') id: string) {
    return this.bookmarkService.getBookmarks(id);
  }

  @Get(':id')
  getBookmarkById(@getUser('id') id: string, @Param('id') bookmarkId: string) {
    return this.bookmarkService.getBookmarkById(id, bookmarkId);
  }

  @Patch(':id')
  editBookmark(
    @getUser('id') id: string,
    @Param('id') bookmarkId: string,
    @Body() dto: EditBookmarkDto,
  ) {
    return this.bookmarkService.editBookmark(id, bookmarkId, dto);
  }

  @Delete(':id')
  deleteBookmark(@getUser('id') id: string, @Param('id') bookmarkId: string) {
    return this.bookmarkService.deleteBookmark(id, bookmarkId);
  }

  @Post()
  createBookmark(
    @getUser('id') userId: string,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(userId, dto);
  }
}
