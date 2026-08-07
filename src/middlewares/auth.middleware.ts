import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    verifyAccessToken
} from "../common/utils/jwt";

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const authorization =
        req.headers.authorization;


    if (!authorization) {

        return res.status(401).json({

            success: false,

            message: "Authorization header is required"

        });

    }

    const [
        type,
        token
    ] = authorization.split(" ");

    if (
        type !== "Bearer" ||
        !token
    ) {

        return res.status(401).json({

            success: false,

            message: "Invalid authorization header"

        });

    }

    try {

        const payload =
            verifyAccessToken(token);

        req.user = {

            id: payload.userId,

        };

        next();

    } catch (error) {

        next(error);

    }

};