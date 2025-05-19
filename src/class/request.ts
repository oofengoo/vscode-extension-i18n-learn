import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { IAXIOS } from '../typings';

class AXIOS implements IAXIOS {
    private axiosInstance: AxiosInstance;

    constructor(options: AxiosRequestConfig) {
        this.axiosInstance = axios.create(options);
    }

    request(config: AxiosRequestConfig): Promise<any> {
        return new Promise((resolve, reject) => {
            this.axiosInstance
                .request(config)
                .then((res) => {
                    let status = res.status;
                    if (status === 200) {
                        let result = res.data;
                        resolve(result);
                    }
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    get(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<any> {
        return this.request({
            url,
            method: 'get',
            baseURL: config.baseURL,
            headers: config.headers,
            params: data,
            data: null,
            responseType: config.responseType || 'json',

        });
    }

    post(url: string, data: any, config: AxiosRequestConfig = {}): Promise<any> {
        return this.request({
            url,
            method: 'post',
            headers: config.headers,
            baseURL: config.baseURL,
            responseType: config.responseType || 'json',
            params: null,
            data: data,
        });
    }
}

function createAxios(opt: { baseUrl?: string; token?: string }): AXIOS {
    const config: AxiosRequestConfig = {
        baseURL: opt.baseUrl,
        timeout: 10 * 1000,
        headers: {
            'Cookie': opt.token, // 添加 token 到请求头
            'Content-Type': 'application/json' // 或者其他你需要的请求头
        }
    };
    return new AXIOS(config);
}
export default createAxios({})
