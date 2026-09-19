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
import { RabbitMQService } from "../../common/rabbitmq/rabbitmq.service";
import { redisClient } from "../../common/redis/redis";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { MailTemplate } from "../../common/templates/mail.template";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";


export class AuthService {

    private userRepository =
        new UserRepository();

    private refreshTokenRepository =
        new RefreshTokenRepository();

    generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async resetPassword(
        data: ResetPasswordDto
    ) {

        const user =
            await this.userRepository.findByEmail(
                data.email
            );

        if (!user) {

            throw new AppError(
                "User not found",
                404
            );

        }

        const redisOtp =
            await redisClient.get(
                `forgot-password:${data.email}`
            );

        if (!redisOtp) {

            throw new AppError(
                "OTP has expired",
                400
            );

        }

        if (redisOtp !== data.otp) {

            throw new AppError(
                "OTP is incorrect",
                400
            );

        }

        const hashedPassword =
            await hashPassword(
                data.newPassword
            );

        await this.userRepository.updatePassword(
            user.id,
            hashedPassword
        );

        await redisClient.del(
            `forgot-password:${data.email}`
        );

        return {
            message: "Password reset successfully"
        };

    }

    async forgotPassword(
        data: ForgotPasswordDto
    ) {

        const user =
            await this.userRepository.findByEmail(
                data.email
            );

        if (!user) {

            throw new AppError(
                "User not found",
                404
            );

        }

        const otp =
            this.generateOTP();

        await redisClient.set(

            `forgot-password:${data.email}`,

            otp,

            {
                EX: 60 * 5
            }

        );

        await RabbitMQService.publish(

            "send-email",

            {

                to: data.email,

                subject: "Forgot Password",

                html: MailTemplate.forgotPassword(

                    user.fullName,

                    otp

                )

            }

        );

        return {

            message:
                "OTP has been sent successfully"

        };

    }

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
