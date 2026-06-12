CREATE DEFINER=`root`@`localhost` PROCEDURE `Sp_listar_venta_con_detalle`()
BEGIN
    SELECT s.id AS ventaId,
           s.sale_date,
           s.total,
           c.name AS cliente,
           sd.product_id,
           p.name AS producto,
           sd.quantity,
           sd.price
    FROM sales s
    INNER JOIN customers c ON s.customer_id = c.id
    INNER JOIN sale_details sd ON s.id = sd.sale_id
    INNER JOIN products p ON sd.product_id = p.id
    ORDER BY s.id;
END