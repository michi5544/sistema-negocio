-- Tabla de usuarios (dueños/empleados)
use sistema_negocio;

CREATE TABLE Ambiente (
    id_ambiente INT AUTO_INCREMENT PRIMARY KEY,   -- Identificador único del ambiente
    codigo INT NOT NULL,                          -- Código interno del ambiente
    nombre VARCHAR(50) NOT NULL,                  -- Nombre del ambiente (Salón, Terraza, VIP)
    descripcion VARCHAR(255)                      -- Descripción más detallada del ambiente
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','employee') DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE Mesa (
    id_mesa INT AUTO_INCREMENT PRIMARY KEY,             -- Identificador único autoincrementable
    numero_mesa INT NOT NULL,                           -- Número visible en el restaurante
    cantidad_personas INT NOT NULL,             -- Número de clientes atendidos en esa mesa
    estado ENUM('Libre', 'Ocupada', 'Reservada', 'Limpieza'), -- Situación actual de la mesa
    ambiente Enum('Sala Principal', 'Salón', 'Terraza', 'VIP', 'Otro'), -- Ubicación de la mesa dentro del restaurante
    comentarios VARCHAR(500),                  -- Observaciones del cliente o del mozo
    tiempo_ocupada INT,                        -- Duración en minutos desde que la mesa fue ocupada
    id_usuario INT NOT NULL,                          -- FK hacia tabla Usuarios (mozo asignado)
    -- Definición de claves foráneas
    CONSTRAINT fk_mesa_users FOREIGN KEY (id_usuario) REFERENCES users(id)
);
CREATE TABLE Mesa (
    id_mesa INT AUTO_INCREMENT PRIMARY KEY,       -- Identificador único autoincrementable
    numero_mesa INT NOT NULL,                     -- Número visible en el restaurante
    cantidad_personas INT NOT NULL,               -- Número de clientes atendidos en esa mesa
    estado ENUM('Libre', 'Ocupada', 'Reservada', 'Limpieza') NOT NULL,
    comentarios VARCHAR(500),
    tiempo_ocupada INT,							-- Duración en minutos desde que la mesa fue ocupada
    id_usuario INT NOT NULL,                      -- FK hacia tabla Usuarios (mozo asignado)
    id_ambiente INT NOT NULL,                     -- FK hacia tabla Ambiente
    CONSTRAINT fk_mesa_users FOREIGN KEY (id_usuario) REFERENCES users(id),
    CONSTRAINT fk_mesa_ambiente FOREIGN KEY (id_ambiente) REFERENCES Ambiente(id_ambiente)
);
-- Tabla de ventas
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    user_id INT,
    total DECIMAL(10,2) NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_mesa INT,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (id_mesa) REFERENCES mesa (id_mesa)
);

-- Tabla detalle de ventas (productos vendidos en cada venta)
CREATE TABLE sale_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);


CREATE TABLE Comanda (
    id_comanda INT AUTO_INCREMENT PRIMARY KEY,   -- Identificador único de la comanda
    id_mesa INT NOT NULL,                        -- FK hacia la tabla Mesa
 estado ENUM('Pendiente','En preparacion','Listo','Entregado','Cancelado','Cobrado') NOT NULL, -- Estado de la comanda
fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Definición de claves foráneas
    CONSTRAINT fk_comanda_mesa FOREIGN KEY (id_mesa) REFERENCES Mesa(id_mesa)
);


CREATE TABLE DetalleComanda (
    id_detalle_comanda INT AUTO_INCREMENT PRIMARY KEY,   -- Identificador único del detalle
    id_comanda INT NOT NULL,                             -- FK hacia la tabla Comanda
    id_producto INT NOT NULL,                            -- FK hacia la tabla Producto
    cantidad INT NOT NULL,                               -- Número de unidades del producto
    precio_unitario DECIMAL(10,2) NOT NULL,              -- Precio por unidad
    subtotal DECIMAL(10,2) NOT NULL,                     -- cantidad × precio_unitario

    -- Definición de claves foráneas
    CONSTRAINT fk_detalle_comanda FOREIGN KEY (id_comanda) REFERENCES Comanda(id_comanda),
    CONSTRAINT fk_detalle_producto FOREIGN KEY (id_producto) REFERENCES products(id)
);

-- 2. Tabla de caja (Sequelize la crea sola, pero por si acaso)
CREATE TABLE IF NOT EXISTS caja (
    id_caja INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_apertura INT NOT NULL,
    fecha_apertura TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    monto_inicial DECIMAL(10,2) NOT NULL,
    id_usuario_cierre INT DEFAULT NULL,
    fecha_cierre TIMESTAMP DEFAULT NULL,
    monto_final DECIMAL(10,2) DEFAULT NULL,
    total_ventas DECIMAL(10,2) DEFAULT NULL,
    diferencia DECIMAL(10,2) DEFAULT NULL,
    estado ENUM('Abierta','Cerrada') NOT NULL DEFAULT 'Abierta',
    FOREIGN KEY (id_usuario_apertura) REFERENCES users(id),
    FOREIGN KEY (id_usuario_cierre) REFERENCES users(id)
);
