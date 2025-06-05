import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import Home from "./components/Home/index.tsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home/*" element={<Home />} />
    </Routes>
  );
}