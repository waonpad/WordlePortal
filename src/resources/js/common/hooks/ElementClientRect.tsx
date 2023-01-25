import { useState, useEffect, useRef } from "react";
import { useWindowDimensions } from "./WindowDimensions";

type ClientRect = {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
} | null;

export const useElementClientRect = () => {
    const ref = useRef(null);
    const {width, height} = useWindowDimensions();
    const [dom_loading, setDOMLoading] = useState<boolean>(true);
    const [client_rect, setClientRect] = useState<ClientRect>(null);

    const getClientRect = () => {
        if(ref.current !== null) {
            const client_rect = (ref.current as any).getBoundingClientRect();
            setClientRect(client_rect);
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            getClientRect()
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
    }, [])

    useEffect(() => {
        getClientRect()
    }, [dom_loading, ref, width, height])

    return {
        ref,
        client_rect,
        setDOMLoading
    }
}