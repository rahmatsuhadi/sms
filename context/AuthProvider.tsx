"use client";

import { createContext, use, useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import client from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { tokenGetter, tokenRemove, tokenSetter } from "@/lib/token";
import { useRouter } from "next/navigation";
import { verifyToken } from "@/lib/jwt";
import Image from "next/image";

interface AuthContextType {
  user: Omit<User, "password"> | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(
    null
  );
  const [loading, setLoading] = useState(true)
  const router = useRouter();


  const fetchUser = async() =>{
    try {
      const {data:reponseUser} = await client.get<{message:string,user:User}>("/api/auth/me");
      setUser(reponseUser.user)
      setLoading(false)
    } catch (error) {
      logout()
      router.replace("/")
    }
  }

  useEffect(() => {
    const token = tokenGetter();

    if (token) {
      fetchUser()
    }
    else{
      setLoading(false);
      router.replace("/")
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const { data } = await client.post<{ token: string; user: User }>(
        "/api/auth/login",
        {
          username: username,
          password: password,
        }
      );
      tokenSetter(data.token);
      setUser(data.user);
      router.replace("/dashboard");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err.response?.data.message,
      });
    }
  };

  const logout = () => {
    tokenRemove()
    setUser(null);
    router.replace("/")
  };


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {loading ? (
        <div className="w-screen h-screen flex justify-center items-center flex-col">
          <Image src={"/loader.gif"} width={50} height={50} alt="Loader"/>
          <h3 className="font-semibold text-xl">Please Wait</h3>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context == undefined) {
    throw new Error("use Auth must be used within an AuthProvider");
  }
  return context;
};
