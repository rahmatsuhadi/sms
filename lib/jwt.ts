import jwt from "jsonwebtoken";

const SECRET = process.env["SECRET"] || "default";

interface UserPayload {
  _id: string;
  username: string;
}

function signToken(payload: any): string {
  const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });
  return token;
}

function verifyToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET) as UserPayload;
    return decoded;
  } catch (err: any) {
    console.error("Token tidak valid:", err.message);
    return null;
  }
}

export {signToken, verifyToken}
