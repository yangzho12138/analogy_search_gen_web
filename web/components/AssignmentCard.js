import { Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import Link from './Link';

const AssignmentCard = ({ assignment }) => {

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code)
            .then(() => {
                alert('Invitation code copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text to clipboard', err);
            });
    };

    const enterAssignment = (id) => {
        console.log(`Entering assignment with id: ${id}`);
    }

    return (
        <Card style={{ width: '30%', height: '50%', display: 'flex', margin:'1%', overflow: 'auto' }}>
            <Card.Header>{assignment.name} <Link title='Enter Assignment'><FontAwesomeIcon icon={faRightToBracket} onClick={() => enterAssignment(assignment.id)}/></Link></Card.Header>
            <Card.Body>
                <Card.Text>
                    {assignment.description && assignment.description.length !== 0 ? (
                        <>
                            {assignment.description}
                        </>
                    ):(
                        <>
                            No description for this assignment
                        </>
                    )}
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                Invitation Code: {assignment.code} <Link title='Copy Invitation Code'><FontAwesomeIcon style={{marginLeft: '1%', cursor: 'pointer'}} icon={faCopy} onClick={() => copyToClipboard(assignment.code)}/></Link>
            </Card.Footer>
        </Card>
    )
}

export default AssignmentCard;