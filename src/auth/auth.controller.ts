import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: AuthDto) {
    return this.authService.signup(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() body: AuthDto) {
    return this.authService.signin(body);
  }
}
