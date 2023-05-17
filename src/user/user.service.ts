import { EditUserDto } from './dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  /**
   * Edits a user by updating the user's data with the provided DTO.
   *
   * @param {string} id - The ID of the user to be edited.
   * @param {EditUserDto} dto - The DTO containing the data to update the user with.
   * @return {Promise<Object>} The updated user object with the password removed.
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
}
