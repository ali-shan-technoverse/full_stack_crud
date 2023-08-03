//------------import end points---------------


//------------write and export api requests-------------
export const fetchPostReq = async (apiUrl, dataObj) => {
    const response = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(dataObj),
        cors: "no-cors",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    })
        .then((response) => response.json())
        .catch((err) => {
            console.log(err.message);
        });

    // console.log(response, "response");

    return response;
};

export const fetchGetReq = async (apiUrl)=>{
    const response = fetch(apiUrl)
        .then((response) => response.json())
        .catch((err) => {
            console.log(err.message);
        });
    // console.log(response, "response");
    return response;
}

export const fetchFormData = async(apiUrl, formData)=>{
    const response = fetch(apiUrl, {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("File uploaded successfully!", data);
            // Perform any additional actions after successful file upload
        })
        .catch((error) => {
            console.error("Error uploading file:", error);
            // Handle error scenarios
        });
    return response;
}
