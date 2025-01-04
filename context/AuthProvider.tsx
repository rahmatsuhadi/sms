"use client"

import { createContext, use, useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

interface AuthContextType {
  user: any;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

let secret = "SMS";

const prisma = new PrismaClient();

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const result = jwt.decode(token);
      setUser(result);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error("Invalid");
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, username: user.username },
      secret,
      { expiresIn: "1h" }
    );

    localStorage.setItem("token", token);

    setUser({ id: user.id, name: user.name, username: user.username });
  };

  const logout = () => {localStorage.removeItem("token"); setUser(null)}

  return (
    <AuthContext.Provider value={{user, login, logout}}>
        {children}
    </AuthContext.Provider>
  )
};


export const useAuth = () =>{
    const context = useContext(AuthContext);

    if(context == undefined){
        throw new Error("use Auth must be used within an AuthProvider")
    }
    return context;
}
