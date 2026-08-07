import { UserRepository } from "./repository/user.auth.repository";
import { RefreshTokenRepository } from "./repository/refresh-token.auth.repository";
import { hashPassword, comparePassword } from "../../common/utils/password";
import { generateAccessToken, generateRefreshToken } from "../../common/utils/jwt";
import { verifyAccessToken, verifyRefreshToken } from "../../common/utils/jwt";

import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { refreshTokenDto } from "./dto/refresh-token.dto";
import { LogOutDto } from "./dto/log-out.dto";

export class AuthService {

  private userRepository =
    new UserRepository();
  private refreshTokenRepository =
    new RefreshTokenRepository();

  async register(
    data: RegisterDto
  ) {

    const existingUser =
      await this.userRepository.findByEmail(
        data.email
      );

    if (existingUser) {

      throw new Error(
        "Email already exists"
      );

    }

    const hashedPassword =
      await hashPassword(
        data.password
      );

    const user =
      await this.userRepository.create({

        ...data,

        password: hashedPassword

      });

    return user;

  }

  async login(
    data: LoginDto
  ) {

    const user =
      await this.userRepository.findByEmail(
        data.email
      );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid =
      await comparePassword(
        data.password,
        user.password
      );

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const accessToken =
      generateAccessToken({
        userId: user.id
      });

    const refreshToken =
      generateRefreshToken({
        userId: user.id
      });

    await this.refreshTokenRepository.create({

      token: refreshToken,

      user: user,

      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 ngày
      ),

      isRevoked: false

    });

    return {

      accessToken,
      refreshToken

    };

  }

  async refreshtoken(
    data: refreshTokenDto
  ) {

    const payload = verifyRefreshToken(data.refreshToken);

    const refreshToken = await this.refreshTokenRepository.findByToken(data.refreshToken);

    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }
    if (refreshToken.isRevoked) {
      throw new Error("Refresh token has been revoked");
    }
    if (refreshToken.expiresAt < new Date()) {
      throw new Error("Refresh token has expired");
    }
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new Error("User not found");
    }
    const accessToken = generateAccessToken({ userId: user.id });
    return { accessToken };
  }

  async logout(
    data: LogOutDto
  ) {
    const refreshToken = await this.refreshTokenRepository.findByToken(data.refreshToken);
    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }
    if (refreshToken.isRevoked) {
      throw new Error("");
    }
    if (refreshToken.expiresAt < new Date()) {
      throw new Error("");
    }
    await this.refreshTokenRepository.revoke(refreshToken.id);
    return {
      messenger: "Logout successfully"
    };
  }

}