// hooks/useLoadScript.ts
import { useState, useEffect } from "react";

export const useLoadScript = (src: string) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (document.querySelector(`script[src="${src}"]`)) {
            setLoaded(true);
            return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => setLoaded(true);
        document.body.appendChild(script);
    }, [src]);

    return loaded;
};
