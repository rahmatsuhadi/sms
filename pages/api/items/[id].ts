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
  name: Yup.string().optional(),
  stock: Yup.number().optional(),
  categoryId: Yup.string().optional(),
  amount: Yup.number().optional(),
  type: Yup.string().oneOf(['IN', 'OUT']).optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
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

      if (value.amount && value.type) {
        let newStock = existingItem.stock;

        newStock =
          value.type === 'IN'
            ? newStock + value.amount
            : newStock - value.amount;

        if (newStock < 0) {
          return res.status(400).json({ message: 'Stock cannot be negative' });
        }

        await prisma.history.create({
          data: {
            item: {
              connect: {
                id: itemId as string,
              },
            },
            amount: value.amount,
            before: existingItem.stock,
            after: newStock,
            type: value.type,
            createdBy: {
              connect: {
                id: auth.id,
              },
            },
          },
        });

        const item = await prisma.item.update({
          where: {
            id: itemId as string,
          },
          data: {
            stock: newStock,
          },
        });

        if (item) {
          res.status(200).json({ message: 'OK', items: [item] });
        } else {
          res.status(404).json({ message: 'Item not found' });
        }
      }

      if (value.name || value.stock || value.categoryId) {
        console.log(value);
        const item = await prisma.item.update({
          where: {
            id: itemId as string,
          },
          data: {
            name: value.name || existingItem.name,
            category: {
              connect: {
                id: value.categoryId || existingItem.categoryId,
              },
            },
          },
        });

        if (item) {
          res.status(200).json({ message: 'OK', items: [item] });
        } else {
          res.status(404).json({ message: 'Item not found' });
        }
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

      const i = await prisma.item.delete({
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
