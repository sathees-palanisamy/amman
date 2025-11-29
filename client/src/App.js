import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import OrderForm from "./OrderForm";
import OrderStatus from "./OrderStatus";
import OrderUpdate from "./OrderUpdate";
import NavBar from './Navbar/NavBar';
import Login from "./Login";
import SessionTimeout from "./SessionTimeout";

function App() {

  return (
    <div>
        <SessionTimeout />
        <NavBar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="form" element={<OrderForm />} />
          <Route path="status" element={<OrderStatus />} />
          <Route path="update" element={<OrderUpdate />} />
        </Routes>
    </div>
  );
}

export default App;
