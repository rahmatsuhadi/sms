import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { History, HistoryType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import * as Yup from 'yup';

type ResponseData = {
  message: string;
  histories?: Omit<History, 'id'>[];
};

const bodySchema = Yup.object().shape({
  itemId: Yup.string().required(),
  amount: Yup.number().required(),
  before: Yup.number().required(),
  after: Yup.number().required(),
  type: Yup.mixed().oneOf(['IN', 'OUT']).required(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method == 'GET') {
    try {
      const histories = await prisma.history.findMany({
        include: {
          item: true,
        },
      });

      res.status(200).json({ message: 'OK', histories });
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

      const history = await prisma.history.create({
        data: {
          item: {
            connect: {
              id: value.itemId,
            },
          },
          amount: value.amount,
          before: value.before,
          after: value.after,
          type: value.type as HistoryType,
          createdBy: {
            connect: {
              id: auth.id,
            },
          },
        },
        include: {
          item: true,
        },
      });

      res.status(200).json({ message: 'OK', histories: [history] });
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
