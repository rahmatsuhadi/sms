import client from "@/lib/axios";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "./use-toast";
import { AxiosError } from "axios";

export interface CategoryData extends Category{
  _count:{
    item:number
  }
}

export const useCategories = () => {
    const [data, setData] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    const [error, setError] = useState<any>(null);
  
    const fetch = async () => {
      try {
        const response = await client.get<{ categories: CategoryData[] }>("/api/categories/");
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
  
    return { data, loading, error , refetch:fetch};
  };

  
  
export const useCreateCategory = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<any>(null);

  const mutate = async (body: {
    name: string;
  }) => {
    try {
      await client.post<{ items: Category[] }>("/api/categories", body);
      toast({
        variant: "default",
        title: "Success",
        description: "Success Create Category",
      });
      return true;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast({
        variant: "destructive",
        title: "Error when Create Category",
        description: err.message,
      });
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};

  
export const useEditCategory = (id:string) => {
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<any>(null);

  const mutate = async ( body:{name:string}) => {
    try {
      await client.put<{ category: Category[] }>("/api/categories/" + id, body);
      toast({
        variant: "default",
        title: "Success",
        description: "Success Update Category",
      });
      return true;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast({
        variant: "destructive",
        title: "Error when Edit Category",
        description: err.message,
      });
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};



export const useDeleteCateogry = (id:string) => {
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<any>(null);

  const mutate = async () => {
    try {
      await client.delete<{ category: Category[] }>("/api/categories/" + id);
      toast({
        variant: "default",
        title: "Success",
        description: "Success Delete Category",
      });
      return true;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast({
        variant: "destructive",
        title: "Error when Delete Category",
        description: err.message,
      });
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};