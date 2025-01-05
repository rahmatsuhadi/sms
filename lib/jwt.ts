import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

const SECRET = process.env["SECRET"] || "default";


function signToken(payload: User): string {
  const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });
  return token;
}

function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, SECRET) as User;
    return decoded;
  } catch (err) {
    if(err instanceof Error)
    console.error("Token tidak valid:", err.message);
    return null;
  }
}

export {signToken, verifyToken}
