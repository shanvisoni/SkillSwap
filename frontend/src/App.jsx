import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // Import AuthContext
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Chat from "./components/Chat";
import Login from "./pages/Login"; // Ensure you have Login Page
import Register from "./pages/Register"; // Ensure you have Register Page
import SpecificProfile from "./pages/SpecificProfile";
import ChatUsers from "./pages/ChatUsers";
import NotFound from "./pages/NotFound"; // 404 Page
import "./App.css";


import { ToastContainer,toast } from 'react-toastify';

function App() {
  const { user } = useAuth(); 


  // Protected Route Wrapper
  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<Search />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

<Route path="/chats" element={
  <PrivateRoute>
    <ChatUsers />
    </PrivateRoute>
  } />

          <Route
              path="/profile/:userId"  // ✅ Add dynamic user profile route
              element={
                <PrivateRoute>
                  <SpecificProfile />
                </PrivateRoute>
              }
            />

<Route path="/chats/:userId" element={
  <PrivateRoute>
<Chat /> 
</PrivateRoute>
} />


            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <ToastContainer/>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
