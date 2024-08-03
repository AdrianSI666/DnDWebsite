
import { Button, Form } from "react-bootstrap";
import login from "./login"
import toast from "react-hot-toast";
import { useState } from "react";
import { ApiError } from "../../../services/openapi/core/ApiError";

export function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    return <div>
        <h1>Sign in</h1>
        <Form onSubmit={(e) => {
            e.preventDefault();
            login({ email, password }).then((res) => {
                if(res.error) {
                    toast.error(res.error)
                }
            }).catch((err: ApiError) => {
                toast.error(err.message)
                toast.error("Wrong password")
            })
        }}>
            <Form.Group className="mb-3" controlId="formBasicText">
                <Form.Label>Email</Form.Label>
                <Form.Control value={email} type="email" onChange={e => setEmail(e.target.value)} />
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