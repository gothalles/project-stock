// frontend/src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import User from "./pages/User";
import ProductList from "./pages/ProductList";
import GoodsMovementList from "./pages/GoodsMovementList";
import ReportStock from "./pages/ReportStock";

function App() {
  const isAuth = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={isAuth ? <Home /> : <Navigate to="/Login" />} />
        <Route path="/User" element={isAuth ? <User /> : <Navigate to="/Login" />} />
        <Route path="/Products" element={isAuth ? <ProductList /> : <Navigate to="/Login" />} />
        <Route path="/GoodsMovement" element={isAuth ? <GoodsMovementList /> : <Navigate to="/Login" />} />
        <Route path="/ReportStock" element={isAuth ? <ReportStock /> : <Navigate to="/Login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
