import { useEffect } from "react";

export function useKey(key, action) {
    useEffect(function () {
        //     if (userRating) countRef.current++;
        // }, [userRating])

        function callback(e) {
            if (e.code.toLowerCase() === key.toLowerCase()) {
                action();
            }
        }
        document.addEventListener("keydown", callback);
        return function () {
            document.removeEventListener("keydown", callback);
        };


    }, [action, key])

}