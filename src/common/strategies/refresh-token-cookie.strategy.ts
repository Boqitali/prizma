import { ForbiddenException, Injectable } from "@nestjs/common";
import { Request } from "express";
import { JwtFromRequestFunction, Strategy } from "passport-jwt";
import { JwtPayload, JwtPayloadWithRefreshToken } from "../types";
import { PassportStrategy } from "@nestjs/passport";

export const cookieExtractor: JwtFromRequestFunction = (req: Request) => {
    console.log(req.cookies)
    if(req && req.cookies){
        return req.cookies["refreshToken"]
    }
    return null
}

@Injectable()
export class RefreshTokenCookieStrategy extends PassportStrategy(
  Strategy,
  "refresh-jwt"
) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.REFRESH_TOKEN_KEY!,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        throw new ForbiddenException("Refresh token noto'g'ri")
    }
    return {...payload, refreshToken}
  }
}
