import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  /**
   * Signs up a user with the given authentication data.
   *
   * @param {AuthDto} body - The authentication data of the user to sign up.
   * @return {any} The result of the signup operation.
   */
  signup(@Body() body: AuthDto) {
    return this.authService.signup(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  /**
   * Sign in the user with the provided authentication data.
   *
   * @param {AuthDto} body - the authentication data.
   * @return {any} the result of the sign in operation.
   */
  signin(@Body() body: AuthDto) {
    return this.authService.signin(body);
  }
}
