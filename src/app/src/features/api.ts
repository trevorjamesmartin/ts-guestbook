import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import axios, { Axios, AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';

class VigilantAPI extends Axios {
    defaults;
    interceptors;
    socket;
    client:AxiosInstance;
    auth:any;
    
    constructor(token?: string, config?: AxiosRequestConfig, socket?: Socket<DefaultEventsMap, DefaultEventsMap>) {
        super();
        this.socket = socket;
        if (token) 
        this.auth = {
            withCredentials: true,
            headers: {
                "Authorization": token
            }
        }
        this.client = axios.create({
            ...config,
            baseURL: process.env.REACT_APP_BASE_URL || window.location.origin,
            ...this.auth
        });
        this.interceptors = this.client.interceptors;
        this.defaults = this.client.defaults;
    }

    io(event:string, args:any) {
        this.socket?.send(event, args);
    }
    
    getUri(config?: AxiosRequestConfig): string{
        return this.client.getUri(config);
    };
    request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>{
        return this.client.request(config);
    };
  
    get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
        console.log('GET', url);
        // console.log('auth -', this.auth)
        return this.client.get(url, config)
    };
    delete<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
        return this.client.delete(url, config)
    };
    head<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
        return this.client.head(url, config);
    };
    options<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
        return this.client.options(url, config);
    };
    post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
        switch (url) {
            case '/api/feed':
                console.log('auth -', this.auth)
                break;
            case '/api/login':
            case '/api/logout':
            default:
                break;
        }
        return this.client.post(url, data, config);
    };
    put<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>{
        return this.client.put(url, data, config)
    };
    patch<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>{
        return this.client.patch(url, data, config);
    };    
}

export default VigilantAPI
