import React, { useState } from 'react';
import { Card, Form, Row, Col, Button, Tooltip, OverlayTrigger } from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'


const gen_prompts = [
    'What analogy is used to explain <target>?',
    'Use an analogy to explain <target>.',
    'Create an analogy to explain <target>.',
    'Explain <target> using an analogy.',
    'Using an analogy, explain <target>.',
    'Explain <target> using an analogy involving <src>.',
    'Explain how <target> is analogous to <src>.',
    'Explain how <target> is like <src>.',
    'Explain how <target> is similar to <src>.',
    'How is <target> analogous to <src>?',
    'How is <target> like <src>?',
    'How is <target> similar to <src>?',
]

const link_title = {
    "openAIKey": "If you don't have one, you can leave it blank and we will provide one for you.",
    "target": "The concept that you would like to generate an analogy for (e.g. cell).",
    "src": "The topic area that you would like the analogy to be about",
    "prompt": "Prompt",
    "tmp": "Randomness",
    "max_length": "Maxium Length",
    "top_p": "Top P",
    "freq_penalty": "Frequency Penalty",
    "pres_penalty": "Presence Penalty",
    "best_of": "Best Of"
}

const GenPage = () => {
    const Link = ({ id, children, title }) => (
        <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
          {children}
        </OverlayTrigger>
      );

    const [openAIKey, setOpenAIKey] = useState("");
    const [target, setTarget] = useState("");
    const [src, setSrc] = useState("");
    const [prompt, setPrompt] = useState(gen_prompts[0]);
    const [temp, setTemp] = useState(0.0);
    const [max_length, setMaxLength] = useState(0);
    const [top_p, setTopP] = useState(1.0);
    const [freq_penalty, setFreqPenalty] = useState(0.0);
    const [pres_penalty, setPresPenalty] = useState(0.0);
    const [best_of, setBestOf] = useState(1);

    const [generateResult, setGenerateResult] = useState("dcbuasvcahsvcweivwehcbqkcjbqkcbjqwcwejbjqhcvajsvchasjvchascvahsca");

    const [searchQuery, setSearchQuery] = useState('');
    const [options] = useState(gen_prompts);
    const filteredOptions = options.filter(option => 
        option.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const generate = () => {
    }

    const saveAnalogy = () => {
    }

    return (
        <div style={{margin: "3%"}}>
            <Row>

            </Row>
            <Card style={{margin: '5%'}}>
                <Card.Body>
                    <Form onSubmit={generate}>
                        <Row>
                            <Form.Group as={Row} md="8" controlId="openAIKey">
                                <Form.Label column sm='6'>OpenAI API Key <Link title={link_title['openAIKey']}><FontAwesomeIcon icon={faCircleQuestion} /></Link></Form.Label>
                                <Col sm='6'>
                                    <Form.Control
                                        type="text"
                                        // placeholder="Leave blank if you don't have one, we will provide one for you."
                                        value = {openAIKey}
                                        onChange={(e) => setOpenAIKey(e.target.value)}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>
                        <br />
                        <Row>
                            <Form.Group as={Row} md="8" controlId="target">
                                <Form.Label column sm='6'>Target Concept <Link title={link_title['target']}><FontAwesomeIcon icon={faCircleQuestion} /></Link></Form.Label>
                                <Col sm='6'>
                                    <Form.Control
                                        type="text"
                                        value = {target}
                                        onChange={(e) => setTarget(e.target.value)}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>
                        <br />
                        <Row>
                            <Form.Group as={Row} md="8" controlId="src">
                                <Form.Label column sm='6'>Source Concept (Optional) <Link title={link_title['src']}><FontAwesomeIcon icon={faCircleQuestion} /></Link></Form.Label>
                                <Col sm='6'>
                                    <Form.Control
                                        type="text"
                                        value = {src}
                                        onChange={(e) => setSrc(e.target.value)}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>
                        <br />
                        <Row>
                            <Form.Group as={Row} md="8" controlId="prompt">
                                <Form.Label column sm='6'>Prompt <Link title={link_title['prompt']}><FontAwesomeIcon icon={faCircleQuestion} /></Link></Form.Label>
                                <Col sm='6'>
                                    <Form.Control
                                        type="text" 
                                        placeholder="Search prompt..."
                                        value={searchQuery} 
                                        onChange={(e) => setSearchQuery(e.target.value)} 
                                        style={{marginBottom: "1%"}}
                                    />
                                    <Form.Select
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                    >
                                        {filteredOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                        </Row>
                        <br />
                        <Row>
                            <Form.Group as={Row} md="8" controlId="tmp">
                                <Form.Label column sm='6'>Randomness <Link title={link_title['tmp']}><FontAwesomeIcon icon={faCircleQuestion} /></Link></Form.Label>
                                <Col sm='4'>
                                    <Form.Control
                                        style={{ border: 'none' }}
                                        type="range"
                                        value={temp}
                                        onChange={(e) => {
                                            setTemp(parseFloat(e.target.value));
                                        }}
                                        min="0"
                                        max="1"
                                        step="0.1"
                                    />
                                </Col>
                                <Col sm='2'>
                                    <Form.Control
                                        type="number"
                                        value={temp}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            if (val >= 0.0 && val <= 1.0) {
                                                setTemp(val);
                                            }
                                        }}
                                        min="0"
                                        max="1"
                                        step="0.1"
                                    />
                                </Col>
                            </Form.Group>
                        </Row>
                        <br />
                        <Row>
                            <Form.Group as={Row} md="8" controlId="max_length">
                                <Form.Label column sm='6'>Maxium Length <Link title={link_title['max_length']}><FontAwesomeIcon icon={faCircleQuestion} /></Link></Form.Label>
                                <Col sm='4'>
                                    <Form.Control
                                        style={{ border: 'none' }}
                                        type="range"
                                        value={max_length}
                                        onChange={(e) => {
                                            setMaxLength(parseFloat(e.target.value));
                                        }}
                                        min="0"
                                        max="4000"
                                        step="1"
                                    />
                                </Col>
                                <Col sm='2'>
                                    <Form.Control
                                        type="number"
                                        value={max_length}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            if (val >= 0.0 && val <= 4000.0) {
                                                setMaxLength(val);
                                            }
                                        }}
                                        min="0"
                                        max="4000"
                                        step="1"
                                    />
                                </Col>
                            </Form.Group>
                        </Row>
                        <br />
                        <Row>
                            <Form.Group as={Row} md="8" controlId="top_p">
                                <Form.Label column sm='6'>Top P <Link title={link_title['top_p']}><FontAwesomeIcon icon={faCircleQuestion} /></Link></Form.Label>
                                <Col sm='4'>
                                    <Form.Control
                                        style={{ border: 'none' }}
                                        type="range"
                                        value={top_p}
                                        onChange={(e) => {
                                            setTopP(parseFloat(e.target.value));
                                        }}
                                        min="0"
                                        max="1"
                                        step="0.1"
                                    />
                                </Col>
                                <Col sm='2'>
                                    <Form.Control
                                        type="number"
                                        value={top_p}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            if (val >= 0.0 && val <= 1.0) {
                                                setTopP(val);
                                            }
                                        }}
                                        min="0"
                                        max="1"
                                        step="0.1"
                                    />
                                </Col>
                            </Form.Group>
                        </Row>
                        <br />
                        <Row>
                            <Form.Group as={Row} md="8" controlId="freq_penalty">
                                <Form.Label column sm='6'>Frequency Penalty <Link title={link_title['freq_penalty']}><FontAwesomeIcon icon={faCircleQuestion} /></Link></Form.Label>
                                <Col sm='4'>
                                    <Form.Control
                                        style={{ border: 'none' }}
                                        type="range"
                                        value={freq_penalty}
                                        onChange={(e) => {
                                            setFreqPenalty(parseFloat(e.target.value));
                                        }}
                                        min="0"
                                        max="1"
                                        step="0.1"
                                    />
                                </Col>
                                <Col sm='2'>
                                    <Form.Control
                                        type="number"
                                        value={freq_penalty}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            if (val >= 0.0 && val <= 1.0) {
                                                setFreqPenalty(val);
                                            }
                                        }}
                                        min="0"
                                        max="1"
                                        step="0.1"
                                    />
                                </Col>
                            </Form.Group>
                        </Row>
                        <br />
                        <Row>
                            <Form.Group as={Row} md="8" controlId="pres_penalty">
                                <Form.Label column sm='6'>Presence Penalty  <Link title={link_title['pres_penalty']}><FontAwesomeIcon icon={faCircleQuestion} /></Link></Form.Label>
                                <Col sm='4'>
                                    <Form.Control
                                        style={{ border: 'none' }}
                                        type="range"
                                        value={pres_penalty}
                                        onChange={(e) => {
                                            setPresPenalty(parseFloat(e.target.value));
                                        }}
                                        min="0"
                                        max="1"
                                        step="0.1"
                                    />
                                </Col>
                                <Col sm='2'>
                                    <Form.Control
                                        type="number"
                                        value={pres_penalty}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            if (val >= 0.0 && val <= 1.0) {
                                                setPresPenalty(val);
                                            }
                                        }}
                                        min="0"
                                        max="1"
                                        step="0.1"
                                    />
                                </Col>
                            </Form.Group>
                        </Row>
                        <br />
                        <Row>
                            <Form.Group as={Row} md="8" controlId="best_of">
                                <Form.Label column sm='6'>Best Of  <Link title={link_title['best_of']}><FontAwesomeIcon icon={faCircleQuestion} /></Link></Form.Label>
                                <Col sm='4'>
                                    <Form.Control
                                        style={{ border: 'none' }}
                                        type="range"
                                        value={best_of}
                                        onChange={(e) => {
                                            setBestOf(parseFloat(e.target.value));
                                        }}
                                        min="1"
                                        max="20"
                                        step="1"
                                    />
                                </Col>
                                <Col sm='2'>
                                    <Form.Control
                                        type="number"
                                        value={best_of}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            if (val >= 0.0 && val <= 1.0) {
                                                setBestOf(val);
                                            }
                                        }}
                                        min="1"
                                        max="20"
                                        step="1"
                                    />
                                </Col>
                            </Form.Group>
                        </Row>
                        <br />
                        <Row className="justify-content-center">
                            <Button type="submit" variant="primary" style={{width: '10vw'}}>Generate</Button>
                        </Row>
                    </Form>
                    <br />
                    {generateResult &&(
                            <>
                                <textarea value={generateResult} readOnly={true} style={{width: "100%", height: "100px"}}></textarea>
                                <br />
                                <Row className="justify-content-center">
                                    <Button variant="primary" onClick={saveAnalogy} style={{width: '10vw'}}>Save</Button>
                                </Row>
                            </>
                        )
                    }
                </Card.Body>
            </Card>
        </div>
    );
}

export default GenPage;