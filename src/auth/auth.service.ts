import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto, SignInUserDto } from "../users/dto";
import * as bcrypt from "bcrypt";
import { User } from "../../generated/prisma";
import { Request, Response } from "express";
import { JwtPayload, ResponseFields, Tokens } from "../common/types";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  async signUp(createUserDto: CreateUserDto, res: Response) {
    const { password, confirm_password, name, email } = createUserDto;
    const condidate = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (condidate) {
      throw new ConflictException("Bunday email mavjud");
    }

    if (password !== confirm_password) {
      throw new BadRequestException("Parollar mos emas");
    }
    const hashed_password = await bcrypt.hash(password, 7);
    const user = await this.prismaService.user.create({
      data: { name, email, hashed_password },
    });

    const tokens = await this.generateToken(user);

    const hashed_refresh_token = await bcrypt.hash(tokens.refreshToken, 7);
    await this.updateRefreshToken(user.id, hashed_refresh_token);

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });
    return {
      message: "New user signed up",
      id: user.id,
      accessToken: tokens.accessToken,
    };
  }

  async signIn(signInUserDto: SignInUserDto, res: Response) {
    const { password, email } = signInUserDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException("Parol yoki email noto'g'ri");
    }

    const passwordMatched = await bcrypt.compare(
      password,
      user.hashed_password
    );
    if (!passwordMatched) {
      throw new BadRequestException("Parol yoki email noto'g'ri");
    }

    const tokens = await this.generateToken(user);

    const hashed_refresh_token = await bcrypt.hash(tokens.refreshToken, 7);
    await this.updateRefreshToken(user.id, hashed_refresh_token);

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });
    return {
      message: "User signed in",
      id: user.id,
      accessToken: tokens.accessToken,
    };
  }

  async signOut(res: Response, userId: number) {
    const user = this.prismaService.user.updateMany({
      where: {
        id: userId,
        hashed_refresh_token: {
          not: null,
        },
      },
      data: {
        hashed_refresh_token: null,
      },
    });

    if (!user) throw new ForbiddenException("Access Denied");
    res.clearCookie("refreshToken");
    return true;
  }

  async refreshToken(
    userId: number,
    refreshToken: string,
    res: Response
  ): Promise<ResponseFields> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.hashed_refresh_token) {
      throw new BadRequestException("access denied1");
    }
    const rtMatches = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token
    );
    if (!rtMatches) throw new ForbiddenException("access denied2");

    const tokens: Tokens = await this.generateToken(user);

    const hashed_refresh_token = await bcrypt.hash(tokens.refreshToken, 7);
    await this.updateRefreshToken(user.id, hashed_refresh_token);

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: +process.env.COOKIE_TIME!,
      httpOnly: true,
    });
    return {
      message: "new refresh token",
      id: user.id,
      accessToken: tokens.accessToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        hashed_refresh_token: refreshToken,
      },
    });
  }

  async generateToken(user: User): Promise<Tokens> {
    const payload: JwtPayload = {
      id: user.id,
      is_active: user.is_active,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    });

    return { accessToken, refreshToken };
  }
}
