import { PrismaService } from '../../prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AdminJwt extends PassportStrategy(Strategy, 'adminJwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async validate(payload: { id: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });
    if (!user) throw new ForbiddenException('logged in user does not exits');

    if (user.isAdmin === false) throw new UnauthorizedException('Unauthorized');
    delete user.password;
    return user;
  }
}
