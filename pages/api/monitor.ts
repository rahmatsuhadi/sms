import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { History, HistoryType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

type ResponseData = {
  message: string;
  historyData?: {
    date:string,
    in:number,
    out:number
  }[];
  total?: number;
};


interface GroupedData {
  date: string;
  in: number;
  out: number;
}

const bodySchema = Yup.object().shape({
  type: Yup.mixed().oneOf(["30d", "90d", "7d"]).required(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method == "GET") {
    try {
      const now = new Date();

      let selecttedType = new Date();

      const { type } = await bodySchema.validate(req.query);
      switch (type) {
        case "30d":
          selecttedType.setMonth(selecttedType.getMonth() - 1);
          break;

        case "90d":
          selecttedType.setMonth(selecttedType.getMonth() - 3);

          break;
        default:
          selecttedType.setDate(selecttedType.getDate() - 7);
          break;
      }

      const histories = await prisma.history.findMany({
        where: {
          createdAt: {
            lte: now.toISOString(),
            gte: selecttedType.toISOString(),
          },
        },
        orderBy:{
          createdAt:"asc"
        },
        select: {
          after: true,
          before: true,
          amount: true,
          createdAt: true,
          id: true,
          itemId: true,
          type: true,
        },
      });


      
      const groupedData: { [key: string]: GroupedData } = histories.reduce((acc, history) => {
        const date = history.createdAt.toISOString().split("T")[0]; // Mendapatkan tanggal
        // console.log(date)
        const amount = history.amount;
      
        if (!acc[date]) {
          acc[date] = { date: date, in: 0, out: 0 };
        }
      
        if (history.type === "IN") {
          acc[date].in += amount;
        } else if (history.type === "OUT") {
          acc[date].out += amount;
        }
      
        return acc;
      }, {} as { [key: string]: GroupedData });


      const chartData:GroupedData[] = Object.values(groupedData).map(item => ({
        date: item.date,
        in: item.in,
        out: item.out
      }));



      res
        .status(200)
        .json({ message: "OK", historyData:chartData, total: histories.length });
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
