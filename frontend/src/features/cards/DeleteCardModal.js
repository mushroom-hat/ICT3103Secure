import React, { useState } from 'react';
import { Modal, Button, Toast } from 'react-bootstrap';
import { useDeleteCardMutation } from './cardsApiSlice';

const DeleteCardModal = ({ cardSelected, show, handleClose }) => {
    const [deleteCard, { isSuccess, isError }] = useDeleteCardMutation();
    const [showDeleteToast, setShowDeleteToast] = useState(false);

    const handleDelete = async () => {
        setShowDeleteToast(true);
        await deleteCard({ id: cardSelected.id });
        if (isSuccess) {
            console.log('Deleted card successfully');
        }
        handleClose();
    };

    return (
        <>
            <Toast
                onClose={() => setShowDeleteToast(false)}
                show={showDeleteToast}
                delay={3000}
                autohide
                style={{
                    position: 'fixed',
                    top: 20,
                    right: 20,
                    zIndex: 9999,
                }}
            >
                <Toast.Header>
                    <strong className="mr-auto">Notification</strong>
                </Toast.Header>
                <Toast.Body>
                    {isSuccess ? (
                        <>
                            <i className="bi bi-check-circle-fill text-success"></i> Successfully deleted
                        </>
                    ) : isError ? (
                        <>
                            <i className="bi bi-x-circle-fill text-danger"></i> Failed to delete
                        </>
                    ) : null}
                </Toast.Body>
            </Toast>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this card?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        No
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DeleteCardModal;
