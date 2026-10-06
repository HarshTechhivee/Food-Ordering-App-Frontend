import { useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import { fetchCurrentUser, clearAuth } from "../../store/slices/authSlice";
import { setAuthFailureHandler } from "../../services/api";

function AuthInitializer() {

    const dispatch = useAppDispatch();

    // Restore existing session
    useEffect(() => {

        dispatch(fetchCurrentUser());

    }, [dispatch]);


    // Handle permanent authentication failure
    useEffect(() => {

        setAuthFailureHandler(() => {
            dispatch(clearAuth());
        });


        return () => {
            setAuthFailureHandler(null);
        };

    }, [dispatch]);

    return null;
}

export default AuthInitializer;