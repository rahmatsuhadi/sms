import client from "@/lib/axios";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";

export const useCategories = () => {
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    const [error, setError] = useState<any>(null);
  
    const fetch = async () => {
      try {
        const response = await client.get<{ categories: Category[] }>("/api/categories");
        setData(response.data.categories);
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
  
    return { data, loading, error };
  };