import { ReactElement, useEffect } from "react";
import { Col, Row } from "react-bootstrap";

import {POST, setAdminTokens} from "../../utils/Utils";

import "../css/style.css";
import { ADMIN_LOGIN_URL } from "../../state/Constants";
import { useNavigate } from "react-router";

export default function AdminLogin(): ReactElement{

    const navigate = useNavigate();

    const login = async(username: string, password: string) => {
        POST(ADMIN_LOGIN_URL, {username: username, password: password}, (response: any) => {
            const data = response.data;
            if (data.status == "ok"){
                const accessToken = data.access;
                const refreshToken = data.refresh;

                setAdminTokens(accessToken, refreshToken);
                navigate("/admin");
            }
        })
    }


    useEffect(() => {
        localStorage.clear();
    }, []);

    return (
        <Row className="py-5 justify-content-center align-items-center vh-100">
            <Col xs={12} md={4} className="pt-4 pb-3 px-3 mt-5 rounded-4 authentication-form">
                <Row className="fs-2 fw-bold justify-content-center text-center pb-4">
                    Admin SignIn
                </Row>
                <Row>
                    <Col xs={12}>
                        <Row>
                            <Col xs={12}>
                            <label>username</label>
                            <input type="text" className="form-control form-field" id="username" />
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={12}>
                                <label>Password</label>
                                <input type="password" className="form-control form-field" id="password"/>
                            </Col>
                        </Row>

                        <Row className="justify-content-end pt-3">
                            <Col xs={12} className="d-flex justify-content-end">
                                <button className="btn btn-dark w-auto" onClick={() => {
                                    const username = (document.getElementById("username") as HTMLInputElement).value;
                                    const password = (document.getElementById("password") as HTMLInputElement).value;
                                    login(username, password);
                                }}>Sign In</button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}