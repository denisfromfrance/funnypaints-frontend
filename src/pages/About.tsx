import { type ReactElement } from "react";
import {Col, Row} from "react-bootstrap"

import ArtistImage from "../assets/291359624_129762163076826_7279871603601454790_n.jpg";

export default function About(): ReactElement{
    return (
      <Row className="justify-content-center pt-4 text-white">
        <Col
          xs={12}
          lg={5}
          xxl={3}
          className="pt-3 d-flex justify-content-center "
        >
          <div
            className="move-up-on-visible move-up-on-visible-animate"
            style={{
              width: "300px",
              height: "300px",
              borderRadius: "10px",
              backgroundImage: `url('${ArtistImage}')`,
              backgroundSize: "cover",
            }}
          ></div>
        </Col>
        <Col
          xs={10}
          lg={7}
          xxl={3}
          className="d-flex flex-column justify-content-center text-left pt-3 fs-5"
        >
          <Row className="heading-5 fw-bold pb-4 justify-content-center justify-content-lg-start">
            Meet the Artist
          </Row>
          <Row className="flex-column justify-content-center justify-content-center justify-content-lg-start text-center text-lg-start pb-5 pb-lg-1 paragraph">
            "Hi, I'm Denis Mark, a passionate artist with a love for capturing
            life's moments in pencil and brush. With over [X years] of
            experience, I've transformed hundreds of photos into timeless
            artwork."
          </Row>
        </Col>
      </Row>
    );
}