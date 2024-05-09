import React, { useState } from 'react';
import Modal from '../components/Modal';
import { Card, Row, Col, Form, Button, ListGroup } from 'react-bootstrap'
import SpaceCard from '../components/SpaceCard';

const SpacesPage = ({spaces}) => {
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

    const handleSpaceCreate = (e) => {
        e.preventDefault();
        console.log("Assignment created")
        closeModal();
    }

    const joinSpace = () => {
        console.log("Join a space")
        openModal();
    }

    const handleJoinSpace = (e) => {
        e.preventDefault();
        console.log("Space joined")
        closeModal();
    }

    return (
        <div style={{margin: "3%"}}>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {newAssign ? (
                    <Form onSubmit={handleSpaceCreate} style={{margin: "5%"}}>
                        <Row><h3>Create A New Space</h3></Row>
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
                    <Form onSubmit={handleJoinSpace} style={{margin: "5%"}}>
                        <Row><h3>Join a Space</h3></Row>
                        <br />
                        <Row>
                            <Form.Group as={Col} md="12" controlId="code">
                                <Form.Label>Please enter the space invitation code</Form.Label>
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
                    <h1>My Spaces</h1>
                </Col>
                <Col md={6}>
                    <Button style={{float: 'right'}} variant="primary" onClick={joinSpace}>Join a Space</Button>
                </Col>
            </Row>
            <div>
                Description here
            </div>
            <div className="assignment-area">
                {spaces && spaces.length > 0 && (
                    <>
                        {
                            spaces.map((space, index) => {
                                return (
                                    <>
                                        <SpaceCard space={space} key={index}/>
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

SpacesPage.getInitialProps = async ({ req }) => {
    return { 
        spaces: [{
            'id': 1,
            'name': 'CS410 Spring 2024',
            'description': 'This is the first space',
            'code': '1234'
        },{
            'id': 2,
            'name': 'CS510 Spring 2024',
            'description': 'This is the second space',
            'code': 'abdsd'
        }]
     }
}

export default SpacesPage;