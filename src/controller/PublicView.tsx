import {type ReactElement } from "react";
import UserBase from "./UserBase";

export default function PublicView(props: any): ReactElement{
    return (
        <>
            <UserBase element={props.element} authenticated={props.authenticated}/>
        </>
    );
}