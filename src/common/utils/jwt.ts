import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: number;
}

const jwtSecret = process.env.JWT_SECRET;
const jwtSecretRefresh = process.env.JWT_SECRET_REFRESH;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not configured");
}

export function generateAccessToken(
  payload: JwtPayload
): string {
  return jwt.sign(payload, jwtSecret!, {
    expiresIn: "15m"
  });
}

export function generateRefreshToken(
  payload: JwtPayload
): string {

  if (!jwtSecretRefresh) {
    throw new Error("JWT_SECRET_REFRESH is not configured");
  }

  return jwt.sign(
    payload,
    jwtSecretRefresh,
    {
      expiresIn: "7d"
    }
  );

}

export function verifyAccessToken(
  token: string
): JwtPayload {

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const decoded =
    jwt.verify(
      token,
      jwtSecret
    ) as jwt.JwtPayload;

  if (typeof decoded !== "object" || decoded.userId === undefined) {
    throw new Error("Invalid access token");
  }

  return {
    userId: decoded.userId as number
  };

}

export function verifyRefreshToken(
  token: string
): JwtPayload {
  if (!jwtSecretRefresh) {
    throw new Error("JWT_SECRET is not configured");
  }

  const decoded =
    jwt.verify(
      token,
      jwtSecretRefresh
    ) as jwt.JwtPayload;

  if (typeof decoded !== "object" || decoded.userId === undefined) {
    throw new Error("Invalid access token");
  }

  return {
    userId: decoded.userId as number
  };

}

