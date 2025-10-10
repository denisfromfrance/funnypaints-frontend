import { ReactElement, useEffect } from "react";
import { Col, Row } from "react-bootstrap";

import "./css/style.css";
import { useNavigate } from "react-router";
import { POST } from "../utils/Utils";
import { USER_ACCESS_TOKEN, USER_LOGIN_URL, USER_REFRESH_TOKEN } from "../state/Constants";

// import BackgroundImage from "../assets/ChatGPT Image Jul 4, 2025, 01_24_45 PM.png";

export default function SignIn(props: any): ReactElement{
    const navigate = useNavigate();

    const signIn = (email: string, password: string) => {
        POST(USER_LOGIN_URL, {
            email: email, 
            password: password
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

    useEffect(() => {
        localStorage.clear();
    }, []);
    return (
        <Row className="py-5 justify-content-center align-items-center vh-100 clipped-background" style={{}}>
            <Col md={4} className="d-none d-md-flex flex-column pe-5 text-white">
                <Row className="fs-3 fw-bold">
                    Welcome Back!
                    <hr/>
                </Row>
                <Row className=" fs-5 fw-semibold">
                    Discover the magic of hand-crafted art. Whether you're checking the progress of your custom painting or starting 
                    a new request, your creative journey continues here. Let's bring more moments to life—beautifully drawn, just for 
                    you.
                </Row>
            </Col>
            <Col xs={12} md={4} className="pt-4 pb-3 px-3 mt-5 rounded-4 authentication-form">
                <Row className="fs-2 fw-bold justify-content-center text-center pb-4">
                    SignIn
                </Row>
                <Row>
                    <Col xs={12}>
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

                        <Row className="justify-content-end pt-3">
                            <Col xs={12} className="d-flex justify-content-end">
                                <button className="btn btn-dark w-auto" onClick={() => {
                                    const email = (document.getElementById("email") as HTMLInputElement).value;
                                    const password = (document.getElementById("password") as HTMLInputElement).value;
                                    signIn(email, password);
                                }}>Sign In</button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}