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
    const categoryId = req.query.id;

    try {
      const category = await prisma.category.findUnique({
        where: {
          id: categoryId as string,
        },
      });

      if (category) {
        res.status(200).json({ message: 'OK', categories: [category] });
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method == 'PUT') {
    const categoryId = req.query.id;

    try {
      const value = await bodySchema.validate(req.body);

      const category = await prisma.category.update({
        where: {
          id: categoryId as string,
        },
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
  } else if (req.method == 'DELETE') {
    const categoryId = req.query.id;

    try {
      await prisma.category.delete({
        where: {
          id: categoryId as string,
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
