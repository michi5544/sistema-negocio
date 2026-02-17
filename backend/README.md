 Backend de Sistema de Ventas

     Descripción
Este proyecto es un backend en Node.js con Express y Sequelize que gestiona un sistema de ventas.
Incluye operaciones CRUD para clientes, productos, ventas y detalles de ventas, además de rutas que llaman a Stored Procedures en la base de datos.


Tecnologías utilizadas
- Node.js + Express → servidor web y API REST
- Sequelize → ORM para interactuar con MySQL/MariaDB
- MySQL/MariaDB → base de datos relacional
- Stored Procedures → lógica de negocio en la BD

1. Instalación
- Clonar el repositorio:
git clone https://github.com/tuusuario/tu-repo.git
cd tu-repo

2. Instalar dependencias:
npm install

3. Configurar la base de datos en .env.example y renombrarla por .env

4. Ejecutar migraciones o asegurarse de que las tablas existan.


** INCIAR EL SERVIDOR
npm start

Endpoints principales
Clientes
- POST /customers → Crear cliente
- GET /customers → Listar clientes
- GET /customers/:id → Obtener cliente por id
- PUT /customers/:id → Editar cliente
- DELETE /customers/:id → Eliminar cliente
Ventas
- POST /sales → Crear venta con detalles
- GET /sales → Listar todas las ventas con cliente y productos
- GET /sales/:id → Obtener venta específica con cliente y productos

Stored Procedures
- GET /sales/sp → Llamar al SP Sp_listar_venta_con_detalle

Ejemplo de uso en Postman
Crear venta
POST http://localhost:3000/sales
Body json:

{
  "customer_id": 1,
  "user_id": 2,
  "products": [
    { "productId": 3, "quantity": 2 },
    { "productId": 5, "quantity": 1 }
  ]
}

    respuesta
    {
  "message": "Venta registrada",
  "sale": {
    "id": 1,
    "customer_id": 1,
    "user_id": 2,
    "total": 150
  }
}


