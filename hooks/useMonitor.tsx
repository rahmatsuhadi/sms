import client from "@/lib/axios";
import { History, Item } from "@prisma/client";
import { useEffect, useState } from "react";

export interface MonitorType {
  date: string;
  in: number;
  out: number;
}

export const useMonitor = (range: string) => {
  const [data, setData] = useState<{ data: MonitorType[] }>({ data: [] });
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<any>(null);

  const fetch = async () => {
    try {
      const response = await client.get<{ historyData: MonitorType[] }>(
        "/api/monitor?type=" + range
      );
      setData({ data: response.data.historyData });
    } catch (error) {
      console.log("Error Fetching Items");
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [range]);

  return { data, loading, error, refetch: fetch };
};
