import axios from "axios"


export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // backend base URL
  withCredentials: true,               // send cookies for auth
});

