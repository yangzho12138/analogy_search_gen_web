import React, { useEffect, useState } from 'react';
import { Card, Form, Row, Col, Button, Tooltip, OverlayTrigger } from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import Link from '../components/Link'
import Router from "next/router"
import useRequest from '../hooks/use-request'
import axios from 'axios'
import Modal from '../components/Modal'
import LoadingSpinner from '../components/LoadingSpinner'
import { useRouter } from 'next/router';

const auth_url = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
const gen_url = process.env.NEXT_PUBLIC_GEN_BASE_URL;

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
    "openAIKey": "If you don't have one, you can leave it blank and we will provide one for you. (You have 50 free requests)",
    "target": "The concept that you would like to generate an analogy for (e.g. cell).",
    "src": "The topic area that you would like the analogy to be about",
    "prompt": "Select the prompt or instruction given to the model for generating the analogy ",
    "tmp": "Loweing results in less ramdom completions. As randomness approaches zero, the model will become deterministic and repetitive",
    "max_length": "The maximum number of tokens to generate shared between the prompt and the completion",
    "top_p": "Controls diversity vai nucleus sampling: 0.5 means half of all likelihood-weighted options are considered",
    "freq_penalty": "How much to penalize new tokens based on their frequency in the text so far. Decreases the likelihood to repeat the same line verbatim",
    "pres_penalty": "How much to penalize new tokens based on whether they appear in the text so far. Increases the likelihood to talk about new topics",
    "best_of": "Returns the 'best' (the one with the highest log probability per token)"
}

const GenPage = ({ userInfo }) => {
    const router = useRouter();
    const { preSetPrompt,
        preSetTarget,
        preSetSrc,
        preSetTmp,
        preSetFreq_penalty,
        preSetPres_penalty,
        preSetMax_length,
        preSetTop_p,
        preSetBest_of } = router.query;


    const [openAIKey, setOpenAIKey] = useState("");
    const [target, setTarget] = useState(preSetTarget === undefined ? "" : preSetTarget);
    const [src, setSrc] = useState(preSetSrc === undefined ? "" : preSetSrc);
    const [prompt, setPrompt] = useState(preSetPrompt === undefined ? gen_prompts[0] : preSetPrompt);
    const [temp, setTemp] = useState(preSetTmp === undefined ? 0.0 : parseFloat(preSetTmp));
    const [max_length, setMaxLength] = useState(preSetMax_length === undefined ? 0 : parseInt(preSetMax_length));
    const [top_p, setTopP] = useState(preSetTop_p === undefined ? 1.0 : parseFloat(preSetTop_p));
    const [freq_penalty, setFreqPenalty] = useState(preSetFreq_penalty === undefined ? 0.0 : parseFloat(preSetFreq_penalty));
    const [pres_penalty, setPresPenalty] = useState(preSetPres_penalty === undefined ? 0.0 : parseFloat(preSetPres_penalty));
    const [best_of, setBestOf] = useState(preSetBest_of === undefined ? 1 : parseInt(preSetBest_of));

    const [generateResult, setGenerateResult] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errors, setErrors] = useState(null);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [isLoading, setIsLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [options] = useState(gen_prompts);
    const filteredOptions = options.filter(option => 
        option.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const { doRequest : doRequestGen, errors : genError } = useRequest({
        url: gen_url + '/api/generation',
        method: 'post',
        body: {
            api_key: openAIKey,
            target,
            src,
            prompt,
            temp,
            max_length,
            top_p,
            freq_penalty,
            pres_penalty,
            best_of
        },
        onSuccess: (data) => {
            window.alert('Generate Success');
            setGenerateResult(data);
        } 
    });

    const { doRequest : doRequestSave, errors : saveError } = useRequest({
        url: gen_url + '/api/generation',
        method: 'put',
        body: {
            target,
            src,
            prompt,
            temp,
            max_length,
            top_p,
            freq_penalty,
            pres_penalty,
            best_of,
            analogy: generateResult
        },
        onSuccess: (data) => {
            window.alert('Save Success');
        } 
    });

    const { doRequest : doRequestLogOut, errors : logOutError } = useRequest({
        url: auth_url + '/api/users/logout',
        method: 'post',
        onSuccess: (data) => {
            window.alert('Log Out Success');
        } 
    });

    useEffect(() => {
        if(genError){
            setErrors(genError);
        }
    }, [genError]);

    useEffect(() => {
        if(saveError){
            setErrors(saveError);
        }
    }, [saveError]);

    useEffect(() => {
        if(logOutError){
            setErrors(logOutError);
        }
    }, [logOutError]);

    const generate = async(e) => {
        if(userInfo.free_openai_api_key <= 0 && openAIKey == ''){
            alert('Your free key usage has been exhausted, please enter your own OpenAI API Key');
            return;
        }
        if(target == ''){
            alert('Please fill in the required fields');
            return;
        }
        e.preventDefault();
        setIsLoading(true);
        await doRequestGen();
        setIsLoading(false);
    }

    const saveAnalogy = async(e) => {
        e.preventDefault();
        await doRequestSave();
    }

    const logout = async(e) => {
        e.preventDefault();
        await doRequestLogOut();
        Router.push('/');
    }
    if(userInfo){
        return (
            <div style={{margin: "3%"}}>
                <LoadingSpinner isLoading={isLoading} />
                {errors && (
                    <Modal isOpen={true} onClose={() => {
                        setErrors(null);
                    }}>
                        {errors}
                    </Modal>
                )}
                <Row style={{margin: '5%'}}>
                    <Col md={8}>
                        <h1>Generate Analogy</h1>
                    </Col>
                    <Col md={4} className="d-flex align-items-center justify-content-end">
                        <Button variant="primary" onClick={() => Router.push('/')}>Search Analogies</Button>
                        <Link title='User profile' ><FontAwesomeIcon icon={faUser} size='xl' style={{marginLeft: '10%'}} onClick={() => Router.push('/profile')}/></Link>
                        <Link title='Log out' ><FontAwesomeIcon icon={faRightFromBracket} size='xl' style={{marginLeft: '5%'}} onClick={logout}/></Link>
                    </Col>
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
    } else {
        return(
            <Row style={{textAlign: 'center', marginTop: '10%'}}>
                <h2>Only Subscribed User Could Use Generation Function, <a href='/login'>Subscribe Now!</a></h2>
            </Row>
        )
    }
}

GenPage.getInitialProps = async ( { req } ) => {
    let userInfo = null;

    let cookies = '';
    if (req && req.headers.cookie) {
        cookies = req.headers.cookie;
    }

    try{
        const res = await axios.get( auth_url + '/api/users/info', {
            headers: {
                cookie: cookies
            },
            withCredentials: true,
        });
        console.log(res);
        if(res.status == 200){
            userInfo = res.data.data;
        }
    }catch(err){
        console.log(err);
    }

    return {
        userInfo,
    }
}

export default GenPage;