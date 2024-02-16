import React from 'react'
import { Card, Row, Col, Form, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown, faFlag } from '@fortawesome/free-solid-svg-icons'
import Modals from './Modal';
import { useState } from 'react';

const issueOptions = [
    'Offensive Content',
    'Spam',
    'Irrelevant',
    'Other'
]

const AnalogyCard = ({searchResult}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [issue, setIssue] = useState('');
    const [comment, setComment] = useState('');

    const ReportAnlogy = () => {
        console.log('report analogy')
        setIssue('');
        setComment('');
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

            // close modal
            closeModal();
            alert('Thank you for your report, a memeber of our team will review the analogy shortly.');
        }
    }

    const likeAnalogy = (isLike) => {
        
    }
    

    return (
        <>
        <Modals isOpen={isModalOpen} onClose={closeModal}>
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
                            <Form.Label>Comment (optional)</Form.Label>
                            <Form.Control as="textarea" rows={3} value={comment} onChange={(e) => setComment(e.target.value)}/>
                        </Form.Group>
                    </Row>
                    <br />
                    <Button type="submit" variant="primary">Submit</Button>
            </Form>

        </Modals>
        <Card style={{ width: '30%', height: '45%', display: 'inline-block', margin:'1%' }}>
            <Card.Body style={{height: '100%'}}>
                <Card.Title>{searchResult.target}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{searchResult.prompt}</Card.Subtitle>
                <Card.Text style={{maxHeight: '60%', overflowY: 'auto', border: '1px solid grey',  borderRadius: '10px', padding: '10px'}}>
                    {searchResult.analogy}
                </Card.Text>
                <Row>
                    <Col md='4' onClick={likeAnalogy(true)} style={{ cursor: 'pointer' }}>
                        <FontAwesomeIcon icon={faThumbsUp} /> {' Like(' + searchResult.likes + ')'}
                    </Col>
                    <Col md='4' onClick={likeAnalogy(false)} style={{ cursor: 'pointer' }}>
                        <FontAwesomeIcon icon={faThumbsDown} /> {' Dislike(' + searchResult.dislikes + ')'}
                    </Col>
                    <Col md='4' onClick={ReportAnlogy} style={{ cursor: 'pointer' }}>
                        <FontAwesomeIcon icon={faFlag} style={{color: 'red'}}/> {' Report'}
                    </Col>
                </Row>
            </Card.Body>
        </Card>
        </>
    )
}

export default AnalogyCard