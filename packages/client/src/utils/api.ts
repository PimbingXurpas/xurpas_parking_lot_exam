import axios, { Method } from "axios";

const apiBase = `${process.env.REACT_APP_API_BASE_URL}/api/v1/`;

const getInstance = async () => {
  const axiosInstance = axios.create({
    baseURL: `${apiBase}`,
  });

  axiosInstance.interceptors.response.use(
    (response: any) => {
      return response;
    },
    async (error: any) => {
      return Promise.reject(error.response);
    }
  );

  return axiosInstance;
};

export const api = {
  get: async (endpoint: string) => {
    const res = await (await getInstance()).get(`${apiBase}${endpoint}`);
    return res.data;
  },
  post: async (endpoint: string, data: any) => {
    return await (await getInstance()).post(`${apiBase}${endpoint}`, data);
  },
  patch: async (endpoint: string, data: any) => {
    return await (await getInstance()).patch(`${apiBase}${endpoint}`, data);
  },
  delete: async (endpoint: string) => {
    return await (await getInstance()).delete(`${apiBase}${endpoint}`);
  },
};
