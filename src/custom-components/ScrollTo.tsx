import {type ReactElement, useEffect, useState} from "react";

export default function ScrollTo(props: any) : ReactElement {
    const [target, setTarget] = useState<string>("");
    useEffect(() => {
        setTarget(props.target);
    }, []);
    return <span className="w-auto px-0" onClick={() => {
        const targetElement = document.getElementById(target);
        targetElement?.scrollIntoView({ behavior: "smooth" });
    }}>{props.children}</span>;
}