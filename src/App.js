import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import OrderForm from "./OrderForm";
import OrderStatus from "./OrderStatus";
import NavBar from "./NavBar";
import Login from "./Login";

function App() {

  return (
    <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="form" element={<OrderForm />} />
          <Route path="status" element={<OrderStatus />} />
        </Routes>
    </div>
  );
}

export default App;
