import React from 'react'
import { Card, Row, Col, Form, Button, ListGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown, faFlag, faTemperatureThreeQuarters, faComment, faImages } from '@fortawesome/free-solid-svg-icons'
import Modal from './Modal';
import { useState } from 'react';
import useRequest from '../hooks/use-request';
import Comment from './Comment';
import Link from '../components/Link';
import axios from 'axios';
import ImageTooltip from './ImageTooltip';

const auth_url = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
const search_url = process.env.NEXT_PUBLIC_SEARCH_BASE_URL;

const issueOptions = [
    'Offensive Content',
    'Spam',
    'Irrelevant',
    'Other'
]

const link_title = {
    "prompt": "Prompt for analogy ",
    "temp": "Loweing results in less ramdom completions. As randomness approaches zero, the model will become deterministic and repetitive",
}

const AnalogyCard = ({searchResult, isCard, userInfo }) => {
    // console.log(isCard)
    // console.log(userInfo)
    // console.log(searchResult.like)
    // console.log(userInfo)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsIssue(false);
        setShowComments(false);
        setIsModalOpen(false);
    }

    const [issue, setIssue] = useState('');
    const [issueDetails, setIssueDetails] = useState('');
    const [isIssue, setIsIssue] = useState(false);
    
    const [comment, setComment] = useState('');
    const [replyToId, setReplyToId] = useState(null);
    const [replyToUsername, setReplyToUsername] = useState(null);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);

    const [showImage, setShowImage] = useState(false);

    const [sLike, setSLike] = useState(searchResult.like[0])
    const [tLike, setTLike] = useState(searchResult.like[1])
    const [eLike, setELike] = useState(searchResult.like[2])

    const [sDisLike, setSDisLike] = useState(searchResult.dislike[0])
    const [tDisLike, setTDisLike] = useState(searchResult.dislike[1])
    const [eDisLike, setEDisLike] = useState(searchResult.dislike[2])

    //const [like, setLike] = useState(searchResult.like);
    //const [dislike, setDislike] = useState(searchResult.dislike);

    const { doRequest: doRequestReport, errors: reportError } = useRequest({
        url: auth_url + '/api/users/flag',
        method: 'post',
        body: {
            issue,
            details: issueDetails,
            analogy: searchResult,
            username: userInfo ? userInfo.username : "anonymous",
        },
        onSuccess: (data) => {
            alert('Thank you for your report, a memeber of our team will review the analogy shortly.');
        }
    });

    const { doRequest: doRequestComment, errors: commentError } = useRequest({
        url: auth_url + '/api/users/comment',
        method: 'post',
        body: {
            comment,
            analogy: searchResult,
            replyTo: replyToId,
            username: userInfo ? userInfo.username : "anonymous",
        },
        onSuccess: (data) => {
            alert('Thank you for your comment!');
        },
    });

    const { doRequest: doRequestGetComments, errors: getCommentsError } = useRequest({
        url: auth_url + '/api/users/comment?pid=' + searchResult.pid,
        method: 'get',
        onSuccess: (data) => {
            setComments(data.data.comments);
        }
    })

    const { doRequest: doRequestLike, errors: likeError } = useRequest({
        url: search_url + '/api/like',
        method: 'post',
    })

    const reportAnlogy = () => {
        console.log('report analogy')
        setIssue('');
        setIssueDetails('');
        setIsIssue(true);
        openModal();
    }

    const handleAnalogyReport = async (e) => {
        e.preventDefault();
        if(issue === ''){
            alert('Please select an issue');
            return;
        }
        if(window.confirm('Are you sure you want to report this analogy?')){
            // api call
            await doRequestReport();
            // close modal
            closeModal();
        }
    }

    const likeAnalogy = async(isLike, e) => {
        const span = e.currentTarget.querySelector('span');
        const icon = e.currentTarget.querySelector('svg');
        const isRed = window.getComputedStyle(icon).color === 'rgb(255, 0, 0)';
        var updateVal = 0;
        var prevVal = Number(span.textContent.trim())
        if(isRed){
            icon.style.color = 'black';
            if(isLike){
                span.textContent = ' '+String(prevVal-1);
                updateVal = prevVal-1;
                if(!userInfo || userInfo.role === "STUDENT"){
                    setSLike(Math.max(sLike - 1, 0))
                }else if(userInfo.role === "TEACHER"){
                    setTLike(Math.max(tLike - 1, 0))
                }else if(userInfo.role === "EXPERT"){
                    setELike(Math.max(eLike - 1, 0))
                }
            } else {
                span.textContent = ' '+String(prevVal-1);
                updateVal = prevVal-1;
                if(!userInfo || userInfo.role === "STUDENT"){
                    setSDisLike(Math.max(sDisLike - 1, 0))
                }else if(userInfo.role === "TEACHER"){
                    setTDisLike(Math.max(tDisLike - 1, 0))
                }else if(userInfo.role === "EXPERT"){
                    setEDisLike(Math.max(eDisLike - 1, 0))
                }
            }
        } else {
            icon.style.color = 'red';
            if(isLike){
                span.textContent = ' '+String(prevVal+1);
                updateVal = prevVal+1;
                if(!userInfo || userInfo.role === "STUDENT"){
                    setSLike(sLike + 1)
                }else if(userInfo.role === "TEACHER"){
                    setTLike(tLike + 1)
                }else if(userInfo.role === "EXPERT"){
                    setELike(eLike + 1)
                }
            } else {
                span.textContent = ' '+String(prevVal+1);
                updateVal = prevVal+1;
                if(!userInfo || userInfo.role === "STUDENT"){
                    setSDisLike(sDisLike + 1)
                }else if(userInfo.role === "TEACHER"){
                    setTDisLike(tDisLike + 1)
                }else if(userInfo.role === "EXPERT"){
                    setEDisLike(eDisLike + 1)
                }
            }
        }

        await axios.post(search_url + '/api/like', {
            id: searchResult.pid,
            likeType: isLike ? 'like' : 'dislike',
            cancel: isRed,
            role: userInfo ? userInfo.role : "STUDENT",
        })
    }

    const commnetAnlogy = async() => {
        console.log('comment analogy')
        setComment('');
        setReplyToId(null);

        await doRequestGetComments();
        openModal();
    }

    const handleAnalogyComment = async (e) => {
        e.preventDefault();
        if(comment === ''){
            alert('Please enter a comment');
            return;
        }
        if(window.confirm('Are you sure you want to comment this analogy?')){
            // api call
            await doRequestComment();
            // close modal
            closeModal();
        }
    }

    const handldReplyToComment = (id, username) => {
        setReplyToId(id);
        setReplyToUsername(username);
    }
    

    return (
        <>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            {isIssue === true ? (
                <Form onSubmit={handleAnalogyReport} style={{margin: "5%"}}>
                    <Row><h3>Report An Issue</h3></Row>
                    <br />
                    <Row>
                        <Form.Group as={Col} controlId="issue">
                            <Form.Label>Issue</Form.Label>
                            <Form.Control as="select" value={issue} onChange={(e) => setIssue(e.target.value)}>
                                <option value=''>Choose...</option>
                                {issueOptions.map((option, index) => {
                                    return <option key={index} value={option}>{option}</option>
                                })}
                            </Form.Control>
                        </Form.Group>
                    </Row>
                    <br />
                    <Row>
                        <Form.Group as={Col} controlId="comment">
                            <Form.Label>Detail (optional)</Form.Label>
                            <Form.Control as="textarea" rows={3} value={issueDetails} onChange={(e) => setIssueDetails(e.target.value)}/>
                        </Form.Group>
                    </Row>
                    <br />
                    <Button type="submit" variant="primary">Submit</Button>
                </Form>
            ) : (
                <>
                    <Form onSubmit={handleAnalogyComment} style={{marginLeft: "5%"}}>
                        <Row>
                            <h3>Comment</h3>
                        </Row>
                        <br />
                        <Row>
                            <Form.Group as={Col} controlId="comment">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Form.Label style={{ marginRight: '8px', marginBottom: '0' }}>Comment:</Form.Label>
                                {replyToId && (
                                    <p style={{
                                    backgroundColor: 'grey',
                                    margin: '0',
                                    padding: '0 4px',
                                    borderRadius: '4px'
                                    }}>
                                    Reply to: {replyToUsername}
                                    </p>
                                )}
                            </div>
                                <Form.Control as="textarea" rows={3} value={comment} onChange={(e) => setComment(e.target.value)}/>
                            </Form.Group>
                        </Row>
                        <br />
                        <Button type="submit" variant="primary">Submit</Button>
                        {showComments === true ? (
                            <>
                                <Button variant="link" onClick={() => setShowComments(false)} style={{marginLeft: '5%'}}>Hide Comments</Button>
                                <br />
                                <br />
                                {comments !== null && comments.length !== 0 ? (
                                    <div style={{maxHeight: '40vh', overflowY: 'auto', border: '1px solid grey',  borderRadius: '10px', padding: '10px'}}>
                                            {comments.map((comment, index) => {
                                                return <Comment key={index} comment={comment} replyToComment={handldReplyToComment}/>
                                            })}
                                    </div>
                                ) : (
                                    <p>No comments yet</p>
                                )}
                            </>
                        ) : (
                            <Button variant="link" onClick={() => setShowComments(true)} style={{marginLeft: '5%'}}>Show Comments</Button>
                        )}
                    </Form>
                    <br />
                </>
            )}
        </Modal>
        {isCard === true || isCard === 'true' ? (
            <Card style={{ width: '30%', height: '50%', display: 'inline-block', margin:'1%', overflow: 'auto' }}>
                <Card.Body style={{height: '100%'}}>
                    <Card.Title style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {searchResult.target}
                        <div>
                            {searchResult.generatorRole === "STUDENT" && (
                                <Link title={"This analogy was generated by a STUDENT role user"}>
                                    <div className="nameplate" style={{ background: "linear-gradient(145deg, #da8a67, #c87551)", marginLeft: '1rem' }}>
                                        <p>Student</p>
                                    </div>
                                </Link>
                            )}
                            {searchResult.generatorRole === "TEACHER" && (
                                <Link title={"This analogy was generated by a TEACHER role user"}>
                                    <div className="nameplate" style={{ background: "linear-gradient(145deg, #e6e6e6, #b3b3b3)", marginLeft: '1rem' }}>
                                        <p>Teacher</p>
                                    </div>
                                </Link>
                            )}
                            {searchResult.generatorRole === "EXPERT" && (
                                <Link title={"This analogy was generated by an EXPERT role user"}>
                                    <div className="nameplate" style={{ background: "linear-gradient(145deg, #ffd700, #ffae42)", marginLeft: '1rem' }}>
                                        <p>Expert</p>
                                    </div>
                                </Link>
                            )}
                            <Link title={"This analogy was generated by " + searchResult.model + " AI model"}>
                                <div className="nameplate" style={{ background: "linear-gradient(145deg, #b4e391, #61c419)", marginLeft: '1rem' }}>
                                    <p>{searchResult.model}</p>
                                </div>
                            </Link>
                        </div>
                    </Card.Title>
                    <Row>
                        <Col md='10'>
                            <div style={{display: 'inline-block', width: 'auto', cursor: 'pointer'}}>
                            <Link title={link_title['prompt']}>
                                <Card.Subtitle className="mb-2 text-muted">{searchResult.prompt}</Card.Subtitle>
                            </Link>
                            </div>
                        </Col>
                        <Col md='2'>
                            <Card.Subtitle className="mb-2 text-muted">
                            <Link title={link_title['temp']}>
                                <div style={{display: 'inline-block', width: 'auto', cursor: 'pointer'}}>
                                    <FontAwesomeIcon icon={faTemperatureThreeQuarters} />{searchResult.temp}
                                </div>
                            </Link>
                            </Card.Subtitle>
                        </Col>
                    </Row>
                    <Card.Text style={{maxHeight: '60%', overflowY: 'auto', border: '1px solid grey',  borderRadius: '10px', padding: '10px'}}>
                            {searchResult.analogy} {searchResult.image && (
                                // <ImageTooltip image={searchResult.image}><FontAwesomeIcon icon={faImages} /></ImageTooltip>
                                <>
                                    <Link title={"Click to view/hide image"}>
                                        <FontAwesomeIcon onClick={() => setShowImage(!showImage)} icon={faImages} />
                                    </Link>
                                    {showImage && (
                                        <div>
                                            <img src={searchResult.image} style={{ width: '20vw', height: '20vh' }} />
                                        </div>
                                    )}
                                </>
                            )}
                    </Card.Text>
                    <Row>
                        <Col md='2' onClick={(e) => likeAnalogy(true, e)}>
                            <Link title={"Student: " + sLike + "; Teacher: " + tLike + "; Expert: " + eLike}>
                                <div style={{display: 'inline-block', width: 'auto', cursor: 'pointer'}}>
                                    <FontAwesomeIcon icon={faThumbsUp} /> <span>{' '+ (sLike + tLike + eLike)}</span>
                                </div>
                            </Link>
                        </Col>
                        <Col md='2' onClick={(e) => likeAnalogy(false, e)}>
                            <Link title={"Student: " + sDisLike + "; Teacher: " + tDisLike + "; Expert: " + eDisLike}>
                                <div style={{display: 'inline-block', width: 'auto', cursor: 'pointer'}}>
                                    <FontAwesomeIcon icon={faThumbsDown} /> <span> {' ' + (sDisLike + tDisLike + eDisLike)}</span>
                                </div>
                            </Link>
                        </Col>
                        <Col md='4' onClick={reportAnlogy}>
                            <div style={{display: 'inline-block', width: 'auto', cursor: 'pointer'}}>
                                <FontAwesomeIcon icon={faFlag} style={{color: 'red'}}/> {' Report'}
                            </div>
                        </Col>
                        <Col md='4' onClick={() => commnetAnlogy(searchResult.pid)}>
                            <div style={{display: 'inline-block', width: 'auto', cursor: 'pointer'}}>
                                <FontAwesomeIcon icon={faComment} /> {' Comment'}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        ) : (
            <>
                <Card style={{ width: '90%'}}>
                    <Card.Body>
                        <div style={{backgroundColor: '#a9dafa', padding: '1%'}}>
                        <Card.Title style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '1rem' }}>{searchResult.target}</span>
                                {searchResult.generatorRole === "STUDENT" && (
                                    <Link title={"This analogy was generated by a STUDENT role user"}>
                                        <div className="nameplate" style={{ background: "linear-gradient(145deg, #da8a67, #c87551)", marginLeft: '1rem' }}>
                                            <p>Student</p>
                                        </div>
                                    </Link>
                                )}
                                {searchResult.generatorRole === "TEACHER" && (
                                    <Link title={"This analogy was generated by a TEACHER role user"}>
                                        <div className="nameplate" style={{ background: "linear-gradient(145deg, #e6e6e6, #b3b3b3)", marginLeft: '1rem' }}>
                                            <p>Teacher</p>
                                        </div>
                                    </Link>
                                )}
                                {searchResult.generatorRole === "EXPERT" && (
                                    <Link title={"This analogy was generated by an EXPERT role user"}>
                                        <div className="nameplate" style={{ background: "linear-gradient(145deg, #ffd700, #ffae42)", marginLeft: '1rem' }}>
                                            <p>Expert</p>
                                        </div>
                                    </Link>
                                )}
                                <Link title={"This analogy was generated by " + searchResult.model + " AI model"}>
                                    <div className="nameplate" style={{ background: "linear-gradient(145deg, #b4e391, #61c419)", marginLeft: '1rem' }}>
                                        <p>{searchResult.model}</p>
                                    </div>
                                </Link>
                            </Card.Title>

                            <Row>
                                <Col md='11'>
                                    <div style={{display: 'inline-block', width: 'auto', cursor: 'pointer'}}>
                                        <Link title={link_title['prompt']}>
                                            <Card.Subtitle className="mb-2 text-muted">{searchResult.prompt}</Card.Subtitle>
                                        </Link>
                                    </div>
                                </Col>
                                <Col md='1'>
                                    <Card.Subtitle className="mb-2 text-muted">
                                    <Link title={link_title['temp']}>
                                        <div style={{display: 'inline-block', width: 'auto', cursor: 'pointer'}}>
                                            <FontAwesomeIcon icon={faTemperatureThreeQuarters} />{searchResult.temp}
                                        </div>
                                    </Link>
                                    </Card.Subtitle>
                                </Col>
                            </Row>
                        </div>
                        <br />
                        <Card.Text>
                            {searchResult.analogy} {searchResult.image && (
                                // <ImageTooltip image={searchResult.image}><FontAwesomeIcon icon={faImages} /></ImageTooltip>
                                <>
                                    <Link title={"Click to view/hide image"}>
                                        <FontAwesomeIcon onClick={() => setShowImage(!showImage)} icon={faImages} />
                                    </Link>
                                    {showImage && (
                                        <div>
                                            <img src={searchResult.image} style={{ width: '20vw', height: '20vh' }} />
                                        </div>
                                    )}
                                </>
                            )}
                        </Card.Text>
                        <Row>
                            <Col md='2' onClick={(e) => likeAnalogy(true, e)}>
                                <Link title={"Student: " + sLike + "; Teacher: " + tLike + "; Expert: " + eLike}>
                                    <div style={{display: 'inline-block', width: 'auto', cursor: 'pointer'}}>
                                        <FontAwesomeIcon icon={faThumbsUp} /> <span>{' '+ (sLike + tLike + eLike)}</span>
                                    </div>
                                </Link>
                            </Col>
                            <Col md='2' onClick={(e) => likeAnalogy(false, e)}>
                                <Link title={"Student: " + sDisLike + "; Teacher: " + tDisLike + "; Expert: " + eDisLike}>
                                    <div style={{display: 'inline-block', width: 'auto', cursor: 'pointer'}}>
                                        <FontAwesomeIcon icon={faThumbsDown} /> <span> {' ' + (sDisLike + tDisLike + eDisLike)}</span>
                                    </div>
                                </Link>
                            </Col>
                            <Col md='4' onClick={reportAnlogy}>
                                <div style={{display: 'inline-block', width: 'auto', cursor: 'pointer'}}>
                                    <FontAwesomeIcon icon={faFlag} style={{color: 'red'}}/> {' Report'}
                                </div>
                            </Col>
                            <Col md='4' onClick={() => commnetAnlogy(searchResult.pid)}>
                                <div style={{display: 'inline-block', width: 'auto', cursor: 'pointer'}}>
                                    <FontAwesomeIcon icon={faComment} /> {' Comment'}
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </>
        )}
        </>
    )
}

export default AnalogyCard
