import {useState, type ReactElement, useEffect, useRef } from "react";
import React from "react";
import { Navbar, NavbarBrand, Row, Col, NavbarCollapse, Nav, NavItem, NavLink, NavbarToggle, Container, Dropdown } from "react-bootstrap";
import { Cart4, EnvelopeAt, House, Telephone, Whatsapp } from "react-bootstrap-icons";
import { BsInstagram } from "react-icons/bs";
import { FaBrush } from "react-icons/fa6";
import { MdFacebook } from "react-icons/md";
import { RiTwitterXFill } from "react-icons/ri";

import "../pages/css/style.css";
import { Category } from "../state/Types";
import { GET } from "../utils/Utils";
import { GET_CART_ITEMS } from "../state/Constants";

export default function UserBase(props: {element: ReactElement, authenticated: boolean}): ReactElement{
  const [cartItems, setCartItems] = useState([]);
  const dropdownViewRef = useRef(null);
  const [categories, setCategories] = useState<Category[] | undefined | null>([]);

  const getCartData = async() => {
    GET(GET_CART_ITEMS, (response: any) => {
      if (response.data.status == "ok"){
        setCartItems(response.data.cart);
        console.log("Cart: ", response.data);
      }
    }, () => {});
  }

  const [expand, setExpand] = useState(false);

  const onReceiveCategoriesHandler = (data: any) => {
    setCategories(data);
    // alert("Data received!");
  }

  const handleOutsideClick = (event: MouseEvent) => {
    if (expand){
      if (dropdownViewRef.current){
        const eventTarget = (event.target as HTMLElement);
        // alert(eventTarget == dropdownViewRef.current);
        const children = (dropdownViewRef.current as HTMLElement).childNodes;
        let clickedInside = false;
        children.forEach(element => {
          if (element == eventTarget){
            clickedInside = true;
            return
          }
        });

        if (!clickedInside && eventTarget != dropdownViewRef.current){
          setExpand(false);
        }
      }
    }
  }

  const element = React.cloneElement(props.element, {onReceiveCategories: onReceiveCategoriesHandler, cartItems: cartItems});
  useEffect(() => {
    const interval = setInterval(() => {
      getCartData();
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    // setCartItems([]);
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <>
      <Navbar
        expand="md"
        className="bg-white py-1 py-lg-2 position-fixed top-0 start-0 w-100"
        style={{ zIndex: 400 }}
      >
        <Container className="d-flex gap-xl-5 justify-content-center">
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

          <NavbarCollapse aria-controls="toggle-btn" className="">
            <Nav className="gap-2 gap-lg-3 gap-xl-1">
              <NavItem>
                <NavLink href="/" className="">
                  <span className="text">Home</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/contact" className="">
                  <span className="text">Contact</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className=" d-flex flex-row gap-2 align-items-center"
                  onClick={() => {
                    setExpand(!expand);
                  }}
                >
                  <span className="text">Discover our collection</span>
                  <span
                    className={`down-arrow ${expand ? "point-up" : ""}`}
                  ></span>
                </NavLink>
              </NavItem>
              {/* <NavItem>
                <NavLink href="/order-an-art" className="">
                  <span className="text">Order</span>
                </NavLink>
              </NavItem> */}

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
            <Dropdown className="w-auto position-relative">
              <Dropdown.Toggle
                id="cart"
                className="border-0"
                style={{ background: "transparent" }}
              >
                <Cart4 color="#000" className="cart-icon" size={28} />
              </Dropdown.Toggle>
              <Dropdown.Menu className="">
                {cartItems.map((cartItem: any) => {
                  return (
                    <Dropdown.Item>
                      <img
                        src={cartItem?.modelImageURL}
                        width="50"
                        height="70"
                      />
                    </Dropdown.Item>
                  );
                })}
                <Row className="justify-content-center align-items-center">
                  <Col xs={12} className="px-4">
                    <a href="/cart" className="w-auto">
                      <button className="w-100 btn btn-primary">
                        Checkout
                      </button>
                    </a>
                  </Col>
                </Row>
              </Dropdown.Menu>
              <span
                className="position-absolute bottom-0 end-0 me-3 d-flex justify-content-center align-items-center text-white"
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#00AAFF",
                  borderRadius: "10px",
                  pointerEvents: "none",
                  fontSize: "12px",
                }}
              >
                {cartItems?.length}
              </span>
            </Dropdown>
            {props.authenticated ? (
              <>
                <a href="/profile" className="w-auto">
                  <button className="btn btn-dark text">Profile</button>
                </a>
                <a href="/signin" className="w-auto">
                  <button className="btn btn-dark w-auto text">Log Out</button>
                </a>
              </>
            ) : (
              <>
                <a href="/signup" className="w-auto">
                  <button className="btn  btn-primary text">Sign Up</button>
                </a>
                <a href="/signin" className="w-auto">
                  <button className="btn btn-dark w-auto text">Sign In</button>
                </a>
              </>
            )}
          </Row>
        </Container>
      </Navbar>
      <Row
        ref={dropdownViewRef}
        className={
          "filled-width-dropdown d-flex w-100 position-fixed mt-5 justify-content-center bg-black " +
          (expand ? `expand-dropdown` : "collapse-dropdown")
        }
        style={{ zIndex: 400 }}
      >
        <Col xs={12} md={6} className="py-5">
          <Row className="heading-6 text-white">
            <Col xs={6} className="pb-2">
              Categories
              <hr />
            </Col>
          </Row>
          <Row className=" text-decoration-none">
            <a
              href="/collection?category=animal"
              className=" text-decoration-none dropdown-link-text w-50"
            >
              Animal in suits
            </a>
            <a
              href="/collection?category=animal"
              className=" text-decoration-none dropdown-link-text"
            >
              Nature
            </a>
          </Row>
        </Col>
        {/* {JSON.stringify(cartItems)} */}
      </Row>
      {element}
      <Row className="bg-dark px-2 px-md-5" id="footer">
        <Col xs={12} className="">
          <Row className="px-5 py-5 justify-content-center justify-content-lg-start gap-5">
            <Col xs={12} md={3} lg={2}>
              <Row className="text-white-50 heading-5 justify-content-center justify-content-lg-start">
                Quick links
              </Row>
              <Row className="pt-4">
                <ul className=" list-unstyled text-white-50 text-center text-lg-start">
                  <a className=" text-decoration-none" href="#">
                    <li className="text">Home</li>
                  </a>
                  <a className=" text-decoration-none" href="#">
                    <li className="text">Gallery</li>
                  </a>
                  <a className=" text-decoration-none" href="#">
                    <li className="text">Request Drawing</li>
                  </a>
                  <a className=" text-decoration-none" href="#">
                    <li className="text">Contact</li>
                  </a>
                </ul>
              </Row>
            </Col>

            <Col xs={12} md={3} lg={2}>
              <Row className="text-white-50 heading-5 justify-content-center justify-content-lg-start">
                Contact Me
              </Row>
              <Row className="pt-4 align-items-center justify-content-center justify-content-lg-start">
                <Col xs={12} className="d-flex flex-column gap-2 text-white-50">
                  <Row className="gap-2">
                    <Col xs={1} className="">
                      <EnvelopeAt color="#888" size={24} className="w-auto" />
                    </Col>
                    <Col xs={10} className="text">
                      denismarcparet@gmail.com
                    </Col>
                  </Row>
                  <Row className="gap-2">
                    <Col xs={1}>
                      <Telephone color="#888" size={24} className="w-auto" />
                    </Col>
                    <Col xs={10} className="text">
                      12345356
                    </Col>
                  </Row>
                  <Row className="gap-2">
                    <Col xs={1}>
                      <House color="#888" size={24} className="w-auto" />
                    </Col>
                    <Col xs={10} className="text">
                      Address
                    </Col>
                  </Row>
                  <Row className="gap-2 justify-content-center pt-2">
                    <button className="btn whatsapp-button px-3 cta-button d-flex gap-2 justify-content-center align-items-center">
                      <Whatsapp size={24} className="font-icon" />
                      <span className="text w-auto">WhatsApp</span>
                    </button>
                  </Row>
                </Col>
              </Row>
            </Col>

            <Col xs={12} md={3} lg={2}>
              <Row className="text-white-50 heading-5 justify-content-center justify-content-lg-start">
                Social Media Links
              </Row>
              <Row className="pt-4 align-items-center justify-content-center justify-content-lg-start">
                <MdFacebook color="#888" size={34} className="w-auto" />
                <BsInstagram color="#888" size={28} className="w-auto" />
                <RiTwitterXFill color="#888" size={28} className="w-auto" />
              </Row>
            </Col>

            <Col xs={12} md={3} lg={2}>
              <Row className="text-white-50 heading-5 justify-content-center justify-content-lg-start">
                Legal
              </Row>
              <Row className="pt-4">
                <ul className=" list-unstyled text-white-50 text-center text-lg-start">
                  <li className="text">Copyright notice</li>
                  <li className="text">Terms & Privacy Policy</li>
                  <li className="text">Refund Policy & Shipping Policy</li>
                </ul>
              </Row>
            </Col>

            <Col xs={12} md={3} lg={2}>
              <Row className="pt-4">
                <a href="/#categories">
                  <button className="w-100 cta-button cta-button">
                    Order My Painting
                  </button>
                </a>
              </Row>
            </Col>
            <Col xs={12}>
              <Row>
                <Col xs={12}>
                  <Row className="text-white-50 heading-5 justify-content-center justify-content-lg-start">
                    Categories
                  </Row>
                  <Row className="text-white-50 gap-2 pt-3">
                    {/* {JSON.stringify(categories)} */}
                    {categories?.map((category) => {
                      return (
                        <a
                          href="#"
                          style={{}}
                          className="text-white-50 text-decoration-none text footer-category-text"
                        >
                          {category.category}
                        </a>
                      );
                    })}
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="text-white-50 px-4 justify-content-center justify-content-lg-start text-center pb-3 text">
            &copy;2025. Funnypaintings. All rights reserved.
          </Row>
        </Col>
      </Row>
    </>
  );
}