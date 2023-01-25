import { useState, useEffect, useRef } from "react";
import { useWindowDimensions } from "./WindowDimensions";

export const useNewPostSnackbarPosition = () => {
    const parent_ref = useRef(null);
    const [snackbar_position, setSnackbarPosition] = useState({top: 0, left: 0});
    const {width, height} = useWindowDimensions();
    const [snackbar_parent_dom_loading, setSnackbarParentDOMLoading] = useState<boolean>(true);

    useEffect(() => {
        if(parent_ref.current !== null) {
            const client_rect = (parent_ref.current as any).getBoundingClientRect();
            setSnackbarPosition({ top: client_rect.top, left: (client_rect.width / 2) });
            // setSnackbarPosition({ top: client_rect.top, left: client_rect.left + (client_rect.width / 2) });
        }

        const handleScroll = () => {
            if (parent_ref.current !== null) {
                const client_rect = (parent_ref.current as any).getBoundingClientRect();
                setSnackbarPosition({ top: client_rect.top, left: (client_rect.width / 2) });
                // setSnackbarPosition({ top: client_rect.top, left: client_rect.left + (client_rect.width / 2) });
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
    }, [snackbar_parent_dom_loading, parent_ref, width, height])

    return {
        snackbar_position,
        parent_ref,
        setSnackbarParentDOMLoading
    }
}