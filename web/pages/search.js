import { Card, Tabs, Tab, Form, Row, Col, InputGroup, Button } from "react-bootstrap"
import { use, useEffect, useState } from "react"
import Router from "next/router"
import useRequest from "../hooks/use-request";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faCircleQuestion, faUser, faRightFromBracket, faMap, faCaretRight, faCaretDown, faFileContract } from '@fortawesome/free-solid-svg-icons'
import Link from "../components/Link";
import Modal from "../components/Modal";
import AnalogyCard from "../components/AnalogyCard";
import axios, { all } from "axios";
import { useRouter } from "next/router";
import LoadingSpinner from "../components/LoadingSpinner";

const prompts = [
    'Explain <target> using an analogy.',
    'Create an analogy to explain <target>.',
    'Using an analogy, explain <target>.',
    'What analogy is used to explain <target>?',
    'Use an analogy to explain <target>.',
    'Explain <target> using an analogy involving <src>.',
    'Explain how <target> is analogous to <src>.',
    'Explain how <target> is like <src>.',
    'Explain how <target> is similar to <src>.',
    'How is <target> analogous to <src>?',
    'How is <target> like <src>?',
    'How is <target> similar to <src>?',
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

const link_title = {
    "prompt": "Select the prompt or instruction given to the model for generating the analogy ",
    "temp": "Loweing results in less ramdom completions. As randomness approaches zero, the model will become deterministic and repetitive",
    "img": "Search for analogies with images"
}

const auth_url = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
const search_url = process.env.NEXT_PUBLIC_SEARCH_BASE_URL;
const assignment_url = process.env.NEXT_PUBLIC_ASSIGNMENT_BASE_URL;

const SearchPage = ({ userInfo, allAnalogies, clientip, collectedAnalogies }) => {
    // const [token, setToken] = useState(null)
    const router = useRouter();
    const { preSetPrompt,
        preSetTemp,
        preSetQuery } = router.query;

    console.log(preSetPrompt, preSetTemp, preSetQuery, prompts.find(prompt => prompt.includes(preSetPrompt)));
    const [query, setQuery] = useState(((preSetQuery === undefined)||(preSetQuery == '')) ? '' : preSetQuery)
    const [prompt, setPrompt] = useState(((preSetPrompt === undefined)||(preSetPrompt == '')) ? '' :  prompts.find(prompt => prompt.includes(preSetPrompt)))
    const [temp, setTemp] = useState(preSetTemp === undefined ? '' : preSetTemp)

    const [isCard, setIsCard] = useState(false)

    const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
    const [imgFilter, setImgFilter] = useState(false);

    // const [searchResults, setSearchResults] = useState(allAnalogies);
    const [searchResults, setSearchResults] = useState(allAnalogies);

    const [isLoading, setIsLoading] = useState(false);

    const [errors, setErrors] = useState(null);

    const { doRequest : doRequestLogOut, errors : logOutError } = useRequest({
        url: auth_url + '/api/users/logout',
        method: 'post',
        onSuccess: (data) => {
            window.alert('Log Out Success');
        } 
    });

    useEffect(() => {
        if(logOutError){
            setErrors(logOutError);
        }
    }, [logOutError]);


    const { doRequest : doRequestSearch, errors : searchError } = useRequest({
        url: search_url + '/api/search',
        method: 'post',
        body: {
            username: userInfo === null ? '' : userInfo.username,
            query,
            prompt,
            temp,
            imgFilter: imgFilter,
            clientip: clientip
        },
        onSuccess: (data) => {
            setSearchResults(data.docs);
        }
    });

    useEffect(() => {
        if(searchError){
            setErrors(searchError);
        }
    }, [searchError]);
    
    const doSearch = async(e) => {
        e.preventDefault();
        setIsLoading(true);
        await doRequestSearch();
        setIsLoading(false);
    }
    
    const logout = async(e) => {
        e.preventDefault();
        await doRequestLogOut();
        Router.push('/');
    }

    // useEffect(() => {
    //     const t = JSON.parse(localStorage.getItem('token'));
    //     console.log(t);
    //     if(t){
    //         const now = new Date();
    //         if (now.getTime() > t.expiration) {
    //             localStorage.removeItem('token');
    //             console.log('token expired and removed.');
    //         }else{
    //             setToken(t.access);
    //         }
    //     }
    // }, [])

    const { doRequest : doRequestSearchImg, errors : searchImgError } = useRequest({
        url: search_url + '/api/search',
        method: 'post',
        body: {
            username: userInfo === null ? '' : userInfo.username,
            query: '',
            prompt: '',
            temp: '',
            imgFilter: true,
            clientip: clientip
        },
        onSuccess: (data) => {
            setSearchResults(data.docs);
        }
    });

    useEffect(() => {
        if(searchImgError){
            setErrors(searchImgError);
        }
    }, [searchImgError]);

    return (
        <div style={{marginTop: "3%"}}>
             <LoadingSpinner isLoading={isLoading} />
             {errors && (
                    <Modal isOpen={true} onClose={() => {
                        setErrors(null);
                    }}>
                        {errors}
                    </Modal>
            )}
            <Row>
                <Col md={3}>
                    <img src="/images/logo.png" style={{maxHeight: '15vh', width: '100%'}}/>
                </Col>
                <Col md={6}>
                    <Form onSubmit={doSearch}>
                        <Row>
                            <Form.Group as={Col} md="8" controlId="query">
                                <InputGroup>
                                    <InputGroup.Text id="inputGroupPrepend"><FontAwesomeIcon icon={faMagnifyingGlass} /></InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search your analogy ..."
                                            aria-describedby="inputGroupPrepend"
                                            value = {query}
                                            onChange={(e) => setQuery(e.target.value)}
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Col md="2">
                                <Button type="submit" variant="primary">Search</Button>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <div onClick={() => setAdvancedFiltersOpen(!advancedFiltersOpen)} style={{cursor: 'pointer', width: 'auto'}}>
                                {advancedFiltersOpen ? <FontAwesomeIcon icon={faCaretDown} /> : <FontAwesomeIcon icon={faCaretRight} />}
                                {" "}Advanced Filters
                            </div>
                        </Row>
                        {advancedFiltersOpen && (
                            <div style={{border: '2px solid grey', padding: '10px'}}>
                            <Row>
                                <Col md='4'>
                                    Prompt{" "}<Link title={link_title['prompt']}><FontAwesomeIcon icon={faCircleQuestion} /></Link>
                                </Col>
                                <Col md='4'>
                                    Randomness{" "}<Link title={link_title['temp']}><FontAwesomeIcon icon={faCircleQuestion} /></Link>
                                </Col>
                                <Col md='4'>
                                    Image{" "}<Link title={link_title['img']}><FontAwesomeIcon icon={faCircleQuestion} /></Link>
                                </Col>
                            </Row>
                            <Row className="align-items-center">
                                <Col md="4">
                                    <Form.Select
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                    >
                                        <option key={-1} value=''>All Prompt</option>
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
                                        <option key={-1} value=''>All Randomness</option>
                                        {temps.map((temp, index) => {
                                            return <option key={index} value={temp}>{temp}</option>
                                        })}
                                    </Form.Select>
                                </Col>
                                <Col md="4">
                                    <Form.Check
                                        type="switch"
                                        checked={imgFilter}
                                        onChange={() => setImgFilter(!imgFilter)}
                                    />
                                </Col>
                            </Row>
                            </div>
                        )}
                        
                    </Form>
                </Col>
                <Col md={3}>
                    {userInfo === null ? (
                        <>
                            <Button variant="primary" disabled style={{marginRight: '2%'}}>Generate</Button>
                            {/* <Button variant="primary" disabled>Assignment</Button> */}
                            <Link title='Subsribed user only, click to signin' ><FontAwesomeIcon icon={faCircleQuestion} size='xl' style={{marginLeft: '3%'}} onClick={() => Router.push('/login')}/></Link>
                        </>
                    ) : (
                        <>
                            <Button variant="primary" onClick={() => Router.push('/gen')} style={{marginRight: '1%'}}>Generate</Button>
                            {/* <Button variant="primary" onClick={() => Router.push('/spaces')}>Assignment</Button> */}
                            <Link title='User profile' ><FontAwesomeIcon icon={faUser} size='xl' style={{marginLeft: '10%'}} onClick={() => Router.push('/profile')}/></Link>
                            <Link title='Log out' ><FontAwesomeIcon icon={faRightFromBracket} size='xl' style={{marginLeft: '5%'}} onClick={logout}/></Link>
                        </>
                    )}
                    <Link title='Know more about Analego' ><FontAwesomeIcon icon={faMap} size='xl' style={{marginLeft: '3%'}} onClick={() => Router.push('/')}/></Link>
                    <Link title='Give us your feedback' ><FontAwesomeIcon icon={faFileContract} size='xl' style={{marginLeft: '3%'}} onClick={() => window.open('https://forms.gle/DufHWwxRxn74MFtNA', '_blank')}/></Link>
                </Col>
            </Row>
            <br />
            <br />
            <Row>
                <Row style={{marginLeft: '1%'}}>
                    <div style={{
                        display: 'inline-block',
                        color: 'red',
                        width: 'auto',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1em',
                    }} onClick={(e) => {
                        doRequestSearchImg();
                    }}>New: Browse all analogies with images</div>
                </Row>
                <br />
                <Row style={{marginLeft: '1%'}}>
                    <Col md={3}>
                        <Form.Select
                            value={isCard}
                            onChange={(e) => setIsCard(e.target.value)}
                        >
                            <option value={true}>Card View</option>
                            <option value={false}>List View</option>        
                        </Form.Select>
                    </Col>
                </Row>
                <Card style={{margin: '2%'}}>
                    <Card.Body style={{height: '70vh', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', overflowY: 'auto'}}>
                        {searchResults === null || searchResults.length === 0 ? (
                            <div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'grey', marginLeft: '30%'}}>
                                <h1>Oops, No Analogy Found ...</h1>
                                <h3>Try to Refresh Page, Search Again or Generate Analogy</h3>
                            </div>
                        ) : (
                            <>
                                {searchResults.map((result, index) => {
                                    return (
                                        <>
                                            <AnalogyCard key={result.pid} searchResult={result} isCard={isCard} userInfo={userInfo} isCollected={collectedAnalogies.includes(result.pid)}/>
                                            <br />
                                        </>
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

SearchPage.getInitialProps = async ( { req } ) => {
    // let userLoggedIn = false;
    let userInfo = null;
    let allAnalogies = [];
    let collectedAnalogies = [];
    let clientip = ''; 
    let cookies = '';
    if (req && req.headers['x-forwarded-for']) {
       clientip = req.headers['x-forwarded-for']
    }  
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
        // console.log(res);
        if(res.status == 200){
            // userLoggedIn = true;
            console.log(res.data.data);
            userInfo = res.data.data;
        }
    }catch(err){
        console.log(err);
    }

    try{
        const res = await axios.get( search_url + '/api/search', {
            headers: {
                cookie: cookies, clientip:clientip
            },
            withCredentials: true,
        });
        // console.log(res);
        if(res.status == 200){
            allAnalogies = res.data.docs;
        }
    } catch(err){
        console.log(err);
    }

    try{
        const res = await axios.get( assignment_url + '/api/assignment/analogy', {
            headers: {
                cookie: cookies
            },
            withCredentials: true,
        });
        // console.log("testpoint0", res);
        if(res.status == 200){
            // console.log("testpoint1", res.data.analogies);
            collectedAnalogies = res.data.analogies.map(analogy => analogy._id);
        }
    } catch(err){
        console.log(err);
    }

    // console.log(collectedAnalogies);

    return {
        // userLoggedIn,
        userInfo,
        allAnalogies,
        clientip,
        collectedAnalogies
    }
}

export default SearchPage;
