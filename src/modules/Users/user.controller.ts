import { Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController {
    private userService =
        new UserService();


    getProfile = async (
        req: Request,
        res: Response
    ) => {

        try {

            const result =
                await this.userService.getProfile(
                    req.user.id
                );

            return res.status(200).json({

                success: true,

                data: result

            });

        } catch (error) {

            return res.status(404).json({

                success: false,

                message: (error as Error).message

            });

        }

    };

    updateProfile = async (
        req: Request,
        res: Response
    ) => {

        try {

            const result =
                await this.userService.updateProfile(
                    req.user.id,
                    req.body
                );

            return res.status(200).json({

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