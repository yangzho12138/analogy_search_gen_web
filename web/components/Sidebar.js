import { useState } from 'react';
import { Nav, Button } from 'react-bootstrap';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <div className='sidebar' style={{ width: isOpen ? '250px' : '50px' }}>
            <Button onClick={toggleSidebar} className='toggleBtn' variant='light'>
                {isOpen ? '✖' : '☰'}
            </Button>
            {isOpen && (
                <Nav className="flex-column">
                    <Nav.Link href="#welcome_section">Welcome</Nav.Link>
                    <Nav.Link href="#analogy_section">Why Analogy</Nav.Link>
                    <Nav.Link href="#features_section">Features</Nav.Link>
                    <Nav.Item className="ms-3">
                        <Nav.Link href="#features_search_section">Search</Nav.Link>
                        <Nav.Link href="#features_generate_section">Generate</Nav.Link>
                        <Nav.Link href="#features_profile_section">Profile</Nav.Link>
                    </Nav.Item>
                    <Nav.Link href="#research_section">Research & Overall Version</Nav.Link>
                    <Nav.Link href="#disclaimer_section">Funding and Disclaimer</Nav.Link>
                </Nav>
            )}
        </div>
    );
};

export default Sidebar;
