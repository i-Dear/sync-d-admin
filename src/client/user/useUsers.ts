// src/client/user/useUsers.ts
import axios from "axios";
import useSWR from "swr";
import { IUser } from "./IUser";

interface UserResponse {
  userEntities: IUser[];
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useUsers = (page: number) => {
  const { data, error } = useSWR<UserResponse>(`http://localhost:8080/admin/user?page=${page}`, fetcher);

  return {
    data,
    isLoading: !error && !data,
    error,
  };
};
