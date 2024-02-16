const Modal = ({ isOpen, onClose, children }) => {
    if(!isOpen) return null;

    return(
        <div className="modal">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <br />
                {children}
            </div>
            <style jsx>{`
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .modal-content {
                    width: 60%;
                    background: white;
                    padding: 20px;
                    border-radius: 4px;
                    max-height: 80vh;
                    overflow: auto;
                }
                .close-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    border: none;
                    background: none;
                    cursor: pointer;
                    font-size: 16px;
                }
            `}</style>
        </div>
    )
}

export default Modal;