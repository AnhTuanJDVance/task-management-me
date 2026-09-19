import {
    Request,
    Response,
    NextFunction
} from "express";

import { AuthService } from "./auth.service";


export class AuthController {

    private authService =
        new AuthService();


    register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const result =
                await this.authService.register(
                    req.body
                );

            return res.status(201).json({

                success: true,

                message: "User registered successfully",

                data: result

            });

        } catch (error) {

            next(error);

        }

    };


    login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const result =
                await this.authService.login(
                    req.body
                );

            return res.status(200).json({

                success: true,

                message: "Login successful",

                data: result

            });

        } catch (error) {

            next(error);

        }

    };


    refreshToken = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const result =
                await this.authService.refreshtoken(
                    req.body
                );

            return res.status(200).json({

                success: true,

                message: "Token refreshed successfully",

                data: result

            });

        } catch (error) {

            next(error);

        }

    };


    logout = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const result =
                await this.authService.logout(
                    req.body
                );

            return res.status(200).json({

                success: true,

                message: "Logout successful",

                data: result

            });

        } catch (error) {

            next(error);

        }

    };


    forgotPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const result =
                await this.authService
                    .forgotPassword(
                        req.body
                    );

            return res.status(200).json({

                success: true,

                message: "Password reset OTP sent successfully",

                data: result

            });

        } catch (err) {

            next(err);

        }

    };


    resetPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const result =
                await this.authService
                    .resetPassword(
                        req.body
                    );

            return res.status(200).json({

                success: true,

                message: "Password reset successfully",

                data: result

            });

        } catch (err) {

            next(err);

        }

    };

}