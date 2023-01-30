import { useState, useEffect } from "react";

export const useWindowDimensions = () => {
    const getWindowDimensions = () => {
        const { innerWidth: width, innerHeight: height } = window;

        const 
            xs = 0,
            sm = 600,
            smd = 769,
            md = 900,
            lg = 1200,
            xl = 1536
        ;

        const breakpoint = xs <= width && width < sm ? 'xs' :
                            sm <= width && width < smd ? 'sm' :
                            smd <= width && width < md ? 'smd' :
                            md <= width && width < lg ? 'md' :
                            lg <= width && width < xl ? 'lg' :
                            xl <= width && width ? 'xl' :
                            undefined;

        // console.log({width, height, breakpoint});

        return {
            width,
            height,
            breakpoint
        };
    };

    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    );

    useEffect(() => {
        const onResize = () => {
            setWindowDimensions(getWindowDimensions());
        };

        window.addEventListener("resize", onResize);

        return () => window.removeEventListener("resize", onResize);
    }, []);
    
    return windowDimensions;
};