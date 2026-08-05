import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) // default POST status is 201; login returning 201 reads oddly
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
