import { ItemStock } from "@/hooks/useHistory";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

type ResponseData = {
  message: string;
  data?: ItemStock[];
};

interface GroupedData {
  date: string;
  in: number;
  out: number;
}

const paramSchema = Yup.object().shape({
  type: Yup.mixed().oneOf(["OUT", "IN"]).required(),
  stock: Yup.number().required(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {

  if (req.method == "GET") {
    try {

        const {stock,type} = await paramSchema.validate(req.query)

      const histories = await prisma.history.groupBy({
        by: ["itemId"],
        _sum: {
          amount: true,
        },
        where: {
          type: type,
        },
        having:{
          amount:{
            _sum:{
              gt:stock
            }
          }          
        },
        orderBy:{
          itemId:"asc"
        }
      });

      const responses = await Promise.all(histories.map(async (history) => {
        const item = await prisma.item.findUnique({ where: { id: history.itemId } });
      
        return {
          name: item?.name || "", // Pastikan ini sesuai dengan kolom yang ada
          id: history.itemId,
          total: history._sum.amount || 0,
        };
      }));


      res.status(200).json({
        message: "OK",
        data:responses
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        res.status(400).json({ message: error.errors[0] });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
