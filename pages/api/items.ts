import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

type ResponseData ={
    message: string
}
const prisma = new PrismaClient();
           

export default async function handler(req:NextApiRequest, res:NextApiResponse<ResponseData>){
    if(req.method=="GET"){
        const data = await prisma.item.findMany();

        res.status(200).json({message: "OK"})
    }

    else{
        res.status(405).json({message: "Method Not Allow"})
    }
}