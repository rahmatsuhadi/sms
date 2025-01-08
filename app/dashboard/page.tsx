import { CategoryChart } from "@/components/chart/category";
import { Category2 } from "@/components/chart/category2";
import { HistoryLine } from "@/components/chart/history";
import { HistoryLine2 } from "@/components/chart/history2";
import { HistoryLine3 } from "@/components/chart/history3";
import { HistoryLine4 } from "@/components/chart/historyline4";
import { ItemChart } from "@/components/chart/item";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MainPage() {
  return (
    <div>
      <h1 className="text-xl mt-10">Status Dashboard</h1>

      <Card className=" mt-5"> 
            <CardHeader>
                <CardTitle>
                Welcome to Dashboard
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    Hello admin welcome back to Dashboard
                </CardDescription>
            </CardContent>
        </Card>


      <div className="grid grid-cols-1 lg:grid-cols-2 mt-4 gap-4 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 ">
          {/* <HistoryLine /> */}
          {/* <HistoryLine2/> */}
          {/* <Category2 /> */}
          <CategoryChart />
          <ItemChart/>
        </div>
        <div className="grid grid-cols-1 gap-5">
          {/* <HistoryLine3 /> */}
          <HistoryLine4 />
        </div>
      </div>
    </div>
  );
}
