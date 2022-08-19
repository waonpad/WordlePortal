import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import { renderToStaticMarkup } from "react-dom/server";
import { Button, Card } from '@material-ui/core';
import swal from 'sweetalert';

import Top from './pages/Top';
import Example from './pages/Example';
import About from './pages/About';
import GlobalNav from './components/GlobalNav';
import Register from './pages/Register';
import Login from './pages/Login';
import User from './pages/User';
import Page404 from './pages/Page404';

import axios, {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

axios.defaults.baseURL = "http://localhost:8000/";
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.withCredentials = true;
axios.interceptors.request.use(function(config){
    // https://stackoverflow.com/questions/69524573/why-config-headers-in-interceptor-is-possibly-undefined
    // https://stackoverflow.com/questions/70085215/how-to-fix-config-headers-authorization-object-is-possibly-undefined-when-usin
    config.headers = config.headers ?? {};
    const token = localStorage.getItem('auth_token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
});
// https://feeld-uni.com/entry/2022/04/11/141900
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
            swal({
                title: "Unauthorized",
                content: {
                    attributes: {
                        innerHTML: renderToStaticMarkup(
                            <React.Fragment>
                                <Button color="primary" variant="contained">Register</Button>
                                <Button color="primary" variant="contained">Login</Button>
                            </React.Fragment>
                        ),
                    },
                    element: "div",
                },
                icon: "info",
            })
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

function App(): React.ReactElement {
    return (
        <div>
            <GlobalNav />
            <Switch>
                {/* ここに、pathと対応するコンポーネントを書いていく */}
                <Route path='/' exact component={Top} />
                <Route path='/example' exact component={Example} />
                <Route path='/about' exact component={About} />
                <Route path='/register' exact component={Register} />
                <Route path='/login' exact component={Login} />
                <Route path='/user/:id' exact component={User} />
                <Route path='*' exact component={Page404} />
            </Switch>
        </div>
    );
}

ReactDOM.render((
<BrowserRouter>
    <App />
</BrowserRouter>
), document.getElementById('app'))
