import { PrismaClient, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

import * as Yup from "yup";

type ResponseData = {
  message: string | string[];
  token?: string;
  user?: Omit<User, "password">;
};
const prisma = new PrismaClient();

const bodySchema = Yup.object().shape({
  username: Yup.string().min(3).max(30).required(),
  password: Yup.string().min(4).required(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method == "POST") {
    try {
      const value = await bodySchema.validate(req.body);

      const cekuser = await prisma.user.findUnique({
        where: {
          username: value.username,
        },
      });

      if (!cekuser) {
        return res.status(400).json({ message: "Invalid login" });
      }

      const passwordCheck = await bcrypt.compare(
        value.password,
        cekuser.password
      );

      if (!passwordCheck) {
        return res.status(400).json({ message: "Invalid login" });
      }

      const { password, ...userWithoutPassword } = cekuser;

      const token = signToken({ id: cekuser.id, username: cekuser.username });

      res.status(200).json({ message: "OK", user: userWithoutPassword, token });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        res.status(400).json({ message: error.errors[0] });
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  } else {
    res.status(405).json({ message: "Method Not Allow" });
  }
}
