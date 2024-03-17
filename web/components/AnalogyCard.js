import React, { use } from 'react'
import { Card, Row, Col, Form, Button, ListGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown, faFlag, faTemperatureThreeQuarters, faComment } from '@fortawesome/free-solid-svg-icons'
import Modals from './Modal';
import { useState } from 'react';
import useRequest from '../hooks/use-request';
import Comment from './Comment';

const auth_url = process.env.NEXT_PUBLIC_AUTH_BASE_URL;

const issueOptions = [
    'Offensive Content',
    'Spam',
    'Irrelevant',
    'Other'
]

const AnalogyCard = ({searchResult, isCard, userInfo }) => {
    // console.log(isCard)
    // console.log(userInfo)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsIssue(false);
        // setShowComments(false);
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

    const { doRequest: doRequestReport, errors: reportError } = useRequest({
        url: auth_url + '/api/users/flag',
        method: 'post',
        body: {
            issue,
            details: issueDetails,
            analogy: searchResult,
            username: userInfo.username,
        },
        onSuccess: (data) => {
            alert('Thank you for your report, a memeber of our team will review the analogy shortly.');
        }
    });

    const { doRequest: doRequestCommnet, errors: commentError } = useRequest({
        url: auth_url + '/api/users/comment',
        method: 'post',
        body: {
            comment,
            analogy: searchResult,
            replyTo: replyToId,
            username: userInfo.username,
        },
        onSuccess: (data) => {
            alert('Thank you for your comment, if selected, it will be displayed.');
        },
    });

    const { doRequest: doRequestComments, errors: commentsError } = useRequest({
        url: auth_url + '/api/users/comment?pid=' + searchResult.pid,
        method: 'get',
        onSuccess: (data) => {
            setComments(data.data.comments);
        }
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

    const likeAnalogy = (isLike) => {
        
    }

    const commnetAnlogy = async() => {
        console.log('comment analogy')
        setComment('');
        setReplyToId(null);

        await doRequestComments();
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
            await doRequestCommnet();
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
        <Modals isOpen={isModalOpen} onClose={closeModal}>
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
                                    <div style={{maxHeight: '60vh', overflowY: 'auto', border: '1px solid grey',  borderRadius: '10px', padding: '10px'}}>
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
        </Modals>
        {isCard === true || isCard === 'true' ? (
            <Card style={{ width: '30%', height: '50%', display: 'inline-block', margin:'1%' }}>
                <Card.Body style={{height: '100%'}}>
                    <Card.Title>{searchResult.target}</Card.Title>
                    <Row>
                        <Col md='10'>
                            <Card.Subtitle className="mb-2 text-muted">{searchResult.prompt}</Card.Subtitle>
                        </Col>
                        <Col md='2'>
                            <Card.Subtitle className="mb-2 text-muted">
                                <FontAwesomeIcon icon={faTemperatureThreeQuarters} />{' ' + searchResult.temp}
                            </Card.Subtitle>
                        </Col>
                    </Row>
                    <Card.Text style={{maxHeight: '60%', overflowY: 'auto', border: '1px solid grey',  borderRadius: '10px', padding: '10px'}}>
                        {searchResult.analogy}
                    </Card.Text>
                    <Row>
                        <Col md='2' onClick={() => likeAnalogy(true)} style={{ cursor: 'pointer' }}>
                            <FontAwesomeIcon icon={faThumbsUp} /> {' ' + searchResult.likes}
                        </Col>
                        <Col md='2' onClick={() => likeAnalogy(false)} style={{ cursor: 'pointer' }}>
                            <FontAwesomeIcon icon={faThumbsDown} /> {' ' + searchResult.dislikes}
                        </Col>
                        <Col md='4' onClick={reportAnlogy} style={{ cursor: 'pointer' }}>
                            <FontAwesomeIcon icon={faFlag} style={{color: 'red'}}/> {' Report'}
                        </Col>
                        <Col md='4' onClick={() => commnetAnlogy(searchResult.pid)} style={{ cursor: 'pointer' }}>
                            <FontAwesomeIcon icon={faComment} /> {' Comment'}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        ) : (
            <>
                <Card style={{ width: '90%'}}>
                    <Card.Body>
                        <div style={{backgroundColor: '#a9dafa', padding: '1%'}}>
                            <Card.Title>{searchResult.target}</Card.Title>
                            <Row>
                                <Col md='11'>
                                    <Card.Subtitle className="mb-2 text-muted">{searchResult.prompt}</Card.Subtitle>
                                </Col>
                                <Col md='1'>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        <FontAwesomeIcon icon={faTemperatureThreeQuarters} />{' ' + searchResult.temp}
                                    </Card.Subtitle>
                                </Col>
                            </Row>
                        </div>
                        <br />
                        <Card.Text>
                            {searchResult.analogy}
                        </Card.Text>
                        <Row>
                            <Col md='2' onClick={() => likeAnalogy(true)} style={{ cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={faThumbsUp} /> {' ' + searchResult.likes}
                            </Col>
                            <Col md='2' onClick={() => likeAnalogy(false)} style={{ cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={faThumbsDown} /> {' ' + searchResult.dislikes}
                            </Col>
                            <Col md='4' onClick={reportAnlogy} style={{ cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={faFlag} style={{color: 'red'}}/> {' Report'}
                            </Col>
                            <Col md='4' onClick={() => commnetAnlogy(searchResult.pid)} style={{ cursor: 'pointer' }}>
                            <FontAwesomeIcon icon={faComment} /> {' Comment'}
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