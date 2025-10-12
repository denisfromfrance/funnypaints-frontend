import {type ReactElement} from "react";
import { Col, Row } from "react-bootstrap";


export default function DialogBox(props: any): ReactElement {
  return (
    <Row
      className={
        (props.visible ? "d-flex" : "d-none") +
        " justify-content-center align-items-center position-fixed top-0 start-0 vh-100 vw-100"
      }
      style={{ zIndex: 100, backgroundColor: "#000A" }}
    >
      <Col xs={props.xs ? props.xs : 11} md={props.md ? props.md : 9} lg={props.lg ? props.lg : 7} className="rounded-2 bg-white p-3">
        <Row className="fs-3 fw-bold ps-3">{props.title}</Row>
        <Row className="pt-3 px-4">{props.children}</Row>
        <Row className="pt-3 px-4 justify-content-end gap-3">
          <button className="btn btn-primary w-auto" onClick={() => {
            props?.onPositiveButtonClicked();
          }}>
            {props.positiveText}
          </button>
          <button
            className="btn btn-danger w-auto"
            onClick={() => {
              props?.onNegativeButtonClick();
              props.setVisible(false);
            }}
          >
            CLOSE
          </button>
        </Row>
      </Col>
    </Row>
  );
}