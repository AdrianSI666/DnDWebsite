import { useState } from 'react';
import { Button, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import JWTMenager from '../../../services/jwt/JWTMenager';
import { ApiError, AuthenticationControllerService } from '../../../services/openapi';
import './signup.css';
import useUserState from '../../../services/storage/UserStorage';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

function SignupPage() {
  const { setUser } = useUserState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [emailFeedback, setEmailFeedback] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [passwordMatchFeedback, setPasswordMatchFeedback] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [validPasswordConfirm, setValidPasswordConfirm] = useState(false);
  const navigate = useNavigate();
  async function register(registerData: RegisterData): Promise<void> {
    if (
      typeof registerData.email !== "string" ||
      registerData.email.length < 3
    ) {
      throw Error("Give proper email")
    }
    if (typeof registerData.password !== "string" || registerData.password.length < 1 || registerData.password.length > 255) {
      throw Error("Give proper password")
    }
    return AuthenticationControllerService.register({ name: registerData.username, email: registerData.email, password: registerData.password })
      .then(tokenRespone => {
        console.log(tokenRespone)
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
  // Email regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // Password regex pattern: Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,255}$/;

  const handleEmailChange = () => {
    if (!emailRegex.test(email)) {
      setEmailFeedback('Please enter a valid email address.');
      setValidEmail(false)
    } else {
      setEmailFeedback('');
      setValidEmail(true)
    }
  };

  const handlePasswordChange = () => {
    if (!passwordRegex.test(password)) {
      setPasswordFeedback(
        'Password must contain:\n -at least 8 characters,\n -at least 1 uppercase letter,\n -at least 1 lowercase letter,\n -at least 1 number,\n -at least 1 special character.'
      );
      setValidPassword(false)
      checkPasswords()
    } else {
      setPasswordFeedback('');
      setValidPassword(true)
      checkPasswords()
    }
  };

  const checkPasswords = () => {
    if (password !== confirmPassword) {
      setPasswordMatchFeedback("Passwords don't match")
      setValidPasswordConfirm(false);
    } else {
      setPasswordMatchFeedback('');
      setValidPasswordConfirm(true)
    }
  }

  return (
    <Container className="d-flex align-items-center justify-content-center mt-5">
      <Row className="w-100">
        <Col md={8} lg={6} className="mx-auto">
          <Card className="shadow-sm p-4 rounded-3">
            <Card.Body>
              <h2 className="text-center mb-4">Create an Account</h2>
              <Form onSubmit={(e) => {
                e.preventDefault();
                if (validEmail && validPassword && validPasswordConfirm) {
                  toast.promise(register({ username, email, password }).then(() => {
                    navigate("/cultures");
                  }).catch((err: ApiError) => {
                    let errorMessage = "Unexpected error, try again.";
                    if (err.status !== 500) errorMessage = err.body.message;
                    throw (errorMessage)
                  }), {
                    loading: 'Processing...',
                    success: `Sucesfully registered.`,
                    error: (err) => `Operation failed.\n ${err}`,
                  });
                } else {
                  toast.error("Please provide valid data.")
                }
              }}>
                <Form.Group controlId="formBasicUsername" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => handleEmailChange()}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      <div style={{ color: 'red' }}>{emailFeedback}</div>
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      required
                      onBlur={() => {
                        handlePasswordChange()
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      <div style={{ color: 'red' }}>{passwordFeedback}</div>
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => {
                        checkPasswords()
                      }}
                      required
                    />
                  </InputGroup>
                  <Form.Control.Feedback type="invalid">
                    <div style={{ color: 'red' }}>{passwordMatchFeedback}</div>
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Sign Up
                </Button>
              </Form>

              <div className="text-center mt-3">
                <Link to={'/login'}>Already have an account?</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SignupPage;