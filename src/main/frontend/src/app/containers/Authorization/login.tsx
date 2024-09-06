
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import JWTMenager from "../../../services/jwt/JWTMenager";
import { AuthenticationControllerService } from '../../../services/openapi';
import { ApiError } from "../../../services/openapi/core/ApiError";
import useUserState from "../../../services/storage/UserStorage";
interface LoginData {
    email: string;
    password: string
}

export function LoginPage() {
    const { setUser } = useUserState();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();
    async function login(loginData: LoginData): Promise<void> {
        if (
            typeof loginData.email !== "string" ||
            loginData.email.length < 3
        ) {
            throw Error("Give proper email")
        }
        if (typeof loginData.password !== "string" || loginData.password.length < 1 || loginData.password.length > 255) {
            throw Error("Give proper password")
        }
        return AuthenticationControllerService.authenticate({ email: loginData.email, password: loginData.password })
            .then(tokenRespone => {
                if (tokenRespone.token && tokenRespone.refreshToken && tokenRespone.userId && tokenRespone.expTime) {
                    JWTMenager.setToken(tokenRespone.token)
                    setUser(tokenRespone.userId)
                    JWTMenager.setRefreshToken(tokenRespone.refreshToken)
                    JWTMenager.setExpirationTime(tokenRespone.expTime)
                } else {
                    throw Error("Can't connect to server, try again later.")
                }
            })
    }

    return <Container className="d-flex align-items-center justify-content-center mt-5">
        <Row className="w-100">
            <Col md={8} lg={6} className="mx-auto">
                <Card className="shadow-sm p-4 rounded-3">
                    <Card.Body>
                        <h2 className="text-center mb-4">Log in</h2>
                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            toast.promise(login({ email, password }).then(() => {
                                navigate("/cultures");
                            }).catch((err: ApiError) => {
                                let errorMessage = "Unexpected error, try again.";
                                if (err.status !== 500) errorMessage = "Wrong password";
                                console.log(err)
                                throw (errorMessage)
                            }), {
                                loading: 'Processing...',
                                success: `Logged in.`,
                                error: (err) => `${err}`,
                            });
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
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
}