import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { config } from 'process';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  async signup(body: AuthDto) {
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

  async signin(body: AuthDto) {
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
  async signToken(userId: string, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email: email,
    };
    return this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
