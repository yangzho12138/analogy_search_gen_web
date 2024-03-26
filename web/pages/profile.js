import React from 'react';
import { useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import LogList from '../components/LogList';
import axios from 'axios';
import Modal from '../components/Modal';
import Link from '../components/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import useRequest from '../hooks/use-request';

const auth_url = process.env.NEXT_PUBLIC_AUTH_BASE_URL;

// const log = [
//     {
//         "created_at": "2021-08-10T00:00:00",
//         "prompt": "Explain <target> using an analogy.",
//         "target": "Cell",
//         "src": "Biology",
//         "temp": "0.5",
//         "freq_penalty": "0.5",
//         "pres_penalty": "0.5",
//         "max_length": "100",
//         "top_p": "0.5",
//         "best_of": "1",
//         "analogy": "Figure 2 shows the analogy generation interface. Users enter their OpenAI API key, the target concept, and optionally a source domain of their interest that the analogy should be about. Additionally, we provide a list of prompts that, Figure 2 shows the analogy generation interface. Users enter their OpenAI API key, the target concept, and optionally a source domain of their interest that the analogy should be about. Additionally, we provide a list of prompts that",
//     }
// ]

// const SLog = [
//     {
//         "created_at": "2021-08-10T00:00:00",
//         "query": "What is the capital of France?",
//         "prompt": "Explain <target> using an analogy.",
//         "temp": "0.5",
//     }
// ]

// fields shown in the detail modal
const genFields = [
    "created_at",
    "prompt",
    "target",
    "src",
    "temp",
    "freq_penalty",
    "pres_penalty",
    "max_length",
    "top_p",
    "best_of",
    "analogy"
]
// fields shown in the list
const genListFields = [
    "created_at",
    "target",
    "src",
]
// fields that can be searched
const genSearchFields = [
    "target",
    "src",
    "analogy"
]

const searchFields = [
    'created_at',
    'query',
    'prompt',
    'temp',
]

const searchListFields = [
    'created_at',
    'query',
    'prompt',
    'temp',
]

const searchSearchFields = [
    'query',
]

const issueFields = [
    "created_at",
    "issue",
    "detail",
    "target",
    "prompt",
    "analogy",
    "solved",
    "admin_comment"
]

const issueListFields = [
    "target",
    "issue",
    "solved"
]

const issueSearchFields = [
    "target",
    "issue",
    "solved"
]

const commentReplyFields = [
    'username',
    'created_at',
    'target',
    'prompt',
    'analogy',
    'comment_origin',
    'comment_reply',
]

const commentReplyListFields = [
    'username',
    'created_at',
    'target'
]

const commentReplySearchFields = [
    'username',
    'target'
]



const ProfilePage = ({userInfo, searchLog, genLog, issueLog, commentReplyInfo}) => {
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

    const { doRequest: doRequestUpdateNotification, errors: updateNotificationError } = useRequest({
        url: auth_url + '/api/users/info',
        method: 'put'
    });

    const handleSwitchChange = async () => {
        await doRequestUpdateNotification();
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
                <Col md={5}>
                    <Row style={{height: '20vh', marginRight: '1%'}}>
                        <Card style={{height: '100%'}}>
                            <Card.Body style={{overflow: 'auto'}}>
                                <Card.Title><h3>User Profile</h3></Card.Title>
                                <br />
                                <Form>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Check // prettier-ignore
                                        type="switch"
                                        id="custom-switch"
                                        label="Notification"
                                        onChange={handleSwitchChange}
                                        value={Boolean(userInfo.notification)}
                                    />
                                    <Link title={"Turn on to receive notification when your reported issue status changed or someone replied to your comment"}><FontAwesomeIcon style={{marginLeft: '10px'}} icon={faCircleQuestion} /></Link>
                                </div>
                                </Form>
                                <h6>Username: {userInfo.username}</h6>
                                <h6>Email: {userInfo.email}</h6>
                                <h6>Free API Key Remaining Usage Time: {userInfo.free_openai_api_key}</h6>
                                <a href="#" onClick={changePassword}>Change Password</a>
                            </Card.Body>
                        </Card>
                    </Row>
                    <br />
                    <Row style={{height: '32vh', marginRight: '1%'}}>
                        <Card style={{height: '100%'}}>
                            <Card.Body style={{overflow: 'auto'}}>
                                <Card.Title><h3>Issues</h3></Card.Title>
                                <LogList logs={issueLog} fields={issueFields} searchFields={issueSearchFields} listFields={issueListFields} userInfo={userInfo} type={'issue'}/>
                            </Card.Body>
                        </Card>
                    </Row>
                    <br />
                    <Row style={{height: '33vh', marginRight: '1%'}}>
                        <Card style={{height: '100%'}}>
                            <Card.Body style={{overflow: 'auto'}}>
                                <Card.Title><h3>Comments</h3></Card.Title>
                                <LogList logs={commentReplyInfo} fields={commentReplyFields} searchFields={commentReplySearchFields} listFields={commentReplyListFields} userInfo={userInfo} type={'comment'}/>
                            </Card.Body>
                        </Card>
                    </Row>
                </Col>
                <Col md={7}>
                    <Row style={{height: '45vh'}}>
                        <Card style={{height: '100%'}}>
                            <Card.Body style={{overflow: 'auto'}}>
                                <Card.Title><h3>Search Log</h3></Card.Title>
                                <LogList logs={searchLog} fields={searchFields} searchFields={searchSearchFields} listFields={searchListFields} userInfo={userInfo} type={'searchLog'}/>
                            </Card.Body>
                        </Card>
                    </Row>
                    <br />
                    <Row style={{height: '45vh'}}>
                        <Card style={{height: '100%'}}>
                        <Card.Body style={{overflow: 'auto'}}>
                                <Card.Title><h3>Generation Log</h3></Card.Title>
                                <LogList logs={genLog} fields={genFields} searchFields={genSearchFields} listFields={genListFields} userInfo={userInfo} type={'genLog'}/>
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
    let searchLog = [];
    let genLog = [];
    let issueLog = [];
    let commentReplyInfo = [];

    try{
        const res = await axios.get( auth_url + '/api/users/info', {
            headers: {
                cookie: cookies
            },
            withCredentials: true,
        });
        // console.log(res);
        if(res.status == 200){
            userInfo = res.data.data;
            console.log(userInfo);
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
        // console.log(res);
        if(res.status == 200){
            searchLog = res.data.data.logs;
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
        // console.log(res);
        if(res.status == 200){
            genLog = res.data.data.logs;
        }
    } catch(err){
        console.log(err);
    }

    try{
        const res = await axios.get( auth_url + '/api/users/issueInfo', {
            headers: {
                cookie: cookies
            },
            withCredentials: true,
        });
        // console.log(res);
        if(res.status == 200){
            issueLog = res.data.data.issues;
            // console.log("issueLog");
            console.log(issueLog);
        }
    } catch(err){
        console.log(err);
    }

    try{
        const res = await axios.get( auth_url + '/api/users/commentReplyInfo', {
            headers: {
                cookie: cookies
            },
            withCredentials: true,
        });
        console.log(res);
        if(res.status == 200){
            commentReplyInfo = res.data.data.replies;
            console.log(commentReplyInfo);
        }
    } catch(err){
        console.log(err);
    }

    return {
        userInfo,
        searchLog,
        genLog,
        issueLog,
        commentReplyInfo
    }
}

export default ProfilePage;