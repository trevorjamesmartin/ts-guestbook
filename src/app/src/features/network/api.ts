import axios, { Axios, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Socket } from 'socket.io-client';

interface socketpath {
    [key: string]: {
        event: string;
        params?: any
    };
}

interface construct {
    token?: string,
    config?: AxiosRequestConfig,
    socket?: Socket<DefaultEventsMap, DefaultEventsMap>,
    socketPath?: socketpath
}

class VigilantAPI extends Axios {
    defaults;
    interceptors;
    private socket;
    client: AxiosInstance;
    auth: any;
    socketPath?: socketpath;
    constructor(c: construct) {
        super(c.config);
        if (c.token)
            this.auth = {
                withCredentials: true,
                headers: {
                    "Authorization": c.token
                }
            }
        this.client = axios.create({
            ...c.config,
            baseURL: process.env.REACT_APP_BASE_URL || window.location.origin,
            ...this.auth
        });
        this.interceptors = this.client.interceptors;
        this.defaults = this.client.defaults;
        this.socket = c.socket;
        this.socketPath = c.socketPath;
        if (!this.socket) {
            console.log('[legacy mode]');
        }
    }

    io(event: string, args: any) {
        this.socket?.emit(event, args);
    }

    getUri(config?: AxiosRequestConfig): string {
        return this.client.getUri(config);
    };

    request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R> {
        return this.client.request(config);
    };

    /**
     * io resolves to a callback,
     * this will be immediately returned
     * 
     * @param status default = 42
     * @param statusText default = "detour"
     * @returns 
     */
    private detour(status?: number, statusText?: string) {
        return {
            data: [],
            status: status || 42,
            statusText: statusText || "detour",
            headers: undefined,
            config: undefined,
            request: undefined,
        }
    }

    private eventIO(urlPath: string): string {
        let result = ""
        if (this.socketPath) {
            result = this.socketPath[urlPath].event;
        }
        return result
    }

    private eventIOparams(urlPath: string): any {
        if (this.socketPath) {
            return this.socketPath[urlPath].params
        }
    }

    private socketAPI(urlPath: string, config: any) {
        if (this.socket) {
            let event = this.eventIO(urlPath);
            let args = this.eventIOparams(urlPath);
            // config should be loaded into args.
            console.log(event, args);
            switch (event) {
                case "api:users:with-profiles":
                case "api:thread":
                    console.log('[io] -> ', event, args || config)
                    this.io(event, args || config); // send io event 
                    break;

                default:
                    console.log('[io] -> ', event);
                    this.io(event, undefined); // send without args 
                    break;
            }
            return this.detour(); // return with status 42
        }
        return this.detour(400);
    }

    private hasIO(urlPath: string): boolean {
        let connected = this.socket?.connected;
        // switch to legacy when disconnected.
        return connected ? Object.keys(this?.socketPath || {}).includes(urlPath) : false;
    }

    private dynamicURL(url: string, params?: any) {
        if (!params) return url;
        let [path, ...options] = url.split('/:');
        if (!options) {
            return path;
        }
        for (let name of options) {
            path += `/${params[name]}`
        }
        return path;
    }

    get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
        console.log(url, this.hasIO(url), config?.params)
        if (this.hasIO(url)) {
            let { params }: any = config;
            return new Promise(() => this.socketAPI(url, params));
        } else {
            const resolved = this.dynamicURL(url, config?.params);
            console.log('[GET]', resolved);
            return this.client.get(resolved, { params: config?.params });
        }
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
        return this.client.post(url, data, config);
    };
    put<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
        return this.client.put(url, data, config)
    };
    patch<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
        return this.client.patch(url, data, config);
    };
}

export default VigilantAPI
