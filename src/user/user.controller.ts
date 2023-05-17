import { UserService } from './user.service';
import { EditUserDto } from './dto';
import { getUser } from '../auth/decorator';
import { User } from '@prisma/client';
import {
  UseGuards,
  Controller,
  Get,
  Patch,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { Jwtguard } from './../auth/guard/jwt.guard';

@UseGuards(Jwtguard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @HttpCode(HttpStatus.OK)
  @Get('me')
  /**
   * Returns the user object of the authenticated user.
   *
   * @param {@getUser()} user - the authenticated user object
   * @return {Promise<User>} - a Promise that resolves to the authenticated user object
   */
  async getMe(@getUser() user: User) {
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Patch('me')
  /**
   * Edits a user.
   *
   * @param {string} id - the id of the user to edit
   * @param {EditUserDto} dto - the data transfer object containing the updated user information
   * @return {any} - the result of the edit operation
   */
  editUser(@getUser('id') id: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(id, dto);
  }
}
