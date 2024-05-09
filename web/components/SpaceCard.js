import { Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import Link from '../components/Link';

const SpaceCard = ({ space }) => {

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code)
            .then(() => {
                alert('Invitation code copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text to clipboard', err);
            });
    };

    const enterSpace = (id) => {
        console.log(`Entering space with id: ${id}`);
    }

    return (
        <Card style={{ width: '30%', height: '50%', display: 'flex', margin:'1%', overflow: 'auto' }}>
            <Card.Header>{space.name} <Link title='Enter Space'><FontAwesomeIcon icon={faRightToBracket} onClick={() => enterSpace(space.id)}/></Link></Card.Header>
            <Card.Body>
                <Card.Text>
                    {space.description && space.description.length !== 0 ? (
                        <>
                            {space.description}
                        </>
                    ):(
                        <>
                            No description for this space
                        </>
                    )}
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                Invitation Code: {space.code} <Link title='Copy Invitation Code'><FontAwesomeIcon style={{marginLeft: '1%', cursor: 'pointer'}} icon={faCopy} onClick={() => copyToClipboard(space.code)}/></Link>
            </Card.Footer>
        </Card>
    )
}

export default SpaceCard;