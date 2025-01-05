import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { Item } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import * as Yup from 'yup';

type ResponseData = {
  message: string;
  items?: Omit<Item, 'id'>[];
};

const bodySchema = Yup.object().shape({
  name: Yup.string().required(),
  stock: Yup.number().required(),
  categoryId: Yup.string().required(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == 'GET') {
    const itemId = req.query.id;

    try {
      const item = await prisma.item.findUnique({
        where: {
          id: itemId as string,
        },
      });

      if (item) {
        res.status(200).json({ message: 'OK', items: [item] });
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method == 'PUT') {
    const itemId = req.query.id;

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

      const existingItem = await prisma.item.findUnique({
        where: {
          id: itemId as string,
        },
      });

      if (!existingItem) {
        return res.status(404).json({ message: 'Item not found' });
      }

      if (existingItem.createdById !== auth.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const value = await bodySchema.validate(req.body);

      const item = await prisma.item.update({
        where: {
          id: itemId as string,
        },
        data: {
          name: value.name,
          stock: value.stock,
          category: {
            connect: {
              id: value.categoryId,
            },
          },
        },
      });

      if (item) {
        res.status(200).json({ message: 'OK', items: [item] });
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method == 'DELETE') {
    const itemId = req.query.id;

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

      const existingItem = await prisma.item.findUnique({
        where: {
          id: itemId as string,
        },
      });

      if (!existingItem) {
        return res.status(404).json({ message: 'Item not found' });
      }

      if (existingItem.createdById !== auth.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      await prisma.item.delete({
        where: {
          id: itemId as string,
        },
      });

      res.status(200).json({ message: 'OK' });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
