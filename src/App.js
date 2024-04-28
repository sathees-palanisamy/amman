import logo from './logo.svg';
import './App.css';
import { Routes, Route } from "react-router-dom"
import OrderForm from './OrderForm';
import OrderStatus from './OrderStatus';
import NavBar from './NavBar';

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={ <OrderForm/> } />
        <Route path="status" element={ <OrderStatus/> } />
      </Routes>
    </div>
  );
}

export default App;
