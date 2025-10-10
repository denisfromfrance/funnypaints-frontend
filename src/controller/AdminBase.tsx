import {useEffect, type ReactElement, useState, } from "react";
import { Navbar, NavbarBrand, Row, NavbarCollapse, Nav, NavItem, NavLink, NavbarToggle, Container } from "react-bootstrap";
import { FaBrush } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { validateAdminAuthState } from "../utils/Utils";

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
            <Navbar expand="md" className="bg-black py-1 position-fixed top-0 start-0 vw-100" style={{zIndex: 400}}>
                <Container>
                    <NavbarBrand 
                        href="/" 
                        style={{color: "#AAA"}} 
                        className="d-flex justify-content-start gap-3 align-items-center ps-0 w-auto ms-5">

                        <FaBrush color="#FFF" size={38} /> <span className="fs-2">Denis Mark Admin Portal</span>

                    </NavbarBrand>

                    <NavbarToggle id="toggle-btn" />

                    <NavbarCollapse aria-controls="toggle-btn">
                        <Nav>
                            <NavItem>
                                <NavLink href="/" className="text-white">Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/contact" className="text-white">Contact</NavLink>
                            </NavItem>
                        </Nav>
                    </NavbarCollapse>
                </Container>
                <Container>
                    <Row className="w-100 justify-content-end ps-4">
                        {isAuthenticated ?
                            <>
                                <a href="/profile" className="w-auto">
                                    <button className="btn btn-dark">Profile</button>
                                </a>
                                <button className="btn btn-dark w-auto" onClick={() => {
                                    navigate("/admin/login");
                                }}>Log Out</button>
                            </>
                        :
                            <>
                                <a href="/signup" className="w-auto">
                                    <button className="btn  btn-primary">
                                        Sign Up
                                    </button>
                                </a>
                                <a href="/admin/login" className="w-auto">
                                    <button className="btn btn-dark w-auto">Sign In</button>
                                </a>
                            </>
                        }
                    </Row>
                </Container>
            </Navbar>
            {props.element}
        </>
    );
}