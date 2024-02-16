import React, { useState } from 'react';
import { Table, Form, FormControl, Button, Pagination, Row, Col } from 'react-bootstrap';
import Modal from './Modal';

const LogList = ({ logs, fields, searchFields, listFields }) => {
    const [searchField, setSearchField] = useState(''); // The field to search by
    const [searchTerm, setSearchTerm] = useState(''); // The search term
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const recordsPerPage = 5; // Records per page

    // Filter items based on search term and field
    const filteredLogs = logs.filter(log => {
        if (searchField === '') {
            return Object.keys(log).some(key => {
                const value = log[key];
                return typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase());
            });
        } else {
            return log[searchField]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        }
    });


    // Calculate total pages
    const totalPages = Math.ceil(filteredLogs.length / recordsPerPage);

    // Calculate the items to show on the current page
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstRecord, indexOfLastRecord);
    console.log(indexOfFirstRecord, indexOfLastRecord, currentLogs)

    // Generate pagination items
    let paginationItems = [];
    paginationItems.push(
        <Pagination.Prev key="prev" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
    );
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
                {number}
            </Pagination.Item>,
        );
    }
    paginationItems.push(
        <Pagination.Next key="next" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [logDetail, setLogDetail] = useState(null);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setLogDetail(null);
    }

    const seeDetail = (item) => {
        setLogDetail(item);
        openModal();
    }

    return(
        <div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h2>Log Detail</h2>
                <br />
                <Form>
                    {fields.map((field, index) => (
                        <div key={index}>
                            <Form.Group>
                                <Form.Label>{field}</Form.Label>
                                {field === 'analogy' ? (
                                    <Form.Control as="textarea" rows={3}value={logDetail?.[field]} readOnly/>
                                ) : (
                                    <Form.Control type="text" value={logDetail?.[field]} readOnly/>
                                )}
                            </Form.Group>
                            <br />
                        </div>
                    ))}
                </Form>
            </Modal>
            <Form inline>
            <Form.Group>
                <Row>
                    <Col md={3}>
                        <Form.Control as="select" className="mr-sm-2" onChange={(e) => setSearchField(e.target.value)}>
                            <option value="">Search Field</option>
                            {searchFields.map((field, index) => (
                                <option key={index} value={field}>{field}</option>
                            ))}
                        </Form.Control>
                    </Col>
                    <Col md={6}>
                        <FormControl
                            type="text"
                            placeholder="Search"
                            className="mr-sm-2"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Col>
                    <Col md={3}>
                        <Button variant="outline-success" onClick={() => setCurrentPage(1)}>Search</Button>
                    </Col>
                </Row>
                </Form.Group>
            </Form>
            <br />
            <Table striped bordered hover>
                <thead>
                <tr>
                    {listFields.map((field, index) => (
                        <th key={index}>{field}</th>
                    ))}
                    <th>details</th>
                </tr>
                </thead>
                <tbody>
                {currentLogs.map((item, rowIndex) => (
                    <tr key={rowIndex}>
                    {listFields.map((field, colIndex) => (
                        <td key={colIndex} className="table-cell">{item[field] || ''}</td>
                    ))}
                    <td><a href="#" onClick={(e) => {
                        e.preventDefault();
                        seeDetail(item);
                    }}>detail</a></td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Pagination>{paginationItems}</Pagination>
        </div>
    )
}

export default LogList;