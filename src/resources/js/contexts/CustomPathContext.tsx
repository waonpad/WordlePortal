import axios from 'axios';
import { useAuth } from "./AuthContext";
import React, {useContext, createContext, useState, ReactNode, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useErrorHandler } from 'react-error-boundary';

export type customPathData = {
    path: string;
    changePath: (target_path: string) => void;
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

    const [path, setPath] = useState<string>(location.pathname);

    useEffect(() => {
        console.log(location);
        setPath(location.pathname);
    }, [location]);

    const changePath = (target_path: string) => {
        setPath(target_path)
    }

    return {
        path,
        changePath
    }
}