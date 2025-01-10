import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

type ResponseData = {
  message: string;
  historyStockIn?: any[];
  historyStockOut?: any[];
};

interface GroupedData {
  date: string;
  in: number;
  out: number;
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const itemId = req.query.id;

  if (req.method == "GET") {
    try {

      const historiesOut = await prisma.history.groupBy({
        by: ["itemId"],
        _sum:{
            amount:true
        },
        where:{
            type: "OUT"
        }
      });

      const historiesIn = await prisma.history.groupBy({
        by: ["itemId"],
        _sum:{
            amount:true
        },
        where:{
            type: "IN"
        }
      });


      res
        .status(200)
        .json({
          message: "OK",historyStockOut:historiesOut,historyStockIn:historiesIn
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
