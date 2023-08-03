import React, { useState, useEffect } from "react";
import { Card, Container, Row, Form, Button } from "react-bootstrap";
import {fetchGetReq, fetchPostReq} from "../components/restServices";
import {baseApiUrl} from "../components/config";
import {Navigate} from "react-router-dom";

function Login() {

  const user_login = baseApiUrl + 'login'
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    document.title = "Acenxion | Lab Login";
    if (!localStorage.getItem('_session_token')){
        setLoggedIn(false)
    }
  }, []);


 async function handleSubmit() {
     const req_Data={
         _username : userName,
         _password : password,
         _session_token: localStorage.getItem('_session_token')
     }
    console.log(userName, password)
     try {
         const response = await fetchPostReq(user_login, req_Data);
         if (response.message === "User Already Logged In" || response.message === "Login successful"){
             setLoggedIn(true)
         }
         if (response.token){
         localStorage.setItem('_session_token', JSON.stringify(response.token))
             setLoggedIn(true)
         }
         console.log(response, "req datas") ;
     } catch (error) {
         console.log(error);
     }
  }

  return (
    <>
        {loggedIn && <Navigate to={"/users"} />}
      <div className="layout-right-side">
          <Container>
            <Row className="justify-content-md-center align-items-center manually-card">
              <Card style={{ width: "40rem" }}>
                <Card.Body>
                  <Card.Title className="mt-2 text-light-blue main-title mb-4 text-uppercase justify-content-center login-title">
                    LAB LOG IN
                  </Card.Title>

                  <Form
                    noValidate
                  >
                    <Form.Control
                      type="text"
                      id="uname"
                      aria-describedby="usernameHelpBlock"
                      className="mt-3"
                      placeholder="Username"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                    <Form.Control
                      type="password"
                      id="inputPinPassword"
                      aria-describedby="PinPasswordHelpBlock"
                      className="mt-3"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <div className="d-flex mx-auto justify-content-center">
                      <Button
                        type="button"
                        className="mt-2 d-flex justify-content-center cancel-btn"
                        onClick={() => {
                          setUserName("");
                          setPassword("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                    type="button" // Change the type to "button"
                    variant="warning"
                    className="mt-2 d-flex justify-content-center cancel py-2  mx-2"
                    onClick={handleSubmit} // Add onClick handler
                  >
                    Ok
                  </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Row>
          </Container>
      </div>
    </>
  );
}

export default Login;
