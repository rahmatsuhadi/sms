import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import * as Yup from 'yup';

type ResponseData = {
  message: string;
  categories?: Omit<Category, 'id'>[];
};

const bodySchema = Yup.object().shape({
  name: Yup.string().required(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method == 'GET') {
    try {
      const categories = await prisma.category.findMany({
        select:{
          id: true,
          name: true,
          _count:true,
          createdAt: true
        }
      });

      res.status(200).json({ message: 'OK', categories });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method == 'POST') {
    try {
      const value = await bodySchema.validate(req.body);

      const category = await prisma.category.create({
        data: {
          name: value.name,
        },
      });

      res.status(200).json({ message: 'OK', categories: [category] });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        res.status(400).json({ message: error.errors[0] });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
}
