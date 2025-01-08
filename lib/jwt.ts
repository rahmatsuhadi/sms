import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

const SECRET = process.env["SECRET"] || "default";

export type userPayload = Omit<User, "password" | "createdAt"| "name">;

function signToken(payload: userPayload): string {
  const token = jwt.sign(payload, SECRET, { expiresIn: "1d" });
  return token;
}

function verifyToken(token: string): userPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET) as userPayload;
    return decoded;
  } catch (err) {
    if(err instanceof Error)
    console.error("Token tidak valid:", err.message);
    return null;
  }
}

export {signToken, verifyToken}
