// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Applications from "./pages/Applications";
import Application from "./pages/Application";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/applications"
          element={
            <PrivateRoute>
              <Header />
              <Applications />
            </PrivateRoute>
          }
        />
        <Route
          path="/application/:id"
          element={
            <PrivateRoute>
              <Header />
              <Application />
            </PrivateRoute>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
