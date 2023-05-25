import { Books } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {
    cloudinary.config({
      cloud_name: 'dyb6dkjju',
      api_key: '186674635772982',
      api_secret: 'SkRgV-Bn0zpn443WIUZpQrj_900',
    });
  }

  /**
   * Asynchronously creates a book using the provided CreateBookDto object.
   *
   * @param   {CreateBookDto} createBookDto   - The object containing data for the book to be created.
   * @return  {Promise<Books>}                - A Promise that resolves to the newly created book object.
   */
  async create(id: string, createBookDto: CreateBookDto): Promise<Books> {
    console.log(id);
    const book = await this.prisma.books.create({
      data: {
        ...createBookDto,
        userId: id,
      },
    });
    delete book.userId;
    return book;
  }

  /**
   * Asynchronously finds all books.
   *
   * @return  {Promise<Books[]>}              - Array of books found.
   * @throws  {NotFoundException}             - If no books are found.
   */
  async findAll(): Promise<Books[]> {
    const books = await this.prisma.books.findMany({
      include: {
        user: true,
      },
    });
    if (books.length === 0) throw new NotFoundException('Books not found');
    books.map((book) => {
      delete book.user.password;
      delete book.userId;
    });
    return books;
  }

  /**
   * Finds a book in the database by its ID.
   *
   * @param   {string} id                     - The ID of the book to find.
   * @return  {Book}                          - The book with the specified ID.
   * @throws  {NotFoundException}             - If the book with the specified ID is not found.
   */
  async findOne(id: string): Promise<Books> {
    const book = await this.prisma.books.findUnique({
      where: {
        id,
      },
    });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  /**
   * Updates a book with the given id using the provided data.
   *
   * @param   {string} id                     - The id of the book to be updated.
   * @param   {UpdateBookDto} updateBookDto   - The data to update the book with.
   * @throws  {NotFoundException}             - If no book exists with the given id.
   * @return  {Promise<string>}               - A success message with the updated book's id.
   */
  async update(id: string, updateBookDto: UpdateBookDto): Promise<string> {
    const isExist = this.prisma.books.findUnique({
      where: {
        id,
      },
    });
    if (!isExist) throw new NotFoundException('Book not found');
    await this.prisma.books.update({
      where: {
        id,
      },
      data: {
        ...updateBookDto,
      },
    });
    return `updated #${id} book successfully`;
  }

  /**
   * Remove a book by ID from the database.
   *
   * @param   {string} id                     - The ID of the book to remove.
   * @throws  {NotFoundException}             - If the book with the given ID is not found.
   * @return  {Promise<string>}               - A message indicating the book was deleted successfully.
   */
  async remove(id: string): Promise<string> {
    const isExist = this.prisma.books.findUnique({
      where: {
        id,
      },
    });
    if (!isExist) throw new NotFoundException('Book not found');
    await this.prisma.books.delete({
      where: {
        id,
      },
    });
    return `deleted #${id} book successfully`;
  }
  /**
   * Uploads a file to Cloudinary.
   *
   * @param   {Express.Multer.File} file                            - The file to upload.
   * @return  {Promise<UploadApiResponse | UploadApiErrorResponse>} - A promise that resolves with the upload response or rejects with an error.
   */
  async uploadFileTocloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }
}
