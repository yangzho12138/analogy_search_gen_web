import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ isLoading }) => {
  return (
    <Modal
      show={isLoading}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Body className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Modal.Body>
    </Modal>
  );
};

export default LoadingSpinner;
