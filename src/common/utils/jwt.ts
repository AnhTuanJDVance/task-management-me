import jwt from "jsonwebtoken";

import { AppError } from "../errors/AppError";

export interface JwtPayload {
  userId: number;
}

const jwtSecret =
  process.env.JWT_SECRET;

const jwtSecretRefresh =
  process.env.JWT_SECRET_REFRESH;


if (!jwtSecret) {

  throw new AppError(
    "JWT_SECRET is not configured",
    500
  );

}

function getJwtSecret(): string {

  if (!jwtSecret) {

    throw new AppError(
      "JWT_SECRET is not configured",
      500
    );

  }

  return jwtSecret;

}

function getJwtRefreshSecret(): string {

    if (!jwtSecretRefresh) {

        throw new AppError(
            "JWT_SECRET_REFRESH is not configured",
            500
        );

    }

    return jwtSecretRefresh;

}

export function generateAccessToken(
  payload: JwtPayload
): string {
  const secret =
    getJwtSecret();

  return jwt.sign(
    payload,
    secret,
    {
      expiresIn: "15m"
    }
  );

}


export function generateRefreshToken(
  payload: JwtPayload
): string {
  const secret =
    getJwtRefreshSecret();

  return jwt.sign(
    payload,
    secret,
    {
      expiresIn: "7d"
    }
  );

}


export function verifyAccessToken(
  token: string
): JwtPayload {
    const secret =
    getJwtSecret();

  try {
    // console.log(token)

    const decoded =
      jwt.verify(
        token,
        secret
      ) as jwt.JwtPayload;

    console.log(secret)

    console.log(decoded)

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      decoded.userId === undefined
    ) {

      throw new AppError(
        "Invalid access token",
        401
      );

    }


    return {

      userId:
        decoded.userId as number

    };

  } catch (error) {

    if (error instanceof AppError) {

      throw error;

    }

    throw new AppError(
      "Invalid or expired access token",
      401
    );

  }

}


export function verifyRefreshToken(
  token: string
): JwtPayload {

  const secret =
    getJwtRefreshSecret();
    
  try {

    const decoded =
      jwt.verify(
        token,
        secret
      ) as jwt.JwtPayload;


    if (
      typeof decoded !== "object" ||
      decoded === null ||
      decoded.userId === undefined
    ) {

      throw new AppError(
        "Invalid refresh token",
        401
      );

    }


    return {

      userId:
        decoded.userId as number

    };

  } catch (error) {

    if (error instanceof AppError) {

      throw error;

    }

    throw new AppError(
      "Invalid or expired refresh token",
      401
    );

  }

}
