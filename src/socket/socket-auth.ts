import { Socket } from "socket.io";
import { verifyAccessToken } from "../common/utils/jwt";


export const authenticateSocket = (

    socket: Socket,

    next: (err?: Error) => void

) => {

    try {

        const token =
            socket.handshake.auth?.token;

        if (!token) {

            return next(
                new Error("Authentication required")
            );

        }

        const payload =
            verifyAccessToken(token);

        socket.data.userId =
            payload.userId;

        next();

    } catch {

        next(
            new Error("Unauthorized")
        );

    }

};