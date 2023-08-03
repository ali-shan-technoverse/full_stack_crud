import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { FormControlLabel, IconButton } from "@mui/material";
import {fetchPostReq} from "../../components/restServices";
import {baseApiUrl} from "../../components/config";

const RemoveAction = ({ index, onRemoveSuccess }) => {
    const remove_user = baseApiUrl + 'remove_user'
  const handleRemoveClick = async () => {
      try {
          const response = await fetchPostReq(remove_user, {UID: index});
          console.log(response);
          if (response === 'Done'){
              onRemoveSuccess()
          }
      } catch (error) {
          console.error("Error:", error);
      }
  };

  return (
    <FormControlLabel
      control={
        <IconButton
          color="secondary"
          aria-label="add an alarm"
          onClick={handleRemoveClick}
        >
          <DeleteIcon style={{ color: "#dc3545" }} />
        </IconButton>
      }
    />
  );
};

export default RemoveAction;
