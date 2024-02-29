import React from 'react';
import { useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import LogList from '../components/LogList';
import axios from 'axios';
import Modal from '../components/Modal';

const auth_url = process.env.NEXT_PUBLIC_AUTH_BASE_URL;

const log = [
    {
        "created_at": "2021-08-10T00:00:00",
        "prompt": "P1: Explain <target> using an analogy.",
        "target": "Cell",
        "src": "Biology",
        "tmp": "0.5",
        "freq_penalty": "0.5",
        "pres_penalty": "0.5",
        "max_length": "100",
        "top_p": "0.5",
        "best_of": "1",
        "analogy": "Figure 2 shows the analogy generation interface. Users enter their OpenAI API key, the target concept, and optionally a source domain of their interest that the analogy should be about. Additionally, we provide a list of prompts that, Figure 2 shows the analogy generation interface. Users enter their OpenAI API key, the target concept, and optionally a source domain of their interest that the analogy should be about. Additionally, we provide a list of prompts that",
    },
    {
        "created_at": "2021-08-10T00:00:00",
        "prompt": "P1: Explain <target> using an analogy.",
        "target": "Football",
        "src": "Biology",
        "tmp": "0.5",
        "freq_penalty": "0.5",
        "pres_penalty": "0.5",
        "max_length": "100",
        "top_p": "0.5",
        "best_of": "1",
        "analogy": "Figure 2 shows the analogy generation interface. Users enter their OpenAI API key, the target concept, and optionally a source domain of their interest that the analogy should be about. Additionally, we provide a list of prompts that, Figure 2 shows the analogy generation interface. Users enter their OpenAI API key, the target concept, and optionally a source domain of their interest that the analogy should be about. Additionally, we provide a list of prompts that",
    },
    {
        "created_at": "2021-08-10T00:00:00",
        "prompt": "P1: Explain <target> using an analogy.",
        "target": "Cell",
        "src": "Biology",
        "tmp": "0.5",
        "freq_penalty": "0.5",
        "pres_penalty": "0.5",
        "max_length": "100",
        "top_p": "0.5",
        "best_of": "1",
        "analogy": "Figure 2 shows the analogy generation interface. Users enter their OpenAI API key, the target concept, and optionally a source domain of their interest that the analogy should be about. Additionally, we provide a list of prompts that, Figure 2 shows the analogy generation interface. Users enter their OpenAI API key, the target concept, and optionally a source domain of their interest that the analogy should be about. Additionally, we provide a list of prompts that",
    },
    {
        "created_at": "2021-08-10T00:00:00",
        "prompt": "P1: Explain <target> using an analogy.",
        "target": "Football",
        "src": "Biology",
        "tmp": "0.5",
        "freq_penalty": "0.5",
        "pres_penalty": "0.5",
        "max_length": "100",
        "top_p": "0.5",
        "best_of": "1",
        "analogy": "Figure 2 shows the analogy generation interface. Users enter their OpenAI API key, the target concept, and optionally a source domain of their interest that the analogy should be about. Additionally, we provide a list of prompts that, Figure 2 shows the analogy generation interface. Users enter their OpenAI API key, the target concept, and optionally a source domain of their interest that the analogy should be about. Additionally, we provide a list of prompts that",
    },
    {
        "created_at": "2021-08-10T00:00:00",
        "prompt": "P1: Explain <target> using an analogy.",
        "target": "Cell",
        "src": "Biology",
        "tmp": "0.5",
        "freq_penalty": "0.5",
        "pres_penalty": "0.5",
        "max_length": "100",
        "top_p": "0.5",
        "best_of": "1",
        "analogy": "Figure 2 shows the analogy generation interface. Users enter their OpenAI API key, the target concept, and optionally a source domain of their interest that the analogy should be about. Additionally, we provide a list of prompts that, Figure 2 shows the analogy generation interface. Users enter their OpenAI API key, the target concept, and optionally a source domain of their interest that the analogy should be about. Additionally, we provide a list of prompts that",
    },
    {
        "created_at": "2021-08-10T00:00:00",
        "prompt": "P1: Explain <target> using an analogy.",
        "target": "Football",
        "src": "Biology",
        "tmp": "0.5",
        "freq_penalty": "0.5",
        "pres_penalty": "0.5",
        "max_length": "100",
        "top_p": "0.5",
        "best_of": "1",
        "analogy": "Figure 2 shows the analogy generation interface. Users enter their OpenAI API key, the target concept, and optionally a source domain of their interest that the analogy should be about. Additionally, we provide a list of prompts that, Figure 2 shows the analogy generation interface. Users enter their OpenAI API key, the target concept, and optionally a source domain of their interest that the analogy should be about. Additionally, we provide a list of prompts that",
    }
]

const genFields = [
    "created_at",
    "prompt",
    "target",
    "src",
    "tmp",
    "freq_penalty",
    "pres_penalty",
    "max_length",
    "top_p",
    "best_of",
    "analogy"
]

const genListFields = [
    "created_at",
    "target",
    "src",
]

const genSearchFields = [
    "target",
    "src",
    "analogy"
]



const ProfilePage = ({userInfo, searchLog, genLog}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const changePassword = () => {
        openModal();
    }

    const submitPasswordChange = async (e) => {
        e.preventDefault();
        if(oldPassword === '' || newPassword === '' || confirmPassword === ''){
            window.alert("Please fill in all fields");
            return;
        }
        if(newPassword !== confirmPassword){
            window.alert("New password and confirm password do not match");
            return;
        }
        // api call

    }


    return (
        <div style={{margin: "3%"}}>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h2>Change Password</h2>
                <br />
                <Form onSubmit={submitPasswordChange}>
                    <Form.Group>
                        <Form.Label>Old Password</Form.Label>
                        <Form.Control type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
                    </Form.Group>
                    <br />
                    <Form.Group>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                    </Form.Group>
                    <br />
                    <Form.Group>
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </Form.Group>
                    <br />
                    <Button type="submit">Change Password</Button>
                </Form>
            </Modal>
            <Row>
                <a href="/">Back</a>
            </Row>
            <br />
            <Row style={{height: '90vh'}}>
                <Col md={4}>
                    <Card style={{height: '100%'}}>
                        <Card.Body>
                            <Card.Title><h3>User Profile</h3></Card.Title>
                            <br />
                            <h6>Username: {userInfo.username}</h6>
                            <h6>Email: {userInfo.email}</h6>
                            <h6>Free API Key Remaining Usage Time: {userInfo.free_openai_api_key}</h6>
                            <a href="#" onClick={changePassword}>Change Password</a>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Row style={{height: '45vh'}}>
                        <Card style={{height: '100%'}}>
                            <Card.Body>
                                <Card.Title><h3>Search Log</h3></Card.Title>
                            </Card.Body>
                        </Card>
                    </Row>
                    <br />
                    <Row style={{height: '45vh'}}>
                        <Card style={{height: '100%'}}>
                        <Card.Body style={{overflow: 'auto'}}>
                                <Card.Title><h3>Generation Log</h3></Card.Title>
                                <LogList logs={log} fields={genFields} searchFields={genSearchFields} listFields={genListFields}/>
                            </Card.Body>
                        </Card>
                    </Row>
                </Col>
            </Row>
            
        </div>
    )
}

ProfilePage.getInitialProps = async ({ req }) => {
    let cookies = '';
    if (req && req.headers.cookie) {
        cookies = req.headers.cookie;
    }

    let userInfo = null;
    let searchLog = null;
    let genLog = null;

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

    try{
        const res = await axios.get( auth_url + '/api/users/searchLogs', {
            headers: {
                cookie: cookies
            },
            withCredentials: true,
        });
        console.log(res);
        if(res.status == 200){
            searchLog = res.data.data;
        }
    } catch(err){
        console.log(err);
    }

    try{
        const res = await axios.get( auth_url + '/api/users/genLogs', {
            headers: {
                cookie: cookies
            },
            withCredentials: true,
        });
        console.log(res);
        if(res.status == 200){
            genLog = res.data.data;
        }
    } catch(err){
        console.log(err);
    }

    return {
        userInfo,
        searchLog,
        genLog,
    }
}

export default ProfilePage;