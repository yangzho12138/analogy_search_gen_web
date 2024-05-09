import React, { useState } from 'react';
import Modal from '../components/Modal';
import { Card, Row, Col, Form, Button, ListGroup } from 'react-bootstrap'
import AssignmentCard from '../components/AssignmentCard';

const AssignmentsPage = ({assignments}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [newAssign, setNewAssign] = useState(false);
    const [code, setCode] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setNewAssign(false);
        setIsModalOpen(false);
    }


    const createNewAssignment = () => {
        console.log("Create new assignment")
        setNewAssign(true);
        openModal();
    }

    const handleAssignmentCreate = (e) => {
        e.preventDefault();
        console.log("Assignment created")
        closeModal();
    }

    const joinAssignment = () => {
        console.log("Join an assignment")
        openModal();
    }

    const handleJoinAssignment = (e) => {
        e.preventDefault();
        console.log("Assignment joined")
        closeModal();
    }

    return (
        <div style={{margin: "3%"}}>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {newAssign ? (
                    <Form onSubmit={handleAssignmentCreate} style={{margin: "5%"}}>
                        <Row><h3>Create A New Assignment</h3></Row>
                        <br />
                        <Row>
                            <Form.Group as={Col} md="12" controlId="name">
                                <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        value = {name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group as={Col} controlId="description">
                                <Form.Label>Description (optional)</Form.Label>
                                <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)}/>
                            </Form.Group>
                        </Row>
                        <br />
                        <Button type="submit" variant="primary">Submit</Button>
                    </Form>
                ) : (
                    <Form onSubmit={handleJoinAssignment} style={{margin: "5%"}}>
                        <Row><h3>Join an assignment</h3></Row>
                        <br />
                        <Row>
                            <Form.Group as={Col} md="12" controlId="code">
                                <Form.Label>Please enter the assignment invitation code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        value = {code}
                                        onChange={(e) => setCode(e.target.value)}
                                    />
                                </Form.Group>
                        </Row>
                        <br />
                        <Button type="submit" variant="primary">Join</Button>
                    </Form>
                )}
            </Modal>
            <Row>
                <Col md={6}>
                    <h1>My Assignments</h1>
                </Col>
                <Col md={6}>
                    <Button style={{float: 'right'}} variant="primary" onClick={joinAssignment}>Join an Assignment</Button>
                </Col>
            </Row>
            <div>
                Description here
            </div>
            <div className="assignment-area">
                {assignments && assignments.length > 0 && (
                    <>
                        {
                            assignments.map((assignment, index) => {
                                return (
                                    <>
                                        <AssignmentCard assignment={assignment} key={index}/>
                                    </>
                                )
                            })
                        }
                    </>
                )}
                <div className="assignment-new" onClick={createNewAssignment}>
                    <div style={{fontSize: '600%'}}>+</div>
                </div>
            </div>

        </div>
    )
}

AssignmentsPage.getInitialProps = async ({ req }) => {
    return { 
        assignments: [{
            'id': 1,
            'name': 'CS410 Spring 2024',
            'description': 'This is the first assignment',
            'code': '1234'
        },{
            'id': 2,
            'name': 'CS510 Spring 2024',
            'description': 'This is the second assignment',
            'code': 'abdsd'
        }]
     }
}

export default AssignmentsPage;