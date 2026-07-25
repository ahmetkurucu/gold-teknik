import React from "react";
import { Routes, Route } from "react-router-dom";
import Site from "./pages/Site.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Site />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
