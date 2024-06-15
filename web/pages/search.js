import { Card, Tabs, Tab, Form, Row, Col, InputGroup, Button } from "react-bootstrap"
import { use, useEffect, useState } from "react"
import Router from "next/router"
import useRequest from "../hooks/use-request";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faCircleQuestion, faUser, faRightFromBracket, faMap } from '@fortawesome/free-solid-svg-icons'
import Link from "../components/Link";
import AnalogyCard from "../components/AnalogyCard";
import axios, { all } from "axios";
import { useRouter } from "next/router";
import LoadingSpinner from "../components/LoadingSpinner";

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

const link_title = {
    "prompt": "Select the prompt or instruction given to the model for generating the analogy ",
    "temp": "Loweing results in less ramdom completions. As randomness approaches zero, the model will become deterministic and repetitive",
}

const auth_url = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
const search_url = process.env.NEXT_PUBLIC_SEARCH_BASE_URL;

const SearchPage = ({ userInfo, allAnalogies }) => {
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

    // const [searchResults, setSearchResults] = useState(allAnalogies);
    const [searchResults, setSearchResults] = useState(allAnalogies);

    const [isLoading, setIsLoading] = useState(false);

    const { doRequest : doRequestLogOut, errors : logOutError } = useRequest({
        url: auth_url + '/api/users/logout',
        method: 'post',
        onSuccess: (data) => {
            window.alert('Log Out Success');
        } 
    });

    const { doRequest : doRequestSearch, errors : searchError } = useRequest({
        url: search_url + '/api/search',
        method: 'post',
        body: {
            username: userInfo === null ? '' : userInfo.username,
            query,
            prompt,
            temp
        },
        onSuccess: (data) => {
            setSearchResults(data.docs);
        }
    });
    
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

    return (
        <div style={{marginTop: "3%"}}>
             <LoadingSpinner isLoading={isLoading} />
            <Row>
                <Col md={3} className="text-center">
                    <span style={{font: 'italic 5em Georgia', color: 'orange'}}>A</span>
                    <span style={{font: 'italic 3em Georgia', color: 'blue'}}>n</span>
                    <span style={{font: 'italic 3em Georgia', color: 'green'}}>a</span>
                    <span style={{font: 'italic 3em Georgia', color: 'red'}}>l</span>
                    <span style={{font: 'italic 3em Georgia', color: 'purple'}}>e</span>
                    <span style={{font: 'italic 3em Georgia', color: 'grey'}}>g</span>
                    <span style={{font: 'italic 5em Georgia', color: 'orange'}}>o</span>
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
                                            required
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
                        <Row className="align-items-center">
                            <Col md="1" className="d-flex justify-content-center"><Link title={link_title['prompt']}><FontAwesomeIcon icon={faCircleQuestion} /></Link></Col>
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
                            <Col md="1"className="d-flex justify-content-center" ><Link title={link_title['temp']}><FontAwesomeIcon icon={faCircleQuestion} /></Link></Col>
                            <Col md="4">
                                <Form.Select
                                    value={temp}
                                    onChange={(e) => setTemp(e.target.value)}
                                >
                                    <option>Randomness...</option>
                                    {temps.map((temp, index) => {
                                        return <option key={index} value={temp}>{temp}</option>
                                    })}
                                </Form.Select>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col md={3}>
                    {userInfo === null ? (
                        <>
                            <Button variant="primary" disabled style={{marginRight: '2%'}}>Generate</Button>
                            {/* <Button variant="primary" disabled>Assignment</Button> */}
                            <Link title='Subsribed user only, click to signin' ><FontAwesomeIcon icon={faCircleQuestion} style={{marginLeft: '3%'}} onClick={() => Router.push('/login')}/></Link>
                            <Link title='Know more about Analego' ><FontAwesomeIcon icon={faMap} style={{marginLeft: '3%'}} onClick={() => Router.push('/')}/></Link>
                        </>
                    ) : (
                        <>
                            <Button variant="primary" onClick={() => Router.push('/gen')} style={{marginRight: '1%'}}>Generate</Button>
                            {/* <Button variant="primary" onClick={() => Router.push('/spaces')}>Assignment</Button> */}
                            <Link title='User profile' ><FontAwesomeIcon icon={faUser} size='xl' style={{marginLeft: '10%'}} onClick={() => Router.push('/profile')}/></Link>
                            <Link title='Log out' ><FontAwesomeIcon icon={faRightFromBracket} size='xl' style={{marginLeft: '5%'}} onClick={logout}/></Link>
                            <Link title='Know more about Analego' ><FontAwesomeIcon icon={faMap} style={{marginLeft: '3%'}} onClick={() => Router.push('/')}/></Link>
                        </>
                    )}
                </Col>
            </Row>
            <br />
            <Row>
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
                                <h3>Search Again or Generate Analogy</h3>
                            </div>
                        ) : (
                            <>
                                {searchResults.map((result, index) => {
                                    return (
                                        <>
                                            <AnalogyCard key={result.pid} searchResult={result} isCard={isCard} userInfo={userInfo}/>
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
        console.log(res);
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
        console.log(res);
        if(res.status == 200){
            allAnalogies = res.data.docs;
            console.log("test123 ", allAnalogies);
        }
    } catch(err){
        console.log(err);
    }

    return {
        // userLoggedIn,
        userInfo,
        allAnalogies,
    }
}

export default SearchPage;
