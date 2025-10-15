import {useEffect, type ReactElement, useState, } from "react";
import { Navbar, NavbarBrand, Row, NavbarToggle, Container } from "react-bootstrap";
import { useNavigate } from "react-router";
import { validateAdminAuthState } from "../utils/Utils";
import { BoxArrowUpRight } from "react-bootstrap-icons";

export default function AdminBase(props: any): ReactElement{
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const isAuthenticated = validateAdminAuthState();
            setIsAuthenticated(isAuthenticated);
            
            if (!isAuthenticated){
                navigate("/admin/login");
            };

        }, 2000);

        return () => clearInterval(interval);
    }, []);
    
    return (
      <>
        <Navbar
          expand="md"
          className="bg-black py-1 position-fixed top-0 start-0 vw-100"
          style={{ zIndex: 400 }}
        >
          <Container className="flex-grow-1">
            <NavbarBrand
              href="/"
              style={{ color: "#AAA" }}
              className="d-flex justify-content-start gap-3 align-items-center ps-2 w-auto"
            >
              <span className="fs-2">Funnypaints Admin</span>
            </NavbarBrand>
            <NavbarToggle id="toggle-btn" />

            {/* <NavbarCollapse aria-controls="toggle-btn">
              <Nav>
                <NavItem>
                  <NavLink href="/" className="text-white">
                    Visit Site <BoxArrowUpRight size={18} color={"#FFF"} />
                  </NavLink>
                </NavItem>
              </Nav>
            </NavbarCollapse> */}
          </Container>
          <Container className="">
            <Row className="w-100 justify-content-end ps-4 align-items-center gap-3">
              <a
                href="/"
                target="_blank"
                className="text-white text-decoration-none w-auto d-flex align-items-center text-center gap-2"
              >
                Visit Site <BoxArrowUpRight size={18} color={"#FFF"} />
              </a>
              {isAuthenticated ? (
                <>
                  <button
                    className="btn btn-dark w-auto"
                    onClick={() => {
                      navigate("/admin/login");
                    }}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <></>
              )}
            </Row>
          </Container>
        </Navbar>
        {props.element}
      </>
    );
}