"use client";

import { DetailItem, useItemById, useItemHistoryById } from "@/hooks/useDataItem";
import { HistoryLine3 } from "../chart/history3";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Area, AreaChart, CartesianGrid, Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart, XAxis } from "recharts";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { formatDateTimeToIndo } from "@/utlis/formatDate";

export function CardDetailItem({ id }: { id: string }) {
  const { data } = useItemById(id);

  if (!data) return <></>;

  return (
    <>
      <Card className="mb-10 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-zinc-800">
            {data?.name ?? "-"}
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
              {/* <span className="material-icons text-zinc-600 mr-2">
                category
              </span> */}
              <h2 className="text-lg font-medium text-zinc-700">
                Category:{" "}
                <span className="font-bold text-zinc-800">
                  {data?.category.name ?? "-"}
                </span>
              </h2>
            </div>
            <div className="flex items-center">
              {/* <span className="material-icons text-zinc-600 mr-2">person</span> */}
              <h2 className="text-lg font-medium text-zinc-700">
                Created By:{" "}
                <span className="font-bold text-zinc-800">
                  {data?.createdBy.name}
                </span>
              </h2>
            </div>
            <div className="flex items-center">
              {/* <span className="material-icons text-zinc-600 mr-2">
                calendar_today
              </span> */}
              <h2 className="text-lg font-medium text-zinc-700">
                Created At:{" "}
                <span className="font-bold text-zinc-800">
                  {formatDateTimeToIndo(data?.createdAt.toString())}
                </span>
              </h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid-cols-1 lg:grid-cols-12 grid gap-4 mb-10">
        <div className="col-span-12 lg:col-span-3">
          <ChartTotalItem data={data} id={data.id} />
        </div>
        <div className="col-span-12 lg:col-span-9">
          <ChartLineHistoryItem id={data.id}/>
        </div>
      </div>

      {/* <ChartLineHistoryItem /> */}
    </>
  );
}

export function ChartTotalItem({ data }: { data: DetailItem; id: string }) {
  const chartData = [
    { data: "item", count: data.stock, fill: "var(--color-safari)" },
  ];

  const chartConfig = {
    data: {
      label: "Visitors",
    },
    item: {
      label: "Total Item",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Stock</CardTitle>
        {/* <CardDescription></CardDescription>} */}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="count" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].count.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Items
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* <div className="flex items-center gap-2 font-medium leading-none">
        Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
      </div> */}
        <div className="leading-none text-muted-foreground">Showing total items for now</div>
      </CardFooter>
    </Card>
  );
}


const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  in: {
    label: "Stock In",
    color: "hsl(var(--chart-1))",
  },
  out: {
    label: "Stock Out",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig


interface GroupedData {
    date: string;
    in: number;
    out: number;
  }

export function ChartLineHistoryItem({id}:{id:string}) {
  const [timeRange, setTimeRange] = React.useState("90d")


  const {data} = useItemHistoryById(id)


  const groupedData: { [key: string]: GroupedData } = data.reduce((acc, history) => {
    const date = history.createdAt.toString().split("T")[0]; // Mendapatkan tanggal
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

  
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Detail History Stock</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillin" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-in)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-in)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillout" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-out)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-out)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="out"
              type="natural"
              fill="url(#fillout)"
              stroke="var(--color-out)"
              stackId="a"
            />
            <Area
              dataKey="in"
              type="natural"
              fill="url(#fillin)"
              stroke="var(--color-in)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

