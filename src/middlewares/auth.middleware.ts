import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    verifyAccessToken
} from "../common/utils/jwt";

import {
    AppError
} from "../common/errors/AppError";


export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const authorization =
        req.headers.authorization;


    if (!authorization) {

        return next(
            new AppError(
                "Authorization header is required",
                401
            )
        );

    }


    const [
        type,
        token
    ] = authorization.split(" ");


    if (
        type !== "Bearer" ||
        !token
    ) {

        return next(
            new AppError(
                "Invalid authorization header",
                401
            )
        );

    }


    try {

        const payload =
            verifyAccessToken(token);


        req.user = {

            id: payload.userId

        };


        next();

    } catch (error) {

        next(error);

    }

};
