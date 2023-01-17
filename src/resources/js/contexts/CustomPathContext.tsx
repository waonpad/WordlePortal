import React, {useContext, createContext, useState, ReactNode, useEffect } from "react";
import { useLocation, useParams } from 'react-router-dom';

export type customPath = {
    path: string;
    route_path: string;
    params: any;
}

export type customPathData = {
    path: customPath;
    changePath: (path_data: {
        path: string;
        route_path: string;
        params: any;
    }) => void;
}

const customPathContext = createContext<customPathData | null>(null);

type Props = {
    children: ReactNode
}

const ProvideCustomPath = ({children}: Props) => {
    const custom_path = useProvideCustomPath();
    return (
        <customPathContext.Provider value={custom_path}>
            {children}
        </customPathContext.Provider>
    )
}
export default ProvideCustomPath

export const useCustomPath = () => {
    return useContext(customPathContext)
}

const useProvideCustomPath = () => {
    const location = useLocation();

    const [path, setPath] = useState<any>({
        path: location.pathname,
        route_path: '',
        params: {}
    });

    const changePath = (path_data: {path: string, route_path: string, params: object}) => {
        console.log('set path data');

        console.log(path_data);
        setPath({
            path: path_data.path,
            route_path: path_data.route_path,
            params: path_data.params
        })
    }

    return {
        path,
        changePath
    }
}