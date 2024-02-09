import { Card, Tabs, Tab, Form, Row, Col, InputGroup, Button } from "react-bootstrap"
import { useEffect, useState } from "react"
import Router from "next/router"
import useRequest from "../hooks/use-request";
import Modals from "../components/Modal";

const auth_url = process.env.NEXT_PUBLIC_AUTH_BASE_URL;

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [username, setUsername] = useState('');

    let { doRequest : doRequestSignUp, errors : signUpError } = useRequest({
        url: auth_url + '/api/users/signup',
        method: 'post',
        body: {
            email, password, confirmedPassword, username
        },
        onSuccess: (data) => {
            window.alert('Sign Up Success');
            // await doRequestSignIn();
        } 
    });

    let { doRequest : doRequestSignIn, errors : signInError } = useRequest({
        url: auth_url + '/api/users/token',
        method: 'post',
        body: {
            username, password
        },
        onSuccess: (data) => {
            console.log(data);
            Router.push('/');
        }
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errors, setErrors] = useState(null);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleSignIn = async(e) => {
        e.preventDefault();
        await doRequestSignIn();
        console.log('sign in');
    }

    const handleSignUp = async(e) => {
        e.preventDefault();
        await doRequestSignUp();
        console.log('sign up');
    }

    const handlePasswordReset = (e) => {
        e.preventDefault();
        console.log('password reset');
        openModal();
    }

    const handlePasswordResetEmail = (e) => {
        e.preventDefault();
        console.log('password reset email');
    }

    const handleTrySearch = (e) => {
        e.preventDefault();
        Router.push('/');
    }

    useEffect(() => {
        if(signUpError){
            setErrors(signUpError);
        }
    }, [signUpError]);

    useEffect(() => {
        if(signInError){
            setErrors(signInError);
        }
    }, [signInError]);

    return (
        <div>
            <Modals isOpen={isModalOpen} onClose={closeModal}>
                <Form onSubmit={handlePasswordResetEmail} style={{margin: "5%"}}>
                    <Row>
                        <Form.Group as={Col} md="12" controlId="email_reset">
                            <Form.Label>Email</Form.Label>
                            <InputGroup>
                                <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Email"
                                    aria-describedby="inputGroupPrepend"
                                    required
                                    value = {email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    <br />
                    <Button type="submit" variant="primary">Send Password Reset Email</Button>
                </Form>
            </Modals>
            {errors && (
                <Modals isOpen={true} onClose={() => {
                    setErrors(null);
                }}>
                    {errors}
                </Modals>
            )}
            <div className="index_background">
            </div>
            <Row>
                <Col md="6">
                    <Card style={{width: '40%', marginLeft: '10%', marginTop: '10%', position: 'absolute'}}>
                        <Tabs>
                            <Tab eventKey="signin" title="Sign In">
                                <Form onSubmit={handleSignIn} style={{margin: "5%"}}>
                                    <Row>
                                        <Form.Group as={Col} md="12" controlId="email">
                                            <Form.Label>Email</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Email"
                                                    aria-describedby="inputGroupPrepend"
                                                    required
                                                    value = {email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Form.Group as={Col} md="12" controlId="password">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Password"
                                                required
                                                value = {password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col md="3">
                                            <Button type="submit" variant="primary">Sign In</Button>
                                        </Col>
                                        <Col md="1"></Col>
                                        <Col md="4">
                                            <Button variant="link" onClick={handlePasswordReset}>Forget Password</Button>
                                        </Col>
                                        <Col md="4">
                                            <Button variant="link" onClick={handleTrySearch}>Try Search Without Subscription</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Tab>
                            <Tab eventKey="signup" title="Sign Up">
                                <Form onSubmit={handleSignUp} style={{margin: "5%"}}>
                                    <Row>
                                        <Col md="6">
                                            <Form.Group as={Col} md="12" controlId="email">
                                                <Form.Label>Email</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Email"
                                                        aria-describedby="inputGroupPrepend"
                                                        required
                                                        value = {email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                        <Col md="6">
                                            <Form.Group as={Col} md="12" controlId="username">
                                                <Form.Label>Username</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="username"
                                                    required
                                                    value = {username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col md="6">
                                            <Form.Group as={Col} md="12" controlId="password">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Password"
                                                    required
                                                    value = {password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md="6">
                                            <Form.Group as={Col} md="12" controlId="confirmedPassword">
                                                <Form.Label>Confirmed Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Confirmed Password"
                                                    required
                                                    value = {confirmedPassword}
                                                    onChange={(e) => setConfirmedPassword(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Button type="submit" variant="primary">Sign Up</Button>
                                </Form>
                            </Tab>
                        </Tabs>
                    </Card>
                </Col>
                <Col md="6">
                    <div style={{margin: '10%', marginTop: "20%", color: 'white'}} className="index-slogan">
                        <h1>Ananogy</h1>
                        <br />
                        <h3>a comparison between two things, typically for the purpose of explanation or clarification</h3>
                        <br />
                        <h3 style={{float: "right"}}>-- Oxford Language</h3>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md="12" style={{textAlign: 'center', color: 'white'}}>
                    <h1 style={{position: "absolute", bottom: '10%', marginLeft: '30%', width: '40%'}}>Let's Build Analogy!</h1>
               </Col>
            </Row>
        </div>
    )
}

// LoginPage.getInitialProps = async () => {
//     return {}
// }

export default LoginPage