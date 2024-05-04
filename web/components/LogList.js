import React, { useState } from 'react';
import { Table, Form, FormControl, Button, Pagination, Row, Col } from 'react-bootstrap';
import Modal from './Modal';
import useRequest from '../hooks/use-request';
import { useRouter } from 'next/router';

const auth_url = process.env.NEXT_PUBLIC_AUTH_BASE_URL;

const issueOptions = [
    'Offensive Content',
    'Spam',
    'Irrelevant',
    'Other'
]

const LogList = ({ logs, fields, searchFields, listFields, userInfo, type }) => {
    const router = useRouter();

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
    // console.log(indexOfFirstRecord, indexOfLastRecord, currentLogs)

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
        setComment('');
    }

    const seeDetail = (item) => {
        setLogDetail(item);
        openModal();
    }

    // fast reply
    const [comment, setComment] = useState('');

    const { doRequest: doRequestCommnet, errors: commentError } = useRequest({
        url: auth_url + '/api/users/comment',
        method: 'post',
        body: {
            comment,
            analogy: {
                'pid': logDetail?.pid,
                'analogy': logDetail?.analogy,
                'target': logDetail?.target,
                'prompt': logDetail?.prompt
            },
            replyTo: logDetail?.id,
            username: userInfo ? userInfo.username : "anonymous",
        },
        onSuccess: (data) => {
            alert('Thank you for your comment, if selected, it will be displayed.');
        },
    });

    const { doRequest: doRequestUpdateIssue, errors: updateIssueError } = useRequest({
        url: auth_url + '/api/users/issueInfo',
        method: 'put',
        body: {
            issue: logDetail?.issue,
            issueDetail: logDetail?.detail,
            issueId: logDetail?.id,
        },
        onSuccess: (data) => {
            alert('Thank you for your update, a memeber of our team will review the analogy shortly.');
        }
    });

    const fastReply = async(e) => {
        console.log('Fast reply:', comment);
        e.preventDefault();
        if(comment === ''){
            alert('Please enter a comment');
            return;
        }
        if(window.confirm('Are you sure you want to comment this analogy?')){
            await doRequestCommnet();
            closeModal();
        }
    }

    const updateIssue = async(e) => {
        e.preventDefault();
        console.log('Update issue:', logDetail?.issue, logDetail?.detail);
        if(logDetail?.issue === ''){
            alert('Please select an issue');
            return;
        }
        await doRequestUpdateIssue();
        closeModal();
        router.replace(router.asPath);
    }

    const renderFormControl = (field) => {
        if(field === 'analogy' || field === 'comment_origin' || field === 'comment_reply' || field === 'admin_comment'){
            return <Form.Control as="textarea" rows={3} value={logDetail?.[field]} readOnly/>
        } else if(field === 'issue'){ 
            if(String(logDetail?.solved) === 'true'){
                return <Form.Control type="text" value={logDetail?.[field]} readOnly/>
            } else {
                return (
                    <Form.Control as="select" value={logDetail?.[field]} onChange={(e) => {setLogDetail(prevDetails => (
                        {...prevDetails, [field]: e.target.value}
                    ))}}>
                        {issueOptions.map((option, index) => {
                            return <option key={index} value={option}>{option}</option>
                        })}
                    </Form.Control>
                )
            }
        } else if(field === 'detail'){
            if(String(logDetail?.solved) === 'true'){
                return <Form.Control as="textarea" rows={3} value={logDetail?.[field]} readOnly/>
            } else {
                return (
                <>
                    <Form.Control as="textarea" rows={3} value={logDetail?.[field]} onChange={(e) => {setLogDetail(prevDetails => (
                        {...prevDetails, [field]: e.target.value}
                    ))}}/>
                    <br />
                    <Button variant="primary" onClick={updateIssue}>Update Issue</Button>
                </>
                )
            }
        } else {
            return <Form.Control type="text" value={logDetail?.[field]} readOnly/>
        }
    }

    return(
        <div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {type === 'comment' && (
                    <h2>Reply Detail</h2>
                )}
                {type === 'genLog' && (
                    <>
                        <h2>Generation Log Detail</h2>
                        <div>
                            <Button variant="link" onClick={() => {
                                router.replace({
                                    pathname: '/gen',
                                    query: {
                                        preSetPrompt: logDetail?.prompt,
                                        preSetTarget: logDetail?.target,
                                        preSetSrc: logDetail?.src,
                                        preSetTemp: logDetail?.temp,
                                        preSetFreq_penalty: logDetail?.freq_penalty,
                                        preSetPres_penalty: logDetail?.pres_penalty,
                                        preSetMax_length: logDetail?.max_length,
                                        preSetTop_p: logDetail?.top_p,
                                        preSetBest_of: logDetail?.best_of,
                                    }
                                })
                            }}>Generate again based on these parameters</Button>
                        </div>
                    </>
                )}
                {type === 'searchLog' && (
                    <>
                        <h2>Search Log Detail</h2>
                        <div>
                            <Button variant="link" onClick={() => {
                                router.replace({
                                    pathname: '/',
                                    query: {
                                        preSetPrompt: logDetail?.prompt,
                                        preSetTemp: logDetail?.temp,
                                        preSetQuery: logDetail?.query,
                                    }
                                })
                            }}>Search again based on these parameters</Button>
                        </div>
                    </>

                )}
                {type === 'issue' && (
                    <h2>Issue History Detail</h2>
                )}
                <br />
                <Form>
                    {fields.map((field, index) => (
                        <div key={index}>
                            <Form.Group>
                                <Form.Label>{field}</Form.Label>
                                {/* {field === 'analogy' || field === 'comment_origin' || field === 'comment_reply' || field === 'admin_comment' || field === 'detail' ? (
                                    <Form.Control as="textarea" rows={3}value={logDetail?.[field]} readOnly/>
                                ) : (
                                    <Form.Control type="text" value={logDetail?.[field]} readOnly/>
                                )} */}
                                {renderFormControl(field)}
                            </Form.Group>
                            <br />
                        </div>
                    ))}
                    {type === 'comment' && (
                        <>
                            <Form.Group>
                                <Form.Label>Fast Reply</Form.Label>
                                <Form.Control as="textarea" value={comment} onChange={(e) => setComment(e.target.value)}/>
                                <br />
                                <Button variant="primary" onClick={fastReply}>Fast Reply</Button>
                            </Form.Group>
                        </>
                    )}
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
            <Table striped bordered hover className='custom-table'>
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
                        <td key={colIndex} className="table-cell">{String(item[field]) || ''}</td>
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