import React, {useContext, createContext, useState, ReactNode, useEffect } from "react"
import axios, {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

type Props = {
    children: ReactNode
}

function AxiosInterceptors({children}: Props): React.ReactElement {
    axios.defaults.baseURL = "http://localhost:8000/";
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.headers.post['Accept'] = 'application/json';
    axios.defaults.withCredentials = true;
    axios.interceptors.request.use(function(config){
        config.headers = config.headers ?? {};
        const token = localStorage.getItem('auth_token');
        config.headers.Authorization = token ? `Bearer ${token}` : '';
        return config;
    });
    axios.interceptors.response.use(
        async (response) => {
            // if (response.status === 200) {
            //     console.log('Posted Successfully');
            // }
            return response;
        }, error => {
            const {status} = error.response;
            switch (status) {
                case 400:
                console.log(error.response);
                break;
                case 401:
                console.log("Unauthorized");
                // https://kk-web.link/blog/20181012
                // swal({
                //     title: "Unauthorized",
                //     content: {
                //         attributes: {
                //             innerHTML: renderToStaticMarkup(
                //                 <React.Fragment>
                //                     <Button color="primary" variant="contained">Register</Button>
                //                     <Button color="primary" variant="contained">Login</Button>
                //                 </React.Fragment>
                //             ),
                //         },
                //         element: "div",
                //     },
                //     icon: "info",
                // })
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