import {type ReactElement, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import UserBase from "./UserBase";
import { validateUserAuthState } from "../utils/Utils";

export default function ProtectedView(props: any): ReactElement{
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const isAuthenticatedRef = useRef(isAuthenticated);
    const setIsAuthenticatedRef = (data: boolean) => {
        setIsAuthenticated(data);
        isAuthenticatedRef.current = data;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const isAuthenticated = validateUserAuthState();
            setIsAuthenticatedRef(isAuthenticated);
            props.setAuthenticated(isAuthenticated);
            if (!isAuthenticated){
                navigate("/signin");
            }
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <UserBase element={props.element} authenticated={props.authenticated}/>
        </>
    );
}