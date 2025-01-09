"use client";
import { CategoryData, useCategories } from "@/hooks/useCategories";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
  
import { Area, AreaChart, CartesianGrid, LabelList, Pie, PieChart, XAxis } from "recharts";
import colors from "@/utlis/colors";
import React from "react";
import { useMonitor } from "@/hooks/useMonitor";

export default function DetailDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 mt-4 gap-4 mb-10">
      <div className="grid grid-cols-1  gap-6 lg:gap-8 ">
        <CategoryChart />
      </div>
      <div className="grid grid-cols-1 col-span-2 gap-5">
        <HistoryLineAll />
      </div>
    </div>
  );
}



export function CategoryChart() {
  const { data } = useCategories();

  const filterData = data.map((item, index) => {
    return {
      category: item.id,
      countItem: item._count.item,
      fill: colors[index],
    };
  });

  const filterConfig = (categories: CategoryData[]): ChartConfig => {
    let config: ChartConfig = {
      category: {
        label: "Category",
      },
    } satisfies ChartConfig;

    categories.forEach((e, i) => {
      config[e.id] = {
        label: e.name,
        color: colors[i + 5],
      };
    });
    return config;
  };

  const config = filterConfig(data);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Category</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={filterConfig(data)}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
            <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie data={filterData} dataKey="countItem">
              <LabelList
                dataKey="category"
                className="fill-background text-white"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof config) =>
                    config[value]?.label
                }
              />
            </Pie>
          </PieChart>
          
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* <div className="flex items-center gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div> */}
        <div className="leading-none text-muted-foreground">
          Showing total item for use cateogry
        </div>
      </CardFooter>
    </Card>
  );
}


const chartConfig = {
  visitors: {
    label: "Histories",
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




export function HistoryLineAll() {
  const [timeRange, setTimeRange] = React.useState("7d")


  const {data} = useMonitor(timeRange)


  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Detail History Stock</CardTitle>
          <CardDescription>
            Showing total histories for the last 3 months
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
          <AreaChart data={data.data}>
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

