import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faPlus, faDownload } from '@fortawesome/free-solid-svg-icons';
import Link from "../components/Link";
import { useState } from 'react';

const QuestionCard = ({ type, items, onSendMessage }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    
    const filteredItems = items.filter((q) =>
        q.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const chooseItem = (type, id) => {
        console.log(id)
        onSendMessage("choose", type, id, null);
    };

    const deleteItem = (e, type, id) => {
        e.stopPropagation();
        onSendMessage("delete", type, id, null);
    }

    const AddItem = (e, id, name) => {
        e.stopPropagation();
        onSendMessage("add", "question", id, name);
    }

    const DownloadItem = (e, id, name) => {
        e.stopPropagation();
        onSendMessage("download", "questionnaire", id, name);
    }

    return (
        <div style={{ 
            display: 'flex',   
            flexDirection: 'column', 
            height: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
        }}>
            <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleSearch}
                style={{
                    marginBottom: '10px',
                    padding: '5px',
                    width: '80%',
                }}
            />
            <div style={{ 
                flexGrow: 1,
                overflowY: 'auto',
                padding: '5px',
                boxSizing: 'border-box',
                height: "60%"
            }}>
                {filteredItems.map((q, index) => (
                    <div
                    key={index}
                    className='question-card'
                    style={{
                        cursor: 'pointer',
                        border: '1px solid black',
                        borderRadius: '5px',
                        padding: '5px',
                        marginBottom: '5px',
                        marginRight: '5px',
                        display: 'inline-block',
                        wordBreak: 'break-word',
                        maxWidth: '100%',
                        alignSelf: 'flex-start'
                    }}
                    onClick={() => chooseItem(type, q.id)}
                >
                    {q.name} 
                    {type === "question" && (
                        <Link title="Add this question to current questionnaire">
                            <FontAwesomeIcon icon={faPlus} size="sm" style={{marginLeft: '5px'}} onClick={(e) => AddItem(e, q.id, q.name)}/>
                        </Link>
                    )}
                    {type === "questionnaire" && (
                        <Link title="Download this questionnaire">
                            <FontAwesomeIcon icon={faDownload} size="sm" style={{marginLeft: '5px'}} onClick={(e) => DownloadItem(e, q.id, q.name)}/>
                        </Link>
                    )}
                    <Link title={"Delete this " + type}>
                        <FontAwesomeIcon icon={faX} size="2xs" style={{marginLeft: '5px'}} onClick={(e) => deleteItem(e, type, q.id)}/>
                    </Link>
                </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionCard;