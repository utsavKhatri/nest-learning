import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Edits a user by updating the user's data with the provided DTO.
   *
   * @param   {string} id         - The ID of the user to be edited.
   * @param   {EditUserDto} dto   - The DTO containing the data to update the user with.
   * @return  {Promise<Object>}   - The updated user object with the password removed.
   */
  async editUser(id: string, dto: EditUserDto): Promise<object> {
    const user = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: dto,
    });
    delete user.password;
    return user;
  }

  /**
   * Retrieves all users with their books and bookmarks.
   *
   * @return  {Promise<object>}    - An object containing details of all users.
   * @throws  {NotFoundException}  - If no users are found.
   */
  async allUser(): Promise<object> {
    const users: User[] = await this.prisma.user.findMany({
      include: {
        Books: true,
        Bookmark: true,
      },
    });
    if (users.length === 0) throw new NotFoundException('No users found');
    return users;
  }
}
