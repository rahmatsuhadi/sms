import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { Item, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

type ResponseData = {
  message: string;
  user?: Omit<User, "password" | "name">;
  headers?: any;
};

const bodySchema = Yup.object().shape({
  name: Yup.string().required(),
  stock: Yup.number().required(),
  categoryId: Yup.string().required(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method == "GET") {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return res
          .status(401)
          .json({ message: "Authorization header missing" });
      }

      const auth = verifyToken(token);

      if (!auth) {
        return res.status(401).json({ message: "Invalid token" });
      }
      const user = await prisma.user.findUnique({
        where: {
          id: auth.id,
        },
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }
      const { password, ...withOutPassword } = user;

      res.status(200).json({ message: "OK", user: withOutPassword });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
