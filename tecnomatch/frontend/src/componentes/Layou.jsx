import React from "react";
import Header from "./Header.jsx";
import Breadcrumb from "./Breadcrumb.jsx";

export default function Layou({ children }) {
  return (
    <>
      {/* Header global */}
      <Header />

      {/* Breadcrumb justo debajo del header */}
      <div style={{ marginTop: "80px", paddingLeft: "20px", paddingRight: "20px" }}>
        <Breadcrumb />
      </div>

      {/* Contenido de la página */}
      <main style={{ paddingTop: "20px", paddingLeft: "20px", paddingRight: "20px" }}>
        {children}
      </main>
    </>
  );
}
