# Sistema de Gestión para Restaurante

## El problema que resuelve

Muchos restaurantes gestionan su negocio con cuadernos, hojas de Excel o aplicaciones genéricas que no fueron diseñadas para el ritmo de un servicio de mesa. El resultado es:

- Comandas perdidas o mal anotadas
- Errores al calcular cuentas
- Sin control real del inventario
- El dueño no sabe cuánto vendió hasta que cierra caja manualmente
- El personal no tiene un proceso claro

Este sistema fue construido específicamente para resolver eso.

---

## Qué hace el sistema

### Mesas y ambientes
- Visualiza todas las mesas del local en tiempo real
- Sabe cuáles están libres, ocupadas, reservadas o en limpieza
- Organiza las mesas por salones o ambientes (terraza, VIP, salón principal)
- Asigna un mesero a cada mesa

### Comandas (pedidos de cocina)
- El mesero registra el pedido directamente desde la app
- La comanda llega al sistema con estado: Pendiente → En preparación → Listo → Entregado
- Sin papel, sin confusiones entre sala y cocina

### Ventas y facturación
- Genera la venta desde la comanda con un clic
- Registra qué se vendió, a qué precio y a qué cliente
- Historial completo de ventas por fecha

### Inventario de productos
- Control de stock de cada producto
- El stock se descuenta automáticamente al crear una comanda o venta
- Alertas cuando un producto se vende por encima del stock disponible

### Caja
- Apertura y cierre de caja diario con monto inicial
- Calcula automáticamente el total de ventas del turno
- Registra diferencias entre lo esperado y lo contado

### Clientes
- Base de datos de clientes frecuentes
- Asocia ventas a clientes para historial

### Control de usuarios y roles
- **Administrador**: acceso total al sistema
- **Empleado**: puede tomar pedidos y gestionar mesas, sin poder borrar registros ni ver reportes financieros

### Reportes
- Ventas por rango de fechas
- Historial de caja por turno

---

## Cómo funciona en la práctica

```
El dueño abre la app en la computadora del local.
         ↓
El sistema arranca solo (no hay que abrir MySQL ni configurar nada).
         ↓
El mesero entra con su usuario desde cualquier tablet o celular
en la red WiFi del local.
         ↓
Toma el pedido → la comanda aparece en cocina →
cuando está lista, se registra la venta y se cierra la mesa.
         ↓
Al final del día el administrador cierra caja y
ve el resumen del turno.
```

---

## Acceso desde celular o tablet

El sistema funciona en cualquier dispositivo conectado al WiFi del local:
- No requiere instalar nada en el celular
- Se abre desde el navegador (Chrome, Safari, etc.)
- Ideal para meseros que toman pedidos en sala desde su teléfono

---

## Ventajas frente a otras opciones

| | Este sistema | Excel / cuaderno | Software genérico en la nube |
|---|---|---|---|
| Diseñado para restaurante | ✓ | ✗ | Depende |
| Funciona sin internet | ✓ | ✓ | ✗ |
| Pago mensual | No | No | Sí (USD 30–150/mes) |
| Control de mesas | ✓ | ✗ | ✓ |
| Comandas digitales | ✓ | ✗ | ✓ |
| Roles de usuario | ✓ | ✗ | ✓ |
| Acceso desde celular | ✓ | ✗ | ✓ |
| Datos propios (no en terceros) | ✓ | ✓ | ✗ |
| Soporte personalizado | ✓ | ✗ | Call center |

---

## Lo que NO necesita el usuario

- No necesita saber de computadoras más allá de usar Windows
- No necesita configurar bases de datos
- No necesita contratar hosting ni pagar suscripciones
- No necesita internet para que funcione
- No pierde sus datos si cambia de proveedor de internet

---

## Lo que SÍ necesita

- Una computadora con Windows 10 u 11 (la del local)
- MySQL instalado en esa computadora (se instala una sola vez)
- Red WiFi en el local (para acceso desde celulares/tablets del personal)

---

## Seguridad y privacidad

- Todos los datos quedan en la computadora del negocio, no en servidores externos
- Cada usuario tiene su contraseña
- Los empleados no pueden eliminar ventas ni ver información financiera
- El administrador puede revocar accesos en cualquier momento

---

## Escalabilidad futura

El sistema está construido sobre tecnología estándar que permite:

- Agregar módulos (reservas, delivery, fidelización de clientes)
- Integrar impresoras de tickets o facturación electrónica
- Generar reportes en PDF o Excel
- Migrar a la nube si el negocio crece y necesita acceso remoto

---

## Argumentos para cerrar la venta

> *"¿Cuánto tiempo pierde cada semana calculando ventas a mano?"*

> *"¿Alguna vez perdieron una comanda o hubo un error en la cuenta que afectó la experiencia del cliente?"*

> *"Con este sistema, el personal no necesita capacitación extensa — es tan simple como usar el teléfono."*

> *"No hay contrato mensual. Es una inversión única. Si comparas con pagar USD 50/mes en otro software, este sistema se paga en menos de un año."*

> *"Sus datos son suyos. No dependen de que una empresa externa siga existiendo."*

---

## Próximas funcionalidades (hoja de ruta)

- [ ] Impresión directa de comandas en cocina
- [ ] Módulo de reservas con vista de calendario
- [ ] Facturación electrónica
- [ ] App móvil nativa (sin necesidad de abrir el navegador)
- [ ] Dashboard con métricas en tiempo real (producto más vendido, hora pico, etc.)
- [ ] Backup automático de la base de datos
