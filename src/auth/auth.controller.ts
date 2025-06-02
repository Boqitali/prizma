import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto, SignInUserDto } from "../users/dto";
import { Request, Response } from "express";
import { ResponseFields } from "../common/types";
import { GetCurrentUser, GetCurrentUserId } from "../common/decorators";
import { RefreshTokenGuard } from "../common/guards";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseFields> {
    return this.authService.signUp(createUserDto, res);
  }

  @HttpCode(200)
  @Post("signin")
  async signin(
    @Body() signInUserDto: SignInUserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseFields> {
    return this.authService.signIn(signInUserDto, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Get("signout")
  async signout(
    @GetCurrentUserId() userId: number,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signOut(res, +userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Post("refresh-token")
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser("refreshToken") refreshToken: string,
    @Res({passthrough: true}) res: Response
  ) {
    return this.authService.refreshToken(+userId, refreshToken, res)
  }
}
