# React + Vite
#  Sistema de Ventas - Frontend

Este es el frontend del **Sistema de Ventas**, desarrollado con **React + Vite** y estilizado con **TailwindCSS**.  
El objetivo es ofrecer una interfaz moderna y responsiva para la gestión de clientes, productos, ventas y reportes.

---

##  Tecnologías utilizadas

- [React](https://reactjs.org/) – Librería para construir interfaces de usuario.
- [Vite](https://vitejs.dev/) – Herramienta de desarrollo rápida para React.
- [TailwindCSS](https://tailwindcss.com/) – Framework de estilos utilitario.
- [React Router](https://reactrouter.com/) – Manejo de rutas en SPA.
- [React Toastify](https://fkhadra.github.io/react-toastify/) – Notificaciones elegantes.
- [Heroicons](https://heroicons.com/) – Íconos SVG para React.

---

##  Instalación y configuración

1. Clona el repositorio:
   ```bash
   git clone https://github.com/usuario/sistema-ventas-frontend.git
   cd sistema-ventas-frontend

2. Instala dependencias:
   ```bash
   npm install

3. Configura las variables de entorno:
Copia el archivo .env.example y renómbralo a .env.
Ajusta la URL de la API según tu entorno: VITE_API_URL=http://localhost:3000/api

*** DESARROLLO
    npm run dev -correr el proyecto

*** BUILD PRODUCCION
    npm run build

----- ESTRUCTURA DEL PROYECTO ------

src/
 ├── api/              # Funciones para consumir la API
 ├── components/       # Componentes reutilizables (Navbar, Layout, etc.)
 ├── pages/            # Páginas principales (Clientes, Productos, Ventas, Reportes)
 ├── App.jsx           # Componente raíz
 ├── AppRouter.jsx     # Configuración de rutas
 └── main.jsx          # Punto de entrada


----- Funcionalidades- Dashboard inicial con accesos rápidos. -------
- Gestión de clientes: listado, creación y edición.
- Gestión de productos: inventario y registro de nuevos productos.
- Gestión de ventas: registro de transacciones.
- Reportes: visualización de estadísticas y reportes.


 ## Autora
Desarrollado por Michelle
Universidad Tecnológica de El Salvador · ITCA-FEPADE
Especialista en Fullstack Development (React, Node.js, SQL, TailwindCSS)