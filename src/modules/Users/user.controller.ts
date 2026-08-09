import {
    Request,
    Response,
    NextFunction
} from "express";

import { UserService } from "./user.service";


export class UserController {

    private userService =
        new UserService();


    getProfile = async (
        req: Request,
        res: Response,
        next: NextFunction
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

            next(error);

        }

    };


    updateProfile = async (
        req: Request,
        res: Response,
        next: NextFunction
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

            next(error);

        }

    };

}
