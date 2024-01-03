import { Card, Tabs, Tab, Form, Row, Col, InputGroup, Button } from "react-bootstrap"
import { useState } from "react"
import useRequest from "../hooks/use-request";

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSignIn = (e) => {
        e.preventDefault();
        console.log('sign in');
    }

    const handleSignUp = (e) => {
        e.preventDefault();
        console.log('sign up');
    }

    return (
        <div>
            <div
            style={{
                position: 'absolute',
                height: '100vh',
                width: '100vw',
                backgroundImage: 'url("https://bgsauiuc.files.wordpress.com/2020/07/763-1.jpg?w=736")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(8px)',
                zIndex: '-1',
            }}>
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
                                    <Button type="submit" variant="primary">Sign In</Button>
                                </Form>
                            </Tab>
                            <Tab eventKey="signup" title="Sign Up">
                                <Form onSubmit={handleSignUp} style={{margin: "5%"}}>
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
                                    </Row>
                                    <br />
                                    <Button type="submit" variant="primary">Sign Up</Button>
                                </Form>
                            </Tab>
                        </Tabs>
                    </Card>
                </Col>
                <Col md="6">
                    <div style={{margin: '10%', marginTop: "20%", color: 'white'}}>
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