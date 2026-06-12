//  MENU DE NAVEGACION

import { useState } from "react";
import { Link } from "react-router-dom";
 
export default function Navbar({ open, setOpen }) {

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-blue-600 text-white shadow-md transition-all duration-300 ${
        open ? "w-64" : "w-16"
      }`}
    >
      {/* Header del sidebar */}
      <div className="p-4 font-bold border-b border-blue-500 flex items-center">
        <button
          onClick={() => setOpen(!open)}
          className="mr-2 focus:outline-none bg-blue-700 px-2 py-1 rounded hover:bg-blue-800 transition"
        >
          {open ? "✖" : "☰"}
        </button>
        {open && <span>SISTEMA DE VENTAS</span>}
      </div>

      {/* Navegación */}
      {open && (
        <nav className="p-4 space-y-2">
          <Link
            to="/"
            className="block py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            🏠 Inicio
          </Link>
          <Link
            to="/clients"
            className="block py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            👥 Clientes
          </Link>
          <Link
            to="/products"
            className="block py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            📦 Productos
          </Link>
          <Link
            to="/sales"
            className="block py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            💵 Ventas
          </Link>
          <Link
            to="/mesas"
            className="block py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            🪑 Mesas
          </Link>
          <Link
            to="/reports"
            className="block py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            📊 Reportes
          </Link>
          <Link
            to="/"
            className="block py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            x Cerrar sesión
          </Link>
        </nav>
      )}
    </aside>
  );
}
