
import { Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import { useState } from "react";
import { ApiError } from "../../../services/openapi/core/ApiError";
import { AuthenticationControllerService } from '../../../services/openapi';
import { isExpired, decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";
import JWTMenager from "../../../services/jwt/JWTMenager";
interface ActionResult {
    error?: string;
}

interface LoginData {
    email: string;
    password: string
}

interface jwtData {
    exp: number,
    isst: number,
    sub: string,
    userId: number
}

export function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();
    async function login(loginData: LoginData): Promise<ActionResult> {
        // if (
        //     typeof loginData.email !== "string" ||
        //     loginData.email.length < 3 ||
        //     loginData.email.length > 31 ||
        //     !/^[a-z0-9_-]+$/.test(loginData.email)
        // ) {
        //     return {
        //         error: "Invalid username"
        //     };
        // }
        // if (typeof loginData.password !== "string" || loginData.password.length < 6 || loginData.password.length > 255) {
        //     return {
        //         error: "Invalid password"
        //     };
        // }
        AuthenticationControllerService.authenticate({ email: loginData.email, password: loginData.password })
            .then(tokenRespone => {
                if (tokenRespone.token && tokenRespone.refreshToken && tokenRespone.userId) {
                    const myDecodedToken: jwtData | null = decodeToken(tokenRespone.token);
                    //const isMyTokenExpired = isExpired(tokenRespone.token);
                    if (myDecodedToken) {
                        JWTMenager.setToken(tokenRespone.token)
                        JWTMenager.setUser(tokenRespone.userId)
                        JWTMenager.setRefreshToken(tokenRespone.refreshToken)
                        navigate("/cultures")
                    }
                } else {
                    return {
                        error: "Wrong password"
                    };
                }
            })
        return {};
    }

    return <div>
        <h1>Log in</h1>
        <Form onSubmit={(e) => {
            e.preventDefault();
            login({ email, password }).then((res) => {
                if (res.error) {
                    toast.error(res.error)
                }
            }).catch((err: ApiError) => {
                toast.error(err.message)
                toast.error("Wrong password")
            })
        }}>
            <Form.Group className="mb-3" controlId="formBasicText">
                <Form.Label>Email</Form.Label>
                <Form.Control value={email} type="text" onChange={e => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicText">
                <Form.Label>Password</Form.Label>
                <Form.Control value={password} type="password" onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">
                Login
            </Button>
        </Form>
    </div >
}