import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  /**
   * Asynchronously signs up a new user with the provided credentials.
   *
   * @param {AuthDto} body - An object containing the user's email and password.
   * @return {Promise<User>} A Promise that resolves to the newly created user.
   * @throws {BadRequestException} If the provided email is already in use.
   * @throws {InternalServerErrorException} If there was an error creating the user.
   */
  async signup(body: AuthDto): Promise<User> {
    try {
      const hashedPassword = await argon.hash(body.password);
      const user = await this.prisma.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
        },
      });
      delete user.password;
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email is already in use');
      }
      throw new InternalServerErrorException('Error creating user');
    }
  }

  /**
   * Asynchronously signs in a user given their AuthDto.
   *
   * @param {AuthDto} body - The DTO containing email and password.
   * @return {Promise<{token: string, user: object}>} The token and user object upon successful authentication.
   * @throws {BadRequestException} Email or password is incorrect or password is incorrect.
   */
  async signin(body: AuthDto): Promise<{ token: string; user: object }> {
    try {
      const isExits = await this.prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });
      if (!isExits) {
        throw new BadRequestException('Email or password is incorrect');
      }
      const passwordMatches = await argon.verify(
        isExits.password,
        body.password,
      );
      if (!passwordMatches) {
        throw new BadRequestException('password is incorrect');
      }
      const token = await this.signToken(isExits.id, isExits.email);
      delete isExits.password;
      return {
        token,
        user: isExits,
      };
    } catch (error) {
      return error.response;
    }
  }

  /**
   * Asynchronously signs a JSON Web Token (JWT) using the provided user ID and email.
   *
   * @param {string} userId - The ID of the user to be included in the JWT payload.
   * @param {string} email - The email of the user to be included in the JWT payload.
   * @return {Promise<string>} A Promise that resolves with a signed JWT string.
   */
  async signToken(userId: string, email: string): Promise<string> {
    const payload = {
      id: userId,
      email: email,
    };
    return this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
