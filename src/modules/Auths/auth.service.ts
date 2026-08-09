import {
    UserRepository
} from "./repository/user.auth.repository";

import {
    RefreshTokenRepository
} from "./repository/refresh-token.auth.repository";

import {
    hashPassword,
    comparePassword
} from "../../common/utils/password";

import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from "../../common/utils/jwt";

import { AppError } from "../../common/errors/AppError";

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

            throw new AppError(
                "Email already exists",
                409
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

            throw new AppError(
                "Invalid credentials",
                401
            );

        }


        const isPasswordValid =
            await comparePassword(
                data.password,
                user.password
            );


        if (!isPasswordValid) {

            throw new AppError(
                "Invalid credentials",
                401
            );

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

                Date.now() +
                7 * 24 * 60 * 60 * 1000

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

        const payload =
            verifyRefreshToken(
                data.refreshToken
            );


        const refreshToken =
            await this.refreshTokenRepository
                .findByToken(
                    data.refreshToken
                );


        if (!refreshToken) {

            throw new AppError(
                "Refresh token not found",
                401
            );

        }


        if (refreshToken.isRevoked) {

            throw new AppError(
                "Refresh token has been revoked",
                401
            );

        }


        if (
            refreshToken.expiresAt <
            new Date()
        ) {

            throw new AppError(
                "Refresh token has expired",
                401
            );

        }


        const user =
            await this.userRepository.findById(
                payload.userId
            );


        if (!user) {

            throw new AppError(
                "User not found",
                404
            );

        }


        const accessToken =
            generateAccessToken({

                userId: user.id

            });


        return {

            accessToken

        };

    }


    async logout(
        data: LogOutDto
    ) {

        const refreshToken =
            await this.refreshTokenRepository
                .findByToken(
                    data.refreshToken
                );


        if (!refreshToken) {

            throw new AppError(
                "Refresh token not found",
                401
            );

        }


        if (refreshToken.isRevoked) {

            throw new AppError(
                "Refresh token has already been revoked",
                401
            );

        }


        if (
            refreshToken.expiresAt <
            new Date()
        ) {

            throw new AppError(
                "Refresh token has expired",
                401
            );

        }


        await this.refreshTokenRepository.revoke(
            refreshToken.id
        );


        return {

            message: "Logout successfully"

        };

    }

}
