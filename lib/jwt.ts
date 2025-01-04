import jwt from "jsonwebtoken";

const SECRET = process.env["SECRET"] || "default";

interface UserPayload {
  id: string;
  username: string;
}

function signToken(payload: UserPayload): string {
  const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });
  return token;
}

function verifyToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET) as UserPayload;
    return decoded;
  } catch (err) {
    if(err instanceof Error)
    console.error("Token tidak valid:", err.message);
    return null;
  }
}

export {signToken, verifyToken}
