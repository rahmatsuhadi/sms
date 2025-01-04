import { PrismaClient, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import * as Yup from "yup";

type ResponseData = {
  message: string;
  token?: string;
  user?: Omit<User, "password">;
};
const prisma = new PrismaClient();

const saltRounds = 10;

const bodySchema = Yup.object().shape({
  username: Yup.string().min(3).max(30).required(),
  password: Yup.string().min(4).required(),
  name: Yup.string().min(3).required(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method == "POST") {
    try {
      const value = await bodySchema.validate(req.body);

      const cek = await prisma.user.findUnique({
        where: {
          username: value.username,
        },
      });
      if (cek) {
        return res.status(400).json({ message: "User already register" });
      }

      const salt = bcrypt.genSaltSync(saltRounds);

      const passwordHash = await bcrypt.hash(value.password, salt);

      const user = await prisma.user.create({
        data: {
          password: passwordHash,
          username: value.username,
          name: value.name,
        },
      });

      const { password, ...userWithoutPassword } = user;

      res.status(200).json({ message: "OK", user: userWithoutPassword });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        res.status(400).json({ message: error.errors[0] });
      }
    }
  } else {
    res.status(405).json({ message: "Method Not Allow" });
  }
}
