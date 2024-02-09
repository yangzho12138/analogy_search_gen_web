import { Card, Tabs, Tab, Form, Row, Col, InputGroup, Button } from "react-bootstrap"
import { useState } from "react"
import Router from "next/router"
import useRequest from "../hooks/use-request";
import Modals from "../components/Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const prompts = [
    'P1: Explain <target> using an analogy.',
    'P2: Create an analogy to explain <target>.',
    'P3: Using an analogy, explain <target>.',
    'P4: What analogy is used to explain <target>?',
    'P5: Use an analogy to explain <target>.'
]

const temps = [
    '0.0',
    '0.1',
    '0.2',
    '0.3',
    '0.4',
    '0.5',
    '0.6',
    '0.7',
    '0.8',
    '0.9',
    '1.0'
]

export default () => {

    const [searchText, setSearchText] = useState('')
    const [prompt, setPrompt] = useState('')
    const [temp, setTemp] = useState('')

    const [searchResults, setSearchResults] = useState(null)
    
    const doSearch = () => {

    }
    return (
        <div style={{marginTop: "3%"}}>
            <Row>
                <Col md={3} className="text-center">
                    Analego Logo
                </Col>
                <Col md={6}>
                    <Form onSubmit={doSearch}>
                        <Row>
                            <Form.Group as={Col} md="8" controlId="searchText">
                                <InputGroup>
                                    <InputGroup.Text id="inputGroupPrepend"><FontAwesomeIcon icon={faMagnifyingGlass} /></InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search your analogy ..."
                                            aria-describedby="inputGroupPrepend"
                                            required
                                            value = {searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Col md="2">
                                <Button type="submit" variant="primary">Search</Button>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col md="4">
                                <Form.Select
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                >
                                    <option>Prompt...</option>
                                    {prompts.map((prompt, index) => {
                                        return <option key={index} value={prompt}>{prompt}</option>
                                    })}
                                </Form.Select>
                            </Col>
                            <Col md="4">
                                <Form.Select
                                    value={temp}
                                    onChange={(e) => setTemp(e.target.value)}
                                >
                                    <option>Temperature...</option>
                                    {temps.map((temp, index) => {
                                        return <option key={index} value={temp}>{temp}</option>
                                    })}
                                </Form.Select>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col md={3}>
                    <Button variant="primary" onClick={() => Router.push('/login')}>Generate Analogies</Button>
                </Col>
            </Row>
            <br />
            <Row>
                <Card style={{margin: '2%'}}>
                    <Card.Body style={{height: '70vh'}}>
                        {searchResults == null || searchResults == [] ? (
                            <div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'grey'}}>
                                <h1>Oops, No Analogy Found ...</h1>
                                <h3>Search Again or Generate Analogy</h3>
                            </div>
                        ) : (
                            <>
                                {searchResults.map((result, index) => {
                                    return (
                                        <Card key={index} style={{margin: '1%'}}>
                                            
                                        </Card>
                                    )
                                })}
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Row>
        </div>
    )
}