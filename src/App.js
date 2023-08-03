import './App.css';
import Login from "./scenes/Login";
import Table from "./scenes/Table";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";

function App() {

    const ProtectedRoute = ({ element: Component, ...props }) => {
        const isLoggedIn = localStorage.getItem("_session_token");
        return isLoggedIn ? (
            <Component {...props} />
        ) : (
            <Navigate to={"/"} />
        );
    };

  return (
    <div className="App mt-5">
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/users" element={<ProtectedRoute element={Table} />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
