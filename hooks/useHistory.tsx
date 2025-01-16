import client from "@/lib/axios";
import { History, Item, User } from "@prisma/client";
import { useEffect, useState } from "react";

export interface HistoryDataType extends History {
  item: Item;
  createdBy: User;
}

export const useHistory = () => {
  const [data, setData] = useState<HistoryDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<any>(null);

  const fetch = async () => {
    try {
      const response = await client.get<{ histories: HistoryDataType[] }>(
        "/api/histories/"
      );
      setData(response.data.histories);
    } catch (error) {
      console.log("Error Fetching Items");
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { data, loading, error, refetch: fetch };
};

export interface ItemStock {
  name: string;
  id: string;
  total: number;
}

export const useCheckStockTotal = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<any>(null);

  const fetch = async ({
    type,
    stock,
  }: {
    type: "IN" | "OUT";
    stock: number;
  }) => {
    try {
      setLoading(true)
      const response = await client.get<{ data: ItemStock[] }>(
        "/api/analytic",
        {
          params: {
            type: type,
            stock: stock,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error Fetching Items");
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, mutate: fetch };
};
