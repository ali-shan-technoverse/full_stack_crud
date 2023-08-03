import React, {useState} from "react";
import EditIcon from '@mui/icons-material/Edit';
import Form from "react-bootstrap/Form";
import { FormControlLabel, IconButton } from "@mui/material";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {fetchPostReq} from "../../components/restServices";
import {baseApiUrl} from "../../components/config";


const EditAction = ({ data, onEditSuccess }) => {
    const edit_user = baseApiUrl + 'update_user'
    const [show, setShow] = useState(false);
    const [editedData, setEditedData] = useState(data);

    const handleClose = () => setShow(false);

    const handleSaveChanges = async () => {
        try {
            const response = await fetchPostReq(edit_user, editedData);
            console.log(response);
            if (response === 'Done'){
                onEditSuccess()
            }
        } catch (error) {
            console.error("Error:", error);
        }
        console.log(editedData);
        handleClose();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newValue = name === 'RID' ? parseInt(value) : value;
        setEditedData((prevData) => ({ ...prevData, [name]: newValue  }));
    };

  const handleEditClick = () => {
      setShow(true)
      console.log(data, "data")
  };

  return (
      <>
    <FormControlLabel
      control={
        <IconButton
          color="secondary"
          aria-label="add an alarm"
          onClick={handleEditClick}
        >
          <EditIcon style={{ color: "#198754" }} />
        </IconButton>
      }
    />

    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Edit {data._username} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group controlId="formUID">
                    <Form.Label>UID</Form.Label>
                    <Form.Control
                        type="text"
                        name="UID"
                        value={editedData.UID}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Form.Group controlId="formUsername">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="text"
                        name="_password"
                        value={editedData._password}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Form.Group controlId="formRole">
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                        type="number"
                        name="RID"
                        value={editedData.RID}
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

export default EditAction;
