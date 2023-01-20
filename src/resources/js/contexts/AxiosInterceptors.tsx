import React, {useContext, createContext, useState, ReactNode, useEffect } from "react"
import { useHistory } from "react-router-dom";
import axios, {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';
import { useErrorHandler } from "react-error-boundary";

type Props = {
    children: ReactNode
}

function AxiosInterceptors({children}: Props): React.ReactElement {
    const handleError = useErrorHandler();
    const history = useHistory();

    axios.defaults.baseURL = "http://localhost:8000/";
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.headers.post['Accept'] = 'application/json';
    axios.defaults.withCredentials = true;
    axios.interceptors.request.use(function(config){
        config.headers = config.headers ?? {};
        const token = localStorage.getItem('auth_token');
        config.headers.Authorization = token ? `Bearer ${token}` : '';

        // console.log(config);
        return config;
    }, function(error) {
        handleError(error);
        return Promise.reject(error);
    });
    axios.interceptors.response.use(
        async (response) => {
            const no_console_log_urls = [
                '/sanctum/csrf-cookie',
                '/api/broadcasting/auth',
                // "/api/notification/unread",
            ];
            if(no_console_log_urls.includes(response.config.url as string) === false) {
                console.log(response);
            }

            // 自分で作ったapiでないものを省く
            if(response.config.url !== '/sanctum/csrf-cookie' && response.config.url !== '/api/broadcasting/auth') {
                if(response.data.status !== undefined || response.data.validation_errors !== undefined) {
                    return response;
                }
                else {
                    console.log('error');
                    handleError(response);
                }
            }
            return response;
        }, error => {
            const {status} = error.response;
            switch (status) {
                case 400:
                    console.log(error.response);
                break;
                case 401:
                    console.log("Unauthorized");
                    history.push('/login');
                    return;
                break;
                case 404:
                    console.log(error.response?.status);
                break;
                case 500:
                    console.log("server error");
                break;
                default:
                    console.log("an unknown error occurred");
                break;
            }

            console.log('error');
            handleError(error);
            return Promise.reject(error);
        },
    );

    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default AxiosInterceptors