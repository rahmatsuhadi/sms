import { HistoryLine2 } from "@/components/chart/history2";
import { HistoryLine3 } from "@/components/chart/history3";
import { ItemChart } from "@/components/chart/item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DetailItem() {
  return (
    <div className="w-full">
        <Link href={"/dashboard/item"} className="flex gap-2 items-center mt-5 mb-10">
        <ArrowLeft />
          Back to List
        </Link>

      {/* <h1 className="text-xl mt-5">List Items</h1> */}

      <Card className="mb-10 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-zinc-800">
            Kulkas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            {/* <div className="flex items-center">
              <span className="material-icons text-zinc-600 mr-2">
                inventory
              </span>
              <h2 className="text-lg font-medium text-zinc-700">
                Stock: <span className="font-bold text-zinc-800">90</span>
              </h2>
            </div> */}
            <div className="flex items-center">
              <span className="material-icons text-zinc-600 mr-2">
                category
              </span>
              <h2 className="text-lg font-medium text-zinc-700">
                Category:{" "}
                <span className="font-bold text-zinc-800">Perkakas</span>
              </h2>
            </div>
            <div className="flex items-center">
              <span className="material-icons text-zinc-600 mr-2">person</span>
              <h2 className="text-lg font-medium text-zinc-700">
                Created By:{" "}
                <span className="font-bold text-zinc-800">Admin</span>
              </h2>
            </div>
            <div className="flex items-center">
              <span className="material-icons text-zinc-600 mr-2">
                calendar_today
              </span>
              <h2 className="text-lg font-medium text-zinc-700">
                Created At:{" "}
                <span className="font-bold text-zinc-800">01 Jan 2023</span>
              </h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid-cols-1 lg:grid-cols-12 grid gap-4 mb-10">
        <div className="col-span-12 lg:col-span-3">
          <ItemChart />
        </div>
        <div className="col-span-12 lg:col-span-9">
          <HistoryLine3 />
        </div>
      </div>
    </div>
  );
}
