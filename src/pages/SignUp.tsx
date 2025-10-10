import { ReactElement } from "react";
import { Col, Row } from "react-bootstrap";

import "./css/style.css";
import { POST } from "../utils/Utils";
import { USER_ACCESS_TOKEN, USER_REFRESH_TOKEN, USER_SIGN_UP_URL } from "../state/Constants";
import { useNavigate } from "react-router";
import BackgroundImage from "../assets/ChatGPT Image Jul 4, 2025, 01_24_12 PM.webp";

export default function SignUp(props: any): ReactElement{
    const navigate = useNavigate();
    const signUp = (firstName: string, lastName: string, email: string, password: string, confirmationPassword: string, phone: string) => {
        POST(USER_SIGN_UP_URL, {
            firstName: firstName, 
            lastName: lastName, 
            email: email, 
            password: password, 
            confirmationPassword: confirmationPassword, 
            phone: phone
        }, (response: any) => {
            if (response.data.status == "ok"){
                localStorage.setItem(USER_ACCESS_TOKEN, response.data.access);
                localStorage.setItem(USER_REFRESH_TOKEN, response.data.refresh);
                props.setAuthenticated(true);
                navigate("/");
            }
        }, (response: any) => {
            console.log(response);
        });
    }
    return (
        <Row className="py-5 justify-content-center align-items-center vh-100" style={{background: `url('${BackgroundImage}')`, backgroundSize: "cover"}}>
            <Col md={4} className="d-none d-md-flex flex-column text-white me-5 rounded-2 p-4" style={{backgroundColor: "#0003"}}>
                <Row className="fs-3 fw-semibold">
                    Join the Creative Journey
                    <hr/>
                </Row>
                <Row className="fs-5">
                    Turn your favorite memories into timeless hand-drawn art. Upload a photo, and our artist will bring it to life 
                    with every brushstroke. Sign up now to start your first custom artwork request — it only takes a moment to begin 
                    something beautiful.
                </Row>
            </Col>
            <Col xs={12} md={4} className="pt-4 pb-3 px-3 mt-5 rounded-4 authentication-form">
                <Row className="fs-2 fw-bold justify-content-center text-center pb-4">
                    SignUp
                </Row>
                <Row>
                    <Col xs={12}>
                        <Row>
                            <Col xs={6}>
                                <label>First Name</label>
                                <input type="text" className="form-control" id="firstName"/>
                            </Col>
                            <Col xs={6}>
                                <label>Last Name</label>
                                <input type="text" className="form-control" id="lastName"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                            <label>Email</label>
                            <input type="email" className="form-control" id="email"/>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={12}>
                                <label>Password</label>
                                <input type="password" className="form-control" id="password"/>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={12}>
                                <label>Confirm Password</label>
                                <input type="password" className="form-control" id="confirmationPassword"/>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={12}>
                                <label>Phone Number</label>
                                <input type="text" className="form-control" id="phoneNumber"/>
                            </Col>
                        </Row>

                        <Row className="justify-content-end pt-3">
                            <Col xs={12} className="d-flex justify-content-end">
                                <button className="btn btn-dark w-auto" onClick={() => {
                                    const firstName = (document.getElementById("firstName") as HTMLInputElement).value;
                                    const lastName = (document.getElementById("lastName") as HTMLInputElement).value;
                                    const email = (document.getElementById("email") as HTMLInputElement).value;
                                    const password = (document.getElementById("password") as HTMLInputElement).value;
                                    const confirmationPassword = (document.getElementById("confirmationPassword") as HTMLInputElement).value;
                                    const phoneNumber = (document.getElementById("phoneNumber") as HTMLInputElement).value;
                                    signUp(
                                        firstName,
                                        lastName,
                                        email,
                                        password,
                                        confirmationPassword,
                                        phoneNumber
                                    );
                                }}>Sign Up</button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}