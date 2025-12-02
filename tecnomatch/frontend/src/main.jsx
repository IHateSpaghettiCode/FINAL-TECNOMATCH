import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";

import IndexPage from "./pages/IndexPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import FormularioPage from "./pages/FormularioPage.jsx";
import CareerModule from "./componentes/CareerModule.jsx";
import UserZonePage from "./pages/UserZonePage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import UsersAdmin from "./componentes/UsersAdmin";
import CareersAdmin from "./componentes/CareersAdmin";
import ReportsAdmin from "./componentes/ReportsAdmin";
import CarrerasCards from "./pages/CarrerasCards.jsx"; // 🔹 Nueva página
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ConfirmChangePasswordPage from "./pages/ConfirmChangePasswordPage.jsx";

import Layou from "./componentes/layou.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layou><IndexPage /></Layou>} />
            <Route path="/login" element={<Layou><LoginPage /></Layou>} />
            <Route path="/personality/:type" element={<Layou><FormularioPage /></Layou>} />
            <Route path="/career/*" element={<Layou><CareerModule /></Layou>} />
            <Route path="/User" element={<Layou><UserZonePage /></Layou>} />
            <Route path="/Quiz/*" element={<Layou><QuizPage /></Layou>} />
            <Route path="/users" element={<Layou><UsersAdmin /></Layou>} />
            <Route path="/careers" element={<Layou><CarrerasCards /></Layou>} /> {/* 🔹 NUEVA RUTA */}
            <Route path="/careers-admin" element={<Layou><CareersAdmin /></Layou>} /> {/* opcional */}
            <Route path="/forgot-password" element={<Layou><ForgotPasswordPage /></Layou>} />
            <Route path="/confirm-change-password" element={<Layou><ConfirmChangePasswordPage /></Layou>} />
            <Route path="/reports" element={<Layou><ReportsAdmin /></Layou>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);

