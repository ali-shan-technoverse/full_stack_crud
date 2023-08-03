import React, {useState} from "react";
import EditIcon from '@mui/icons-material/Edit';
import Form from "react-bootstrap/Form";
import { FormControlLabel, IconButton } from "@mui/material";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {fetchPostReq} from "../../components/restServices";
import {baseApiUrl} from "../../components/config";


const AddAction = ({onUserAdd}) => {
    const edit_user = baseApiUrl + 'add_user'
    const [show, setShow] = useState(false);
    const [addedData, setAddedData] = useState( {
        "_password": "",
        "RID": "",
        "_username": ""
    }, );

    const handleClose = () => setShow(false);

    const handleSaveChanges = async () => {
        try {
            const response = await fetchPostReq(edit_user, addedData);
            console.log(response);
            if (response === 'Done'){
                onUserAdd()
            }
        } catch (error) {
            console.error("Error:", error);
        }
        console.log(addedData);
        handleClose();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newValue = name === 'RID' ? parseInt(value) : value;
        setAddedData((prevData) => ({ ...prevData, [name]: newValue  }));
    };

    const handleAddClick = () => {
        setShow(true)
        console.log(addedData, "data")
    };

    return (
        <>            
            <Button color="secondary"
                    aria-label="add a user"
                    onClick={handleAddClick}>
                Add User
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add User </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="_username"
                                value={addedData._username}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formUID">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="text"
                                name="_password"
                                value={addedData._password}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formRole">
                            <Form.Label title="0 for user, 1 for admin">Role</Form.Label>
                            <Form.Control
                                type="number"
                                name="RID"
                                value={addedData.RID}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal> </>
    );
};

export default AddAction;
