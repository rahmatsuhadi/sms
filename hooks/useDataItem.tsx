import client from "@/lib/axios";
import { History, Item } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "./use-toast";
import { AxiosError } from "axios";
import { set } from "zod";
import { MonitorType } from "./useMonitor";

export interface DetailItem extends Item{
  createdBy:{
    name:string
  },
  category:{
    name:string
  },
  _count:{
    history:number
  }
}

export const useItemById = (id:string) =>{
  const [data, setData] = useState<DetailItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<any>(null);

  const fetch = async () => {
    try {
      const response = await client.get<{ items: DetailItem[] }>("/api/items/" + id);
      setData(response.data.items[0]);
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

  return { data, loading, error, refetch: fetch }
}




export const useItemHistoryById = (id:string, range:string) =>{
  const [data, setData] = useState<MonitorType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<any>(null);

  const fetch = async () => {
    try {
      const response = await client.get<{ historyData: MonitorType[] }>("/api/items/" + id + "/history-data?type=" + range);
      setData(response.data.historyData);
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

  return { data, loading, error, refetch: fetch }
}


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
    lowStockThreshold: number;
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

export const useEditItem = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<any>(null);

  const mutate = async (id: string, body: {
    name: string,
    lowStockThreshold:number
  }) => {
    try {
      await client.put<{ items: Item[] }>(`/api/items/${id}`, body);
      toast({
        variant: "default",
        title: "Success",
        description: "Success Update Item",
      });
      return true;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast({
        variant: "destructive",
        title: "Error when Update Item",
        description: err.message,
      });
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  return { mutate, loading, error };
}

export const useManageStock = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<any>(null);

  const mutate = async (id: string, body: {
    amount: number;
    type: "IN" | "OUT";
  }) => {
    try {
      await client.put<{ items: Item[] }>(`/api/items/${id}`, body);
      toast({
        variant: "default",
        title: "Success",
        description: "Success Update Item",
      });
      return true;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast({
        variant: "destructive",
        title: "Error when Update Item",
        description: err.message,
      });
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  return {mutate, loading, error};
}

export const useDeleteItem = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<any>(null);

  const mutate = async (id: string) => {
    try {
      await client.delete<{ items: Item[] }>(`/api/items/${id}`);
      toast({
        variant: "default",
        title: "Success",
        description: "Success Delete Item",
      });
      return true;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast({
        variant: "destructive",
        title: "Error when Delete Item",
        description: err.message,
      });
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  return {mutate, loading, error};
}