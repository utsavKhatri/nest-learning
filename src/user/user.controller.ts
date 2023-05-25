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
import { Jwtguard, AdminJwt } from './../auth/guard/jwt.guard';

@UseGuards(Jwtguard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async getMe(@getUser() user: User) {
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Patch('me')
  editUser(@getUser('id') id: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(id, dto);
  }

  @UseGuards(AdminJwt)
  @HttpCode(HttpStatus.OK)
  @Get()
  allUser() {
    return this.userService.allUser();
  }
}
