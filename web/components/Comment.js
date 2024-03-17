import React from 'react'
import { Row, Button } from 'react-bootstrap'

const Comment = ({comment, replyToComment}) => {
    const replyTo = () => {
        replyToComment(comment.id, comment.username)
    }
    return (
      <div style={{marginLeft: '3%', marginRight: '3%'}}>
        <Row style={{fontSize: '115%'}}>
            {comment.username} {" · "} {comment.created_at}
        </Row>
        {comment.replyTo_comment && 
            <Row>
                <div style={{backgroundColor: 'grey'}}>{"@"}{comment.replyTo_username}{": "}{comment.replyTo_comment}</div>
            </Row>
        }
        <Row>
            {comment.comment}
        </Row>
        <Button variant="link" style={{float: 'right'}} onClick={replyTo}>Reply</Button>
        <br />
        <hr/>
        </div>
    )
  }
  
  export default Comment