import axios, { AxiosInstance } from 'axios';

export class BaseApi {
  protected axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL: baseURL,
    });
  }
}