import axios, { AxiosError } from "axios";
import { tokenGetter } from "./token";

const client = axios.create({
  baseURL: "/",
});

client.interceptors.request.use(
  (config) => {

    const token = tokenGetter();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  // (error: AxiosError<{ message: string }>) => {
  //   if (error.response && error.response.data) {
  //     const mess = error.response.data.message || "Axios Error";
  //     return Promise.reject(new Error(mess));
  //   }
  //   return Promise.reject(new Error("Network Error"));
  // }
);

export default client;
