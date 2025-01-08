import { CardDetailItem } from "@/components/card/detail_item";
import { HistoryLine2 } from "@/components/chart/history2";
import { HistoryLine3 } from "@/components/chart/history3";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useItemById } from "@/hooks/useDataItem";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function DetailItem({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const id = (await params).id; 

  return (
    <div className="w-full">
        <Link href={"/dashboard/item"} className="flex gap-2 items-center mt-5 mb-10">
        <ArrowLeft />
          Back to List
        </Link>

      {/* <h1 className="text-xl mt-5">List Items</h1> */}

      

      <CardDetailItem id={id}/>
    </div>
  );
}
