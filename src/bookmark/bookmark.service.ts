import { EditBookmarkDto, CreateBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Bookmark } from '@prisma/client';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  /**
   * Retrieves all bookmarks associated with the given user ID.
   *
   * @param {string} id - The ID of the user whose bookmarks to retrieve.
   * @return {Promise<Bookmark[]>} - A promise that resolves with an array of Bookmark objects.
   */
  getBookmarks(id: string): Promise<Bookmark[]> {
    return this.prisma.bookmark.findMany({
      where: {
        userId: id,
      },
    });
  }

  /**
   * Retrieves a bookmark by its ID for a specific user.
   *
   * @param {string} id - The ID of the user.
   * @param {string} bookmarkId - The ID of the bookmark to retrieve.
   * @return {Promise<Bookmark>} The bookmark with the given ID.
   * @throws {NotFoundException} If the bookmark with the given ID cannot be found.
   */
  async getBookmarkById(id: string, bookmarkId: string): Promise<Bookmark> {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId: id,
      },
    });
    if (!bookmark) throw new NotFoundException('Bookmark not found');
    return bookmark;
  }

  /**
   * Edits a bookmark given its id, and the user id.
   *
   * @param {string} id - The id of the user.
   * @param {string} bookmarkId - The id of the bookmark to be edited.
   * @param {EditBookmarkDto} dto - The data transfer object containing the new bookmark data.
   * @return {Promise<Bookmark>} The updated bookmark.
   * @throws {ForbiddenException} If the user does not own the bookmark.
   */
  async editBookmark(
    id: string,
    bookmarkId: string,
    dto: EditBookmarkDto,
  ): Promise<Bookmark> {
    console.log(dto);

    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== id)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  /**
   * Deletes a bookmark identified by its ID if the authenticated user owns it.
   *
   * @param {string} id - the ID of the authenticated user
   * @param {string} bookmarkId - the ID of the bookmark to delete
   * @throws {ForbiddenException} if the bookmark does not exist or if the user does not own it
   * @returns {string} - a message indicating the bookmark has been deleted
   */
  async deleteBookmark(id: string, bookmarkId: string): Promise<string> {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== id)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
    return 'bookmark deleted';
  }

  /**
   * Creates a new bookmark for a given user with the provided data.
   *
   * @param {string} userId - The ID of the user for whom the bookmark is being created.
   * @param {CreateBookmarkDto} dto - The bookmark data to be created.
   * @return {Promise<Bookmark>} A promise that resolves to the created bookmark.
   */
  async createBookmark(
    userId: string,
    dto: CreateBookmarkDto,
  ): Promise<Bookmark> {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
    return bookmark;
  }
}
