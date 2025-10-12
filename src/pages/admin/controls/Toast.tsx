import { ReactElement, useEffect, useRef } from "react";
import { Row } from "react-bootstrap";

export default function Toast(props: any): ReactElement{
  const toastContainer = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (toastContainer.current){
      toastContainer.current.style.opacity = "1";
    }

    const timeout = setTimeout(() => {
      if (toastContainer.current){
        toastContainer.current.style.opacity = "0";
      }
    }, 1500);

    return () => clearTimeout(timeout);

  }, [props.text]);
    return (
      <Row
        ref={toastContainer}
        className={"start-50 pt-5 position-fixed top-0 py-3 px-2 rounded-2"}
        style={{
          backgroundColor: "transparent",
          pointerEvents: "none",
          zIndex: 1000,
          transform: "translateX(-50%)",
          transition: "opacity 0.3s ease-in-out"
        }}
      >
          <span
            className={`${props.text ? "d-flex" : "d-none"} justify-content-center align-items-center rounded-2 w-auto h-auto px-4 py-3`}
            style={{ pointerEvents: "auto", backgroundColor: "#FFF", color: "#000" }}
          >
            {props?.text}
          </span>
      </Row>
    );
}