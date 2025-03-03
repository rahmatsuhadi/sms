import DetailDashboard from "@/components/card/detail_dashboard";
import { CategoryChart } from "@/components/chart/category";
import { Category2 } from "@/components/chart/category2";
import { HistoryLine } from "@/components/chart/history";
import { HistoryLine2 } from "@/components/chart/history2";
import { HistoryLine3 } from "@/components/chart/history3";
import { HistoryLine4 } from "@/components/chart/historyline4";
// import { ItemChart } from "@/components/chart/item";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function MainPage() {
  return (
    <div>
      <h1 className="text-xl mt-10">Status Dashboard</h1>

      <Card className=" mt-5">
        <CardHeader>
          <CardTitle>Welcome to Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Hello admin welcome back to Dashboard
          </CardDescription>
        </CardContent>
      </Card>

      <DetailDashboard/>
    </div>
  );
}
