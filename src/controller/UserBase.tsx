import {type ReactElement, } from "react";
import { Navbar, NavbarBrand, Row, Col, NavbarCollapse, Nav, NavItem, NavLink, NavbarToggle, Container } from "react-bootstrap";
import { EnvelopeAt, House, Telephone, Whatsapp } from "react-bootstrap-icons";
import { BsInstagram } from "react-icons/bs";
import { FaBrush } from "react-icons/fa6";
import { MdFacebook } from "react-icons/md";
import { RiTwitterXFill } from "react-icons/ri";

import "../pages/css/style.css";

export default function UserBase(props: any): ReactElement{
    return (
      <>
        <Navbar
          expand="md"
          className="bg-black py-1 position-fixed top-0 start-0 w-100"
          style={{ zIndex: 400 }}
        >
          <Container>
            <NavbarBrand
              href="/"
              style={{ color: "#AAA" }}
              className="d-flex justify-content-start gap-3 align-items-center ps-0 w-auto ms-5"
            >
              <FaBrush color="#FFF" size={38} />{" "}
              <span className="d-none d-md-flex fs-2">Funnypaints</span>
              <span className="d-flex d-md-none fs-4">Funnypaints</span>
            </NavbarBrand>

            <NavbarToggle id="toggle-btn" />

            <NavbarCollapse aria-controls="toggle-btn">
              <Nav>
                <NavItem>
                  <NavLink href="/" className="text-white">
                    Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/contact" className="text-white">
                    Contact
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/order-an-art" className="text-white">
                    Order
                  </NavLink>
                </NavItem>

                <NavItem className="d-flex d-md-none">
                  <NavLink href="/profile" className="text-white">
                    <button className="btn btn-dark">Profile</button>
                  </NavLink>
                </NavItem>

                <NavItem className="d-flex d-md-none">
                  <NavLink href="/signin" className="text-white">
                    <button className="btn btn-dark w-auto">Log Out</button>
                  </NavLink>
                </NavItem>
              </Nav>
            </NavbarCollapse>
          </Container>
          <Container>
            <Row className="w-100 justify-content-end ps-4 d-none d-md-flex">
              {props.authenticated ? (
                <>
                  <a href="/profile" className="w-auto">
                    <button className="btn btn-dark">Profile</button>
                  </a>
                  <a href="/signin" className="w-auto">
                    <button className="btn btn-dark w-auto">Log Out</button>
                  </a>
                </>
              ) : (
                <>
                  <a href="/signup" className="w-auto">
                    <button className="btn  btn-primary">Sign Up</button>
                  </a>
                  <a href="/signin" className="w-auto">
                    <button className="btn btn-dark w-auto">Sign In</button>
                  </a>
                </>
              )}
            </Row>
          </Container>
        </Navbar>
        {props.element}
        <Row className="bg-dark px-2 px-md-5">
          <Col xs={12} className="">
            <Row className="px-5 py-5 justify-content-center justify-content-lg-start gap-5">
              <Col xs={12} md={3} lg={2}>
                <Row className="text-white-50 fs-4 justify-content-center justify-content-lg-start">
                  Quick links
                </Row>
                <Row className="pt-4">
                  <ul className=" list-unstyled text-white-50 text-center text-lg-start">
                    <a className=" text-decoration-none" href="#">
                      <li>Home</li>
                    </a>
                    <a className=" text-decoration-none" href="#">
                      <li>Gallery</li>
                    </a>
                    <a className=" text-decoration-none" href="#">
                      <li>Request Drawing</li>
                    </a>
                    <a className=" text-decoration-none" href="#">
                      <li>Contact</li>
                    </a>
                  </ul>
                </Row>
              </Col>

              <Col xs={12} md={3} lg={2}>
                <Row className="text-white-50 fs-4 justify-content-center justify-content-lg-start">
                  Contact Me
                </Row>
                <Row className="pt-4 align-items-center justify-content-center justify-content-lg-start">
                  <Col xs={12} className="d-flex flex-column gap-2 text-white-50">
                    <Row className="gap-2">
                      <Col xs={1}>
                        <EnvelopeAt color="#888" size={24} className="w-auto" />
                      </Col>
                      <Col xs={10}>denismarcparet@gmail.com</Col>
                    </Row>
                    <Row className="gap-2">
                      <Col xs={1}>
                        <Telephone color="#888" size={24} className="w-auto" />
                      </Col>
                      <Col xs={10}>12345356</Col>
                    </Row>
                    <Row className="gap-2">
                      <Col xs={1}>
                        <House color="#888" size={24} className="w-auto" />
                      </Col>
                      <Col xs={10}>Address</Col>
                    </Row>
                    <Row className="gap-2 justify-content-center pt-2">
                      <button className="btn whatsapp-button px-3">
                        <Whatsapp size={24}/> WhatsApp
                      </button>
                    </Row>
                  </Col>
                </Row>
              </Col>

              <Col xs={12} md={3} lg={2}>
                <Row className="text-white-50 fs-4 justify-content-center justify-content-lg-start">
                  Social Media Links
                </Row>
                <Row className="pt-4 align-items-center justify-content-center justify-content-lg-start">
                  <MdFacebook color="#888" size={34} className="w-auto" />
                  <BsInstagram color="#888" size={28} className="w-auto" />
                  <RiTwitterXFill color="#888" size={28} className="w-auto" />
                </Row>
              </Col>

              <Col xs={12} md={3} lg={2}>
                <Row className="text-white-50 fs-4 justify-content-center justify-content-lg-start">
                  Legal
                </Row>
                <Row className="pt-4">
                  <ul className=" list-unstyled text-white-50 text-center text-lg-start">
                    <li>Copyright notice</li>
                    <li>Terms & Privacy Policy</li>
                    <li>Refund Policy & Shipping Policy</li>
                  </ul>
                </Row>
              </Col>

              <Col xs={12} md={3} lg={2}>
                <Row className="pt-4">
                  <button className="w-100 cta-button fs-5">Order My Painting</button>
                </Row>
              </Col>
            </Row>
            <Row className="text-white-50 px-4 justify-content-center justify-content-lg-start text-center pb-3">
              &copy;2025. Funnypaintings. All rights reserved.
            </Row>
          </Col>
        </Row>
      </>
    );
}