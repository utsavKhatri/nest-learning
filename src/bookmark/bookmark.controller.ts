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
  /**
   * Retrieves bookmarks for a given user ID.
   *
   * @param {string} id - the user ID to retrieve bookmarks for
   * @return {any} - the bookmarks for the given user ID
   */
  getBookmarks(@getUser('id') id: string) {
    return this.bookmarkService.getBookmarks(id);
  }

  @Get(':id')
  /**
   * Retrieves a bookmark by its ID for the user with the given ID.
   *
   * @param {string} id - The ID of the user whose bookmark is being retrieved.
   * @param {string} bookmarkId - The ID of the bookmark being retrieved.
   * @return {any} The bookmark object with the specified ID.
   */
  getBookmarkById(@getUser('id') id: string, @Param('id') bookmarkId: string) {
    return this.bookmarkService.getBookmarkById(id, bookmarkId);
  }

  @Patch(':id')
  /**
   * Edits a bookmark using the provided data.
   *
   * @param {string} id - The ID of the user making the request.
   * @param {string} bookmarkId - The ID of the bookmark to be edited.
   * @param {EditBookmarkDto} dto - The data to be used for editing the bookmark.
   * @return {any} The edited bookmark.
   */
  editBookmark(
    @getUser('id') id: string,
    @Param('id') bookmarkId: string,
    @Body() dto: EditBookmarkDto,
  ) {
    return this.bookmarkService.editBookmark(id, bookmarkId, dto);
  }

  @Delete(':id')
  /**
   * Deletes a bookmark with the specified bookmarkId belonging to the user with the specified id.
   *
   * @param {string} id - The id of the user that owns the bookmark.
   * @param {string} bookmarkId - The id of the bookmark to be deleted.
   * @return {any} - The result of the delete operation.
   */
  deleteBookmark(@getUser('id') id: string, @Param('id') bookmarkId: string) {
    return this.bookmarkService.deleteBookmark(id, bookmarkId);
  }

  @Post()
  /**
   * Creates a new bookmark for a user.
   *
   * @param {string} userId - the id of the user creating the bookmark
   * @param {CreateBookmarkDto} dto - the data transfer object containing the bookmark information
   * @return {any} the newly created bookmark
   */
  createBookmark(
    @getUser('id') userId: string,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(userId, dto);
  }
}
