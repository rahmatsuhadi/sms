import client from "@/lib/axios";
import { Item } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "./use-toast";
import { AxiosError } from "axios";

export const useItem = () => {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<any>(null);

  const fetch = async () => {
    try {
      const response = await client.get<{ items: Item[] }>("/api/items");
      setData(response.data.items);
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

export const useCreateItem = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<any>(null);

  const mutate = async (body: {
    name: string;
    categoryId: string;
    stock: number;
  }) => {
    try {
      await client.post<{ items: Item[] }>("/api/items", body);
      toast({
        variant: "default",
        title: "Success",
        description: "Success Create Item",
      });
      return true;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast({
        variant: "destructive",
        title: "Error when Create Item",
        description: err.message,
      });
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};
