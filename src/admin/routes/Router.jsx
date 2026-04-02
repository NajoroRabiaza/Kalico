 
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Commande from "../pages/Commande";
// import Sellfood from "../pages/Sellfood";
import Clients from "../pages/Clients";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="dashboard" />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="Commande" element={<Commande />} />
      <Route path="Products" element={<Products />} />
      <Route path="Clients" element={<Clients />} />
    </Routes>
  );
};

export default Router;