import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { Item } from '@prisma/client';
import { console } from 'inspector';
import { NextApiRequest, NextApiResponse } from 'next';
import * as Yup from 'yup';

type ResponseData = {
  message: string;
  items?: Omit<Item, 'id'>[];
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
  if (req.method == 'GET') {
    try {
      const items = await prisma.item.findMany({
        include:{
          category: {
            select: {
              id: true,
              name: true
            }
          },
          createdBy:{
            select: {
              id:true,
              name: true,
              username: true
            }
          }
        }
      });

      res.status(200).json({ message: 'OK', items });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method == 'POST') {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res
          .status(401)
          .json({ message: 'Authorization header missing' });
      }

      const auth = verifyToken(token);

      if (!auth) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const value = await bodySchema.validate(req.body);

      const item = await prisma.item.create({
        data: {
          name: value.name,
          stock: value.stock,
          category: {
            connect: {
              id: value.categoryId,
            },
          },
          createdBy: {
            connect: {
              id: auth.id,
            },
          },
        },
      });

      res.status(200).json({ message: 'OK', items: [item] });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        res.status(400).json({ message: error.errors[0] });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
