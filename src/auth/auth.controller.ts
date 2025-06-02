import { Body, Controller, Get, HttpCode, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto, SignInUserDto } from "../users/dto";
import { Request, Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signUp(createUserDto, res);
  }

  @HttpCode(200)
  @Post("signin")
  async signin(
    @Body() signInUserDto: SignInUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signIn(signInUserDto, res);
  }

  @Get("signout")
  async signout(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request
  ) {
    return this.authService.signOut(res, req);
  }

  @Post("refresh-token")
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request
  ) {
    return this.authService.refreshToken(req, res);
  }
}
