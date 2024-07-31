import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const auth_url = process.env.NEXT_PUBLIC_AUTH_BASE_URL;

const question = ({userInfo, collectedAnalogies, questions}) => {
    return (
        <div style={{margin: "3%"}}>
            <Row>
                <Col md='4'>
                    <Card style={{height: '100%'}}>
                        <Card.Body style={{overflow: 'auto'}}>
                            <Card.Title>Analogy Collection</Card.Title>
                            
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

question.getInitialProps = async ( { req } ) => {
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

export default question;