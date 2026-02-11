//  MENU DE NAVEGACION
import { Link } from "react-router-dom";

function Navbar(){
    return(
    <aside className="fixed top-0 left-0 h-screen w-64 bg-blue-600 text-white shadow-md flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-blue-500">
        SISTEMA DE VENTAS
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link to="/" className="block py-2 px-4 rounded hover:bg-blue-700">Inicio</Link>
        <Link to="/clients" className="block py-2 px-4 rounded hover:bg-blue-700">Clientes</Link>
        <Link to="/products" className="block py-2 px-4 rounded hover:bg-blue-700">Productos</Link>
        <Link to="/sales" className="block py-2 px-4 rounded hover:bg-blue-700">Ventas</Link>
        <Link to="/reports" className="block py-2 px-4 rounded hover:bg-blue-700">Reportes</Link>
      </nav>
    </aside>



    );
}

export default Navbar;