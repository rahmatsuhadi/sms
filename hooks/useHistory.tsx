import client from "@/lib/axios";
import { History, Item } from "@prisma/client";
import { useEffect, useState } from "react";

export interface HistoryDataType extends History{
  item:Item
}

export const useHistory = () => {
    const [data, setData] = useState<HistoryDataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    const [error, setError] = useState<any>(null);
  
    const fetch = async () => {
      try {
        const response = await client.get<{ histories: HistoryDataType[] }>("/api/histories/");
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
  
    return { data, loading, error , refetch:fetch};
  };
