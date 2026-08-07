import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {

    private authService =
        new AuthService();


    register = async (
        req: Request,
        res: Response
    ) => {

        try {

            const result =
                await this.authService.register(
                    req.body
                );


            return res.status(201).json({

                success: true,

                data: result

            });


        } catch (error) {

            return res.status(400).json({

                success: false,

                message: (error as Error).message

            });

        }

    };



    login = async (
        req: Request,
        res: Response
    ) => {

        try {

            const result =
                await this.authService.login(
                    req.body
                );


            return res.json({

                success: true,

                data: result

            });


        } catch (error) {

            return res.status(401).json({

                success: false,

                message: (error as Error).message

            });

        }

    };



    refreshToken = async (
        req: Request,
        res: Response
    ) => {

        try {

            const result =
                await this.authService.refreshtoken(
                    req.body
                );


            return res.json({

                success: true,

                data: result

            });


        } catch (error) {

            return res.status(401).json({

                success: false,

                message: (error as Error).message

            });

        }

    };



    logout = async (
        req: Request,
        res: Response
    ) => {

        try {

            const result =
                await this.authService.logout(
                    req.body
                );


            return res.json({

                success: true,

                data: result

            });


        } catch (error) {

            return res.status(400).json({

                success: false,

                message: (error as Error).message

            });

        }

    };

}