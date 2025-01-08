import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { History } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import * as Yup from 'yup';

type ResponseData = {
  message: string;
  histories?: Partial<History>[];
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method == 'GET') {
    const itemId = req.query.id;

    try {
      const histories = await prisma.history.findMany({
        // select:{
        //   amount: true,
        //   before: true,
        //   after: true,
        //   createdAt: true,
        //   type: true
        // },
        where: {
          itemId: itemId as string,
        },
      });

      if (histories) {
        res.status(200).json({ message: 'OK',histories });
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
