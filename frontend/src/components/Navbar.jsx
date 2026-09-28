//  MENU DE NAVEGACION
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/inicio", label: "Inicio", icon: "🏠" },
  { to: "/pos", label: "POS", icon: "🛒" },
  { to: "/mesas", label: "Mesas", icon: "🪑" },
  { to: "/comandas", label: "Comandas", icon: "📋" },
  { to: "/caja", label: "Caja", icon: "🏧" },
];

const ADMIN_ITEMS = [
  { to: "/reports", label: "Reportes", icon: "📊" },
  { to: "/users", label: "Usuarios", icon: "👤" },
];

export default function Navbar({ open, setOpen }) {
  const { logout, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = (to) =>
    `flex items-center gap-3 py-2 px-4 rounded transition text-sm ${
      location.pathname === to
        ? "bg-blue-800 text-white font-semibold"
        : "hover:bg-blue-700 text-blue-100"
    }`;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-blue-600 text-white shadow-md transition-all duration-300 z-40 ${
        open ? "w-64" : "w-16"
      }`}
    >
      {/* Header */}
      <div className="p-4 font-bold border-b border-blue-500 flex items-center">
        <button
          onClick={() => setOpen(!open)}
          className="focus:outline-none bg-blue-700 px-2 py-1 rounded hover:bg-blue-800 transition text-sm"
        >
          {open ? "✖" : "☰"}
        </button>
        {open && <span className="ml-2 text-sm tracking-wide">SISTEMA DE VENTAS</span>}
      </div>

      {/* Info del usuario */}
      {open && user && (
        <div className="px-4 py-2 border-b border-blue-500 text-sm text-blue-200 flex items-center gap-2">
          <span className="truncate">{user.name || user.email}</span>
          {isAdmin && (
            <span className="bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded font-semibold shrink-0">
              Admin
            </span>
          )}
        </div>
      )}

      {/* Navegación */}
      <nav className="p-3 space-y-1 overflow-y-auto">
        {open ? (
          <>
            {NAV_ITEMS.map(({ to, label, icon }) => (
              <Link key={to} to={to} className={linkClass(to)}>
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            ))}

            {isAdmin && (
              <>
                <div className="pt-2 pb-1 px-4">
                  <p className="text-xs text-blue-300 uppercase tracking-wider">Administración</p>
                </div>
                {ADMIN_ITEMS.map(({ to, label, icon }) => (
                  <Link key={to} to={to} className={linkClass(to)}>
                    <span>{icon}</span>
                    <span>{label}</span>
                  </Link>
                ))}
              </>
            )}

            <div className="pt-3 border-t border-blue-500 mt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 py-2 px-4 rounded hover:bg-blue-700 transition text-sm text-blue-100"
              >
                <span>🚪</span>
                <span>Cerrar sesión</span>
              </button>
            </div>
          </>
        ) : (
          /* Collapsed: show icons only */
          <>
            {NAV_ITEMS.map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                title={label}
                className={`flex justify-center py-2 px-2 rounded transition text-lg ${
                  location.pathname === to ? "bg-blue-800" : "hover:bg-blue-700"
                }`}
              >
                {icon}
              </Link>
            ))}
            {isAdmin && ADMIN_ITEMS.map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                title={label}
                className={`flex justify-center py-2 px-2 rounded transition text-lg ${
                  location.pathname === to ? "bg-blue-800" : "hover:bg-blue-700"
                }`}
              >
                {icon}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex justify-center py-2 px-2 rounded hover:bg-blue-700 transition text-lg mt-2"
              title="Cerrar sesión"
            >
              🚪
            </button>
          </>
        )}
      </nav>
    </aside>
  );
}
