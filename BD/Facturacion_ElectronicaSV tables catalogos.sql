-- =====================================================================
-- SEEDERS - CATÁLOGOS MINISTERIO DE HACIENDA
-- Sistema de Facturación Electrónica - El Salvador
-- Fuente: archivos .txt en carpeta catalogos/
-- Versión MH: 1.1 (08/2024)
-- Pre-requisito: ejecutar schema_catalogos_mh.sql primero
-- =====================================================================

USE sistema_negocio;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET UNIQUE_CHECKS = 0;
SET AUTOCOMMIT = 0;
START TRANSACTION;

-- Limpieza de datos previos (orden inverso por FK)
DELETE FROM catalogo_referencia;
DELETE FROM catalogo_relaciones;
DELETE FROM catalogo_regimen;
DELETE FROM catalogo_paises;
DELETE FROM catalogo_tributos;
DELETE FROM catalogo_unidades;
DELETE FROM catalogo_especial;
DELETE FROM catalogo_actividad_economica;
DELETE FROM catalogo_ubicacion;
DELETE FROM catalogo_valores_numericos;
DELETE FROM catalogo_maestro;

-- =====================================================================
-- TABLA: catalogo_maestro
-- Catálogos simples insertados como una sola operación masiva
-- =====================================================================

INSERT INTO catalogo_maestro (tipo_catalogo, codigo, descripcion) VALUES
-- CAT-001 Ambiente de destino
('CAT001','00','Modo prueba'),
('CAT001','01','Modo producción'),

-- CAT-002 Tipo de Documento
('CAT002','01','Factura'),
('CAT002','03','Comprobante de crédito fiscal'),
('CAT002','04','Nota de remisión'),
('CAT002','05','Nota de crédito'),
('CAT002','06','Nota de débito'),
('CAT002','07','Comprobante de retención'),
('CAT002','08','Comprobante de liquidación'),
('CAT002','09','Documento contable de liquidación'),
('CAT002','11','Facturas de exportación'),
('CAT002','14','Factura de sujeto excluido'),
('CAT002','15','Comprobante de donación'),

-- CAT-003 Modelo de Facturación
('CAT003','1','Modelo Facturación previo'),
('CAT003','2','Modelo Facturación diferido'),

-- CAT-004 Tipo de Transmisión
('CAT004','1','Transmisión normal'),
('CAT004','2','Transmisión por contingencia'),

-- CAT-005 Tipo de Contingencia
('CAT005','1','No disponibilidad de sistema del MH'),
('CAT005','2','No disponibilidad de sistema del emisor'),
('CAT005','3','Falla en el suministro de servicio de Internet del Emisor'),
('CAT005','4','Falla en el suministro de servicio de energía eléctrica del emisor que impida la transmisión de los DTE'),
('CAT005','5','Otro (deberá digitar un máximo de 500 caracteres explicando el motivo)'),

-- CAT-006 Retención IVA MH (también va a catalogo_valores_numericos)
('CAT006','22','Retención IVA 1%'),
('CAT006','C4','Retención IVA 13%'),
('CAT006','C9','Otras retenciones IVA casos especiales'),

-- CAT-007 Tipo de Generación del Documento
('CAT007','1','Físico'),
('CAT007','2','Electrónico'),

-- CAT-008 Catálogo eliminado
('CAT008','N/A','Catálogo eliminado'),

-- CAT-009 Tipo de establecimiento
('CAT009','01','Sucursal'),
('CAT009','02','Casa Matriz'),
('CAT009','04','Bodega'),
('CAT009','07','Patio'),

-- CAT-010 Tipo de Servicio Médico
('CAT010','1','Cirugía'),
('CAT010','2','Operación'),
('CAT010','3','Tratamiento médico'),
('CAT010','4','Cirugía instituto salvadoreño de Bienestar Magisterial'),
('CAT010','5','Operación Instituto Salvadoreño de Bienestar Magisterial'),
('CAT010','6','Tratamiento médico Instituto Salvadoreño de Bienestar Magisterial'),

-- CAT-011 Tipo de ítem
('CAT011','1','Bienes'),
('CAT011','2','Servicios'),
('CAT011','3','Ambos (Bienes y Servicios, incluye los dos inherente a los Productos o servicios)'),
('CAT011','4','Otros tributos por ítem'),

-- CAT-016 Condición de la Operación
('CAT016','1','Contado'),
('CAT016','2','A crédito'),
('CAT016','3','Otro'),

-- CAT-017 Forma de Pago
('CAT017','01','Billetes y monedas'),
('CAT017','02','Tarjeta Débito'),
('CAT017','03','Tarjeta Crédito'),
('CAT017','04','Cheque'),
('CAT017','05','Transferencia-Depósito Bancario'),
('CAT017','08','Dinero electrónico'),
('CAT017','09','Monedero electrónico'),
('CAT017','11','Bitcoin'),
('CAT017','12','Otras Criptomonedas'),
('CAT017','13','Cuentas por pagar del receptor'),
('CAT017','14','Giro bancario'),
('CAT017','99','Otros (se debe indicar el medio de pago)'),

-- CAT-018 Plazo (también va a catalogo_valores_numericos)
('CAT018','01','Días'),
('CAT018','02','Meses'),
('CAT018','03','Años'),

-- CAT-021 Otros Documentos Asociados
('CAT021','1','Emisor'),
('CAT021','2','Receptor'),
('CAT021','3','Médico (solo aplica para contribuyentes obligados a la presentación de F-958)'),
('CAT021','4','Transporte (solo aplica para Factura de exportación)'),

-- CAT-022 Tipo de documento de identificación del Receptor
('CAT022','36','NIT'),
('CAT022','13','DUI'),
('CAT022','37','Otro'),
('CAT022','03','Pasaporte'),
('CAT022','02','Carnet de Residente'),

-- CAT-023 Tipo de Documento en Contingencia
('CAT023','01','Factura Electrónico'),
('CAT023','03','Comprobante de Crédito Fiscal Electrónico'),
('CAT023','04','Nota de Remisión Electrónica'),
('CAT023','05','Nota de Crédito Electrónica'),
('CAT023','06','Nota de Débito Electrónica'),
('CAT023','11','Factura de Exportación Electrónica'),
('CAT023','14','Factura de Sujeto Excluido Electrónica'),

-- CAT-024 Tipo de Invalidación
('CAT024','1','Error en la Información del Documento Tributario Electrónico a invalidar.'),
('CAT024','2','Rescindir de la operación realizada.'),
('CAT024','3','Otro'),

-- CAT-025 Título a que se remiten los bienes
('CAT025','01','Depósito'),
('CAT025','02','Propiedad'),
('CAT025','03','Consignación'),
('CAT025','04','Traslado'),
('CAT025','05','Otros'),

-- CAT-026 Tipo de Donación
('CAT026','1','Efectivo'),
('CAT026','2','Bien'),
('CAT026','3','Servicio'),

-- CAT-027 Recinto Fiscal
('CAT027','01','Terrestre San Bartolo'),
('CAT027','02','Marítima de Acajutla'),
('CAT027','03','Aérea De Comalapa'),
('CAT027','04','Terrestre Las Chinamas'),
('CAT027','05','Terrestre La Hachadura'),
('CAT027','06','Terrestre Santa Ana'),
('CAT027','07','Terrestre San Cristóbal'),
('CAT027','08','Terrestre Anguiatú'),
('CAT027','09','Terrestre El Amatillo'),
('CAT027','10','Marítima La Unión'),
('CAT027','11','Terrestre El Poy'),
('CAT027','12','Terrestre Metaíio'),
('CAT027','15','Fardos Postales'),
('CAT027','16','Z.F. San Marcos'),
('CAT027','17','Z.F. El Pedregal'),
('CAT027','18','Z.F. San Bartolo'),
('CAT027','20','Z.F. Exportsalva'),
('CAT027','21','Z.F. American Park'),
('CAT027','23','Z.F. Internacional'),
('CAT027','24','Z.F. Diez'),
('CAT027','26','Z.F. Miramar'),
('CAT027','27','Z.F. Santo Tomas'),
('CAT027','28','Z.F. Santa Tecla'),
('CAT027','29','Z.F. Santa Ana'),
('CAT027','30','Z.F. La Concordia'),
('CAT027','31','Aérea Ilopango'),
('CAT027','32','Z.F. Pipil'),
('CAT027','33','Puerto Barillas'),
('CAT027','34','Z.F. Calvo Conservas'),
('CAT027','35','Feria Internacional'),
('CAT027','36','Aduana El Papalón'),
('CAT027','37','Z.F. Sam-Li'),
('CAT027','38','Z.F. San José'),
('CAT027','39','Z.F. Las Mercedes'),
('CAT027','71','Aldesa'),
('CAT027','72','Agdosa Merliot'),
('CAT027','73','Bodesa'),
('CAT027','76','Delegacion DHL'),
('CAT027','77','Transauto'),
('CAT027','80','Nejapa'),
('CAT027','81','Almaconsa'),
('CAT027','83','Agdosa Apopa'),
('CAT027','85','Gutiérrez Courier Y Cargo'),
('CAT027','99','San Bartolo Envío Hn/Gt'),

-- CAT-029 Tipo de persona
('CAT029','1','Persona Natural'),
('CAT029','2','Persona Jurídica'),

-- CAT-030 Transporte
('CAT030','1','TERRESTRE'),
('CAT030','2','AÉREO'),
('CAT030','3','MARÍTIMO'),
('CAT030','4','FÉRREO'),
('CAT030','5','MULTIMODAL'),
('CAT030','6','CORREO'),

-- CAT-031 INCOTERMS
('CAT031','01','EXW-En fabrica'),
('CAT031','02','FCA-Libre transportista'),
('CAT031','03','CPT-Transporte pagado hasta'),
('CAT031','04','CIP-Transporte y seguro pagado hasta'),
('CAT031','05','DAP-Entrega en el lugar'),
('CAT031','06','DPU-Entregado en el lugar descargado'),
('CAT031','07','DDP-Entrega con impuestos pagados'),
('CAT031','08','FAS-Libre al costado del buque'),
('CAT031','09','FOB-Libre a bordo'),
('CAT031','10','CFR-Costo y flete'),
('CAT031','11','CIF- Costo seguro y flete'),

-- CAT-032 Domicilio Fiscal
('CAT032','1','Domiciliado'),
('CAT032','2','No Domiciliado');

-- =====================================================================
-- TABLA: catalogo_valores_numericos
-- CAT-006 (Retención IVA) y CAT-018 (Plazo)
-- =====================================================================

-- CAT-006: Retención IVA - extraer porcentajes
INSERT INTO catalogo_valores_numericos (catalogo_maestro_id, valor_numerico, tipo_valor)
SELECT id, 1.0000, 'PORCENTAJE' FROM catalogo_maestro WHERE tipo_catalogo='CAT006' AND codigo='22';
INSERT INTO catalogo_valores_numericos (catalogo_maestro_id, valor_numerico, tipo_valor)
SELECT id, 13.0000, 'PORCENTAJE' FROM catalogo_maestro WHERE tipo_catalogo='CAT006' AND codigo='C4';
INSERT INTO catalogo_valores_numericos (catalogo_maestro_id, valor_numerico, tipo_valor)
SELECT id, 0.0000, 'PORCENTAJE' FROM catalogo_maestro WHERE tipo_catalogo='CAT006' AND codigo='C9';

-- CAT-018: Plazo - factor de conversión a días
INSERT INTO catalogo_valores_numericos (catalogo_maestro_id, valor_numerico, tipo_valor)
SELECT id, 1.0000, 'DIAS' FROM catalogo_maestro WHERE tipo_catalogo='CAT018' AND codigo='01';
INSERT INTO catalogo_valores_numericos (catalogo_maestro_id, valor_numerico, tipo_valor)
SELECT id, 30.0000, 'DIAS' FROM catalogo_maestro WHERE tipo_catalogo='CAT018' AND codigo='02';
INSERT INTO catalogo_valores_numericos (catalogo_maestro_id, valor_numerico, tipo_valor)
SELECT id, 365.0000, 'DIAS' FROM catalogo_maestro WHERE tipo_catalogo='CAT018' AND codigo='03';

-- =====================================================================
-- TABLA: catalogo_ubicacion (CAT-012 Departamentos + CAT-013 Municipios)
-- Insertar primero departamentos, luego municipios referenciando padre
-- =====================================================================

-- CAT-012: Departamentos (nivel raíz, ubicacion_padre_id = NULL)
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id) VALUES
('00','Otro (Para extranjeros)','DEPARTAMENTO',NULL),
('01','Ahuachapán','DEPARTAMENTO',NULL),
('02','Santa Ana','DEPARTAMENTO',NULL),
('03','Sonsonate','DEPARTAMENTO',NULL),
('04','Chalatenango','DEPARTAMENTO',NULL),
('05','La Libertad','DEPARTAMENTO',NULL),
('06','San Salvador','DEPARTAMENTO',NULL),
('07','Cuscatlán','DEPARTAMENTO',NULL),
('08','La Paz','DEPARTAMENTO',NULL),
('09','Cabañas','DEPARTAMENTO',NULL),
('10','San Vicente','DEPARTAMENTO',NULL),
('11','Usulután','DEPARTAMENTO',NULL),
('12','San Miguel','DEPARTAMENTO',NULL),
('13','Morazán','DEPARTAMENTO',NULL),
('14','La Unión','DEPARTAMENTO',NULL);

-- CAT-013: Municipios (referenciando id del departamento padre)
-- Ahuachapán (01)
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '13','AHUACHAPAN NORTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='01' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '14','AHUACHAPAN CENTRO','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='01' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '15','AHUACHAPAN SUR','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='01' AND tipo='DEPARTAMENTO';

-- Santa Ana (02)
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '14','SANTA ANA NORTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='02' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '15','SANTA ANA CENTRO','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='02' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '16','SANTA ANA ESTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='02' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '17','SANTA ANA OESTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='02' AND tipo='DEPARTAMENTO';

-- Sonsonate (03)
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '17','SONSONATE NORTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='03' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '18','SONSONATE CENTRO','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='03' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '19','SONSONATE ESTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='03' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '20','SONSONATE OESTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='03' AND tipo='DEPARTAMENTO';

-- Chalatenango (04)
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '34','CHALATENANGO NORTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='04' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '35','CHALATENANGO CENTRO','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='04' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '36','CHALATENANGO SUR','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='04' AND tipo='DEPARTAMENTO';

-- La Libertad (05)
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '23','LA LIBERTAD NORTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='05' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '24','LA LIBERTAD CENTRO','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='05' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '25','LA LIBERTAD OESTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='05' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '26','LA LIBERTAD ESTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='05' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '27','LA LIBERTAD COSTA','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='05' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '28','LA LIBERTAD SUR','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='05' AND tipo='DEPARTAMENTO';

-- San Salvador (06)
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '20','SAN SALVADOR NORTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='06' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '21','SAN SALVADOR OESTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='06' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '22','SAN SALVADOR ESTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='06' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '23','SAN SALVADOR CENTRO','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='06' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '24','SAN SALVADOR SUR','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='06' AND tipo='DEPARTAMENTO';

-- Cuscatlán (07)
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '17','CUSCATLAN NORTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='07' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '18','CUSCATLAN SUR','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='07' AND tipo='DEPARTAMENTO';

-- La Paz (08)
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '23','LA PAZ OESTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='08' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '24','LA PAZ CENTRO','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='08' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '25','LA PAZ ESTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='08' AND tipo='DEPARTAMENTO';

-- Cabañas (09)
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '10','CABAÑAS OESTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='09' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '11','CABAÑAS ESTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='09' AND tipo='DEPARTAMENTO';

-- San Vicente (10)
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '14','SAN VICENTE NORTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='10' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '15','SAN VICENTE SUR','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='10' AND tipo='DEPARTAMENTO';

-- Usulután (11)
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '24','USULUTAN NORTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='11' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '25','USULUTAN ESTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='11' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '26','USULUTAN OESTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='11' AND tipo='DEPARTAMENTO';

-- San Miguel (12)
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '21','SAN MIGUEL NORTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='12' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '22','SAN MIGUEL CENTRO','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='12' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '23','SAN MIGUEL OESTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='12' AND tipo='DEPARTAMENTO';

-- Morazán (13)
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '27','MORAZAN NORTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='13' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '28','MORAZAN SUR','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='13' AND tipo='DEPARTAMENTO';

-- La Unión (14)
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '19','LA UNIÓN NORTE','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='14' AND tipo='DEPARTAMENTO';
INSERT INTO catalogo_ubicacion (codigo, nombre, tipo, ubicacion_padre_id)
SELECT '20','LA UNIÓN SUR','MUNICIPIO',id FROM catalogo_ubicacion WHERE codigo='14' AND tipo='DEPARTAMENTO';

-- =====================================================================
-- TABLA: catalogo_especial + extensiones
-- CAT-014 Unidades, CAT-015 Tributos, CAT-020 Países, CAT-028 Régimen
-- =====================================================================

-- CAT-014: Unidad de Medida
INSERT INTO catalogo_especial (codigo, descripcion, tipo_catalogo) VALUES
('1','metro','CAT014'),
('2','Yarda','CAT014'),
('6','milímetro','CAT014'),
('9','kilómetro cuadrado','CAT014'),
('10','Hectárea','CAT014'),
('13','metro cuadrado','CAT014'),
('15','Vara cuadrada','CAT014'),
('18','metro cúbico','CAT014'),
('20','Barril','CAT014'),
('22','Galón','CAT014'),
('23','Litro','CAT014'),
('24','Botella','CAT014'),
('26','Mililitro','CAT014'),
('30','Tonelada','CAT014'),
('32','Quintal','CAT014'),
('33','Arroba','CAT014'),
('34','Kilogramo','CAT014'),
('36','Libra','CAT014'),
('37','Onza troy','CAT014'),
('38','Onza','CAT014'),
('39','Gramo','CAT014'),
('40','Miligramo','CAT014'),
('42','Megawatt','CAT014'),
('43','Kilowatt','CAT014'),
('44','Watt','CAT014'),
('45','Megavoltio-amperio','CAT014'),
('46','Kilovoltio-amperio','CAT014'),
('47','Voltio-amperio','CAT014'),
('49','Gigawatt-hora','CAT014'),
('50','Megawatt-hora','CAT014'),
('51','Kilowatt-hora','CAT014'),
('52','Watt-hora','CAT014'),
('53','Kilovoltio','CAT014'),
('54','Voltio','CAT014'),
('55','Millar','CAT014'),
('56','Medio millar','CAT014'),
('57','Ciento','CAT014'),
('58','Docena','CAT014'),
('59','Unidad','CAT014'),
('99','Otra','CAT014');

-- Extensión catalogo_unidades (símbolos)
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'm'    FROM catalogo_especial WHERE codigo='1'  AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'yd'   FROM catalogo_especial WHERE codigo='2'  AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'mm'   FROM catalogo_especial WHERE codigo='6'  AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'km²'  FROM catalogo_especial WHERE codigo='9'  AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'ha'   FROM catalogo_especial WHERE codigo='10' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'm²'   FROM catalogo_especial WHERE codigo='13' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'vr²'  FROM catalogo_especial WHERE codigo='15' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'm³'   FROM catalogo_especial WHERE codigo='18' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'bbl'  FROM catalogo_especial WHERE codigo='20' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'gal'  FROM catalogo_especial WHERE codigo='22' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'L'    FROM catalogo_especial WHERE codigo='23' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'bot'  FROM catalogo_especial WHERE codigo='24' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'mL'   FROM catalogo_especial WHERE codigo='26' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 't'    FROM catalogo_especial WHERE codigo='30' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'qq'   FROM catalogo_especial WHERE codigo='32' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, '@'    FROM catalogo_especial WHERE codigo='33' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'kg'   FROM catalogo_especial WHERE codigo='34' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'lb'   FROM catalogo_especial WHERE codigo='36' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'ozt'  FROM catalogo_especial WHERE codigo='37' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'oz'   FROM catalogo_especial WHERE codigo='38' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'g'    FROM catalogo_especial WHERE codigo='39' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'mg'   FROM catalogo_especial WHERE codigo='40' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'MW'   FROM catalogo_especial WHERE codigo='42' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'kW'   FROM catalogo_especial WHERE codigo='43' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'W'    FROM catalogo_especial WHERE codigo='44' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'MVA'  FROM catalogo_especial WHERE codigo='45' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'kVA'  FROM catalogo_especial WHERE codigo='46' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'VA'   FROM catalogo_especial WHERE codigo='47' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'GWh'  FROM catalogo_especial WHERE codigo='49' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'MWh'  FROM catalogo_especial WHERE codigo='50' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'kWh'  FROM catalogo_especial WHERE codigo='51' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'Wh'   FROM catalogo_especial WHERE codigo='52' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'kV'   FROM catalogo_especial WHERE codigo='53' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'V'    FROM catalogo_especial WHERE codigo='54' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'ML'   FROM catalogo_especial WHERE codigo='55' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'MMl'  FROM catalogo_especial WHERE codigo='56' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'C'    FROM catalogo_especial WHERE codigo='57' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'doc'  FROM catalogo_especial WHERE codigo='58' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'u'    FROM catalogo_especial WHERE codigo='59' AND tipo_catalogo='CAT014';
INSERT INTO catalogo_unidades (catalogo_especial_id, simbolo)
SELECT id, 'otra' FROM catalogo_especial WHERE codigo='99' AND tipo_catalogo='CAT014';

-- CAT-015: Tributos
INSERT INTO catalogo_especial (codigo, descripcion, tipo_catalogo) VALUES
('20','Impuesto al Valor Agregado 13%','CAT015'),
('C3','Impuesto al Valor Agregado (exportaciones) 0%','CAT015'),
('59','Turismo: por alojamiento (5%)','CAT015'),
('71','Turismo: salida del país por vía aérea $7.00','CAT015'),
('D1','FOVIAL ($0.20 Ctvs. por galón)','CAT015'),
('C8','COTRANS ($0.10 Ctvs. por galón)','CAT015'),
('D5','Otras tasas casos especiales','CAT015'),
('D4','Otros impuestos casos especiales','CAT015'),
('A8','Impuesto Especial al Combustible (0%; 0.5%; 1%)','CAT015'),
('57','Impuesto industria de Cemento','CAT015'),
('90','Impuesto especial a la primera matrícula','CAT015'),
('A6','Impuesto ad-valorem, armas de fuego, municiones explosivas y artículos similares','CAT015'),
('C5','Impuesto ad-valorem por diferencial de precios de bebidas alcohólicas (8%)','CAT015'),
('C6','Impuesto ad-valorem por diferencial de precios al tabaco cigarrillos (39%)','CAT015'),
('C7','Impuesto ad-valorem por diferencial de precios al tabaco cigarros (100%)','CAT015'),
('19','Fabricante de Bebidas Gaseosas, Isotónicas, Deportivas, Fortificantes, Energizante o Estimulante','CAT015'),
('28','Importador de Bebidas Gaseosas, Isotónicas, Deportivas, Fortificantes, Energizante o Estimulante','CAT015'),
('31','Detallistas o Expendedores de Bebidas Alcohólicas','CAT015'),
('32','Fabricante de Cerveza','CAT015'),
('33','Importador de Cerveza','CAT015'),
('34','Fabricante de Productos de Tabaco','CAT015'),
('35','Importador de Productos de Tabaco','CAT015'),
('36','Fabricante de Armas de Fuego Municiones y Artículos Similares','CAT015'),
('37','Importador de Arma de Fuego Munición y Artículos. Similares','CAT015'),
('38','Fabricante de Explosivos','CAT015'),
('39','Importador de Explosivos','CAT015'),
('42','Fabricante de Productos Pirotécnicos','CAT015'),
('43','Importador de Productos Pirotécnicos','CAT015'),
('44','Productor de Tabaco','CAT015'),
('50','Distribuidor de Bebidas Gaseosas, Isotónicas, Deportivas, Fortificantes, Energizante o Estimulante','CAT015'),
('51','Bebidas Alcohólicas','CAT015'),
('52','Cerveza','CAT015'),
('53','Productos del Tabaco','CAT015'),
('54','Bebidas Carbonatadas o Gaseosas Simples o Endulzadas','CAT015'),
('55','Otros Específicos','CAT015'),
('58','Alcohol','CAT015'),
('77','Importador de Jugos Néctares Bebidas con Jugo y Refrescos','CAT015'),
('78','Distribuidor de Jugos Néctares Bebidas con Jugo y Refrescos','CAT015'),
('79','Sobre Llamadas Telefónicas Provenientes del Ext.','CAT015'),
('85','Detallista de Jugos Néctares Bebidas con Jugo y Refrescos','CAT015'),
('86','Fabricante de Preparaciones Concentradas o en Polvo para la Elaboración de Bebidas','CAT015'),
('91','Fabricante de Jugos Néctares Bebidas con Jugo y Refrescos','CAT015'),
('92','Importador de Preparaciones Concentradas o en Polvo para la Elaboración de Bebidas','CAT015'),
('A1','Específicos y Ad-Valorem','CAT015'),
('A5','Bebidas Gaseosas, Isotónicas, Deportivas, Fortificantes, Energizantes o Estimulantes','CAT015'),
('A7','Alcohol Etílico','CAT015'),
('A9','Sacos Sintéticos','CAT015');

-- Extensión catalogo_tributos
INSERT INTO catalogo_tributos (catalogo_especial_id, tipo_tributo, porcentaje, es_retencion, es_percepcion)
SELECT id, 'IVA', 13.0000, 0, 0 FROM catalogo_especial WHERE codigo='20' AND tipo_catalogo='CAT015';
INSERT INTO catalogo_tributos (catalogo_especial_id, tipo_tributo, porcentaje, es_retencion, es_percepcion)
SELECT id, 'IVA', 0.0000, 0, 0 FROM catalogo_especial WHERE codigo='C3' AND tipo_catalogo='CAT015';
INSERT INTO catalogo_tributos (catalogo_especial_id, tipo_tributo, porcentaje, es_retencion, es_percepcion)
SELECT id, 'ESPECIFICO', 5.0000, 0, 0 FROM catalogo_especial WHERE codigo='59' AND tipo_catalogo='CAT015';
INSERT INTO catalogo_tributos (catalogo_especial_id, tipo_tributo, porcentaje, es_retencion, es_percepcion)
SELECT id, 'ESPECIFICO', NULL, 0, 0 FROM catalogo_especial WHERE codigo='71' AND tipo_catalogo='CAT015';
INSERT INTO catalogo_tributos (catalogo_especial_id, tipo_tributo, porcentaje, es_retencion, es_percepcion)
SELECT id, 'ESPECIFICO', NULL, 0, 0 FROM catalogo_especial WHERE codigo='D1' AND tipo_catalogo='CAT015';
INSERT INTO catalogo_tributos (catalogo_especial_id, tipo_tributo, porcentaje, es_retencion, es_percepcion)
SELECT id, 'ESPECIFICO', NULL, 0, 0 FROM catalogo_especial WHERE codigo='C8' AND tipo_catalogo='CAT015';
INSERT INTO catalogo_tributos (catalogo_especial_id, tipo_tributo, porcentaje, es_retencion, es_percepcion)
SELECT id, 'OTRO', NULL, 0, 0 FROM catalogo_especial WHERE codigo='D5' AND tipo_catalogo='CAT015';
INSERT INTO catalogo_tributos (catalogo_especial_id, tipo_tributo, porcentaje, es_retencion, es_percepcion)
SELECT id, 'OTRO', NULL, 0, 0 FROM catalogo_especial WHERE codigo='D4' AND tipo_catalogo='CAT015';
INSERT INTO catalogo_tributos (catalogo_especial_id, tipo_tributo, porcentaje, es_retencion, es_percepcion)
SELECT id, 'ESPECIFICO', 1.0000, 0, 0 FROM catalogo_especial WHERE codigo='A8' AND tipo_catalogo='CAT015';

-- Para los demás tributos (categorías de contribuyentes), tipo OTRO sin porcentaje fijo
INSERT INTO catalogo_tributos (catalogo_especial_id, tipo_tributo, porcentaje, es_retencion, es_percepcion)
SELECT id, 'OTRO', NULL, 0, 0
FROM catalogo_especial
WHERE tipo_catalogo='CAT015'
  AND codigo NOT IN ('20','C3','59','71','D1','C8','D5','D4','A8');

COMMIT;
START TRANSACTION;

-- =====================================================================
-- CAT-020: Países (catalogo_especial + catalogo_paises)
-- =====================================================================

INSERT INTO catalogo_especial (codigo, descripcion, tipo_catalogo) VALUES
('AF','Afganistán','CAT020'),('AX','Åland','CAT020'),('AL','Albania','CAT020'),('DE','Alemania','CAT020'),
('AD','Andorra','CAT020'),('AO','Angola','CAT020'),('AI','Anguila','CAT020'),('AQ','Antártica','CAT020'),
('AG','Antigua y Barbuda','CAT020'),('AW','Aruba','CAT020'),('SA','Arabia Saudita','CAT020'),
('DZ','Argelia','CAT020'),('AR','Argentina','CAT020'),('AM','Armenia','CAT020'),('AU','Australia','CAT020'),
('AT','Austria','CAT020'),('AZ','Azerbaiyán','CAT020'),('BS','Bahamas','CAT020'),('BH','Bahréin','CAT020'),
('BD','Bangladesh','CAT020'),('BB','Barbados','CAT020'),('BE','Bélgica','CAT020'),('BZ','Belice','CAT020'),
('BJ','Benín','CAT020'),('BM','Bermudas','CAT020'),('BY','Bielorrusia','CAT020'),('BO','Bolivia','CAT020'),
('BQ','Bonaire, Sint Eustatius and Saba','CAT020'),('BA','Bosnia-Herzegovina','CAT020'),
('BW','Botswana','CAT020'),('BR','Brasil','CAT020'),('BN','Brunéi','CAT020'),('BG','Bulgaria','CAT020'),
('BF','Burkina Faso','CAT020'),('BI','Burundi','CAT020'),('BT','Bután','CAT020'),('CV','Cabo Verde','CAT020'),
('KY','Caimán, Islas','CAT020'),('KH','Camboya','CAT020'),('CM','Camerún','CAT020'),('CA','Canadá','CAT020'),
('CF','Centroafricana, República','CAT020'),('TD','Chad','CAT020'),('CL','Chile','CAT020'),
('CN','China','CAT020'),('CY','Chipre','CAT020'),('VA','Ciudad del Vaticano','CAT020'),
('CO','Colombia','CAT020'),('KM','Comoras','CAT020'),('CG','Congo','CAT020'),('CI','Costa de Marfíl','CAT020'),
('CR','Costa Rica','CAT020'),('HR','Croacia','CAT020'),('CU','Cuba','CAT020'),('CW','Curazao','CAT020'),
('DK','Dinamarca','CAT020'),('DM','Dominica','CAT020'),('DJ','Djibouti','CAT020'),('EC','Ecuador','CAT020'),
('EG','Egipto','CAT020'),('SV','El Salvador','CAT020'),('AE','Emiratos Árabes Unidos','CAT020'),
('ER','Eritrea','CAT020'),('SK','Eslovaquia','CAT020'),('SI','Eslovenia','CAT020'),('ES','España','CAT020'),
('US','Estados Unidos','CAT020'),('EE','Estonia','CAT020'),('ET','Etiopía','CAT020'),('FJ','Fiji','CAT020'),
('PH','Filipinas','CAT020'),('FI','Finlandia','CAT020'),('FR','Francia','CAT020'),('GA','Gabón','CAT020'),
('GM','Gambia','CAT020'),('GE','Georgia','CAT020'),('GH','Ghana','CAT020'),('GI','Gibraltar','CAT020'),
('GD','Granada','CAT020'),('GR','Grecia','CAT020'),('GL','Groenlandia','CAT020'),('GP','Guadalupe','CAT020'),
('GU','Guam','CAT020'),('GT','Guatemala','CAT020'),('GF','Guayana Francesa','CAT020'),
('GG','Guernsey','CAT020'),('GN','Guinea','CAT020'),('GQ','Guinea Ecuatorial','CAT020'),
('GW','Guinea-Bissau','CAT020'),('GY','Guyana','CAT020'),('HT','Haití','CAT020'),('HN','Honduras','CAT020'),
('HK','Hong Kong','CAT020'),('HU','Hungría','CAT020'),('IN','India','CAT020'),('ID','Indonesia','CAT020'),
('IQ','Irak','CAT020'),('IE','Irlanda','CAT020'),('BV','Isla Bouvet','CAT020'),('IM','Isla de Man','CAT020'),
('NF','Isla Norfolk','CAT020'),('IS','Islandia','CAT020'),('CX','Islas Navidad','CAT020'),
('CC','Islas Cocos','CAT020'),('CK','Islas Cook','CAT020'),('FO','Islas Faroe','CAT020'),
('GS','Islas Georgias d. S.~Sandwich d. S.','CAT020'),('HM','Islas Heard y McDonald','CAT020'),
('FK','Islas Malvinas (Falkland)','CAT020'),('MP','Islas Marianas del Norte','CAT020'),
('MH','Islas Marshall','CAT020'),('PN','Islas Pitcairn','CAT020'),('TC','Islas Turcas y Caicos','CAT020'),
('UM','Islas Ultramarinas de E.E.U.U','CAT020'),('VI','Islas Vírgenes','CAT020'),('IL','Israel','CAT020'),
('IT','Italia','CAT020'),('JM','Jamaica','CAT020'),('JP','Japón','CAT020'),('JE','Jersey','CAT020'),
('JO','Jordania','CAT020'),('KZ','Kazajistán','CAT020'),('KE','Kenia','CAT020'),('KG','Kirguistán','CAT020'),
('KI','Kiribati','CAT020'),('KW','Kuwait','CAT020'),('LA','Laos, República Democrática','CAT020'),
('LS','Lesotho','CAT020'),('LV','Letonia','CAT020'),('LB','Líbano','CAT020'),('LR','Liberia','CAT020'),
('LY','Libia','CAT020'),('LI','Liechtenstein','CAT020'),('LT','Lituania','CAT020'),
('LU','Luxemburgo','CAT020'),('MO','Macao','CAT020'),('MK','Macedonia','CAT020'),('MG','Madagascar','CAT020'),
('MY','Malasia','CAT020'),('MW','Malawi','CAT020'),('MV','Maldivas','CAT020'),('ML','Malí','CAT020'),
('MT','Malta','CAT020'),('MA','Marruecos','CAT020'),('MQ','Martinica e.a.','CAT020'),
('MU','Mauricio','CAT020'),('MR','Mauritania','CAT020'),('YT','Mayotte','CAT020'),('MX','México','CAT020'),
('FM','Micronesia','CAT020'),('MD','Moldavia, República de','CAT020'),('MC','Mónaco','CAT020'),
('MN','Mongolia','CAT020'),('ME','Montenegro','CAT020'),('MS','Montserrat','CAT020'),
('MZ','Mozambique','CAT020'),('MM','Myanmar','CAT020'),('NA','Namibia','CAT020'),('NR','Nauru','CAT020'),
('NP','Nepal','CAT020'),('NI','Nicaragua','CAT020'),('NE','Níger','CAT020'),('NG','Nigeria','CAT020'),
('NU','Niue','CAT020'),('NO','Noruega','CAT020'),('NC','Nueva Caledonia','CAT020'),
('NZ','Nueva Zelanda','CAT020'),('OM','Omán','CAT020'),('NL','Países Bajos','CAT020'),
('PK','Pakistán','CAT020'),('PW','Palaos','CAT020'),('PS','Palestina','CAT020'),('PA','Panamá','CAT020'),
('PG','Papúa, Nueva Guinea','CAT020'),('PY','Paraguay','CAT020'),('PE','Perú','CAT020'),
('PF','Polinesia Francesa','CAT020'),('PL','Polonia','CAT020'),('PT','Portugal','CAT020'),
('PR','Puerto Rico','CAT020'),('QA','Qatar','CAT020'),('GB','Reino Unido','CAT020'),
('KP','Rep. Democrática popular de Corea','CAT020'),('CZ','República Checa','CAT020'),
('KR','República de Corea','CAT020'),('CD','República Democrática del Congo','CAT020'),
('DO','República Dominicana','CAT020'),('IR','República Islámica de Irán','CAT020'),
('RE','Reunión','CAT020'),('RW','Ruanda','CAT020'),('RO','Rumania','CAT020'),('RU','Rusia','CAT020'),
('EH','Sahara Occidental','CAT020'),('BL','Saint Barthélemy','CAT020'),
('MF','Saint Martin (French part)','CAT020'),('SB','Salomón, Islas','CAT020'),('WS','Samoa','CAT020'),
('AS','Samoa Americana','CAT020'),('KN','San Cristóbal y Nieves','CAT020'),('SM','San Marino','CAT020'),
('PM','San Pedro y Miquelón','CAT020'),('VC','San Vicente y las Granadinas','CAT020'),
('SH','Santa Elena','CAT020'),('LC','Santa Lucía','CAT020'),('ST','Santo Tomé y Príncipe','CAT020'),
('SN','Senegal','CAT020'),('RS','Serbia','CAT020'),('SC','Seychelles','CAT020'),
('SL','Sierra Leona','CAT020'),('SG','Singapur','CAT020'),('SX','Sint Maarten (Dutch part)','CAT020'),
('SY','Siria','CAT020'),('SO','Somalia','CAT020'),('SS','South Sudan','CAT020'),('LK','Sri Lanka','CAT020'),
('ZA','Sudáfrica','CAT020'),('SD','Sudán','CAT020'),('SE','Suecia','CAT020'),('CH','Suiza','CAT020'),
('SR','Surinám','CAT020'),('SJ','Svalbard y Jan Mayen','CAT020'),('SZ','Swazilandia','CAT020'),
('TH','Tailandia','CAT020'),('TW','Taiwan, Provincia de China','CAT020'),
('TZ','Tanzania, República Unida de','CAT020'),('TJ','Tayikistán','CAT020'),
('IO','Territorio Británico Océano Índico','CAT020'),('TF','Territorios Australes Franceses','CAT020'),
('TL','Timor Oriental','CAT020'),('TG','Togo','CAT020'),('TK','Tokelau','CAT020'),('TO','Tonga','CAT020'),
('TT','Trinidad y Tobago','CAT020'),('TN','Túnez','CAT020'),('TM','Turkmenistán','CAT020'),
('TR','Turquía','CAT020'),('TV','Tuvalu','CAT020'),('UA','Ucrania','CAT020'),('UG','Uganda','CAT020'),
('UY','Uruguay','CAT020'),('UZ','Uzbekistán','CAT020'),('VU','Vanuatu','CAT020'),('VE','Venezuela','CAT020'),
('VN','Vietnam','CAT020'),('VG','Islas Vírgenes Británicas','CAT020'),('WF','Wallis y Fortuna, Islas','CAT020'),
('YE','Yemen','CAT020'),('ZM','Zambia','CAT020'),('ZW','Zimbabue','CAT020');

-- Extensión catalogo_paises (códigos ISO3 y numérico para los principales).
-- Para los demás se rellena con un placeholder; actualizar luego con la tabla ISO 3166-1 oficial.
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'AFG', '004' FROM catalogo_especial WHERE codigo='AF' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'ALB', '008' FROM catalogo_especial WHERE codigo='AL' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'DEU', '276' FROM catalogo_especial WHERE codigo='DE' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'ARG', '032' FROM catalogo_especial WHERE codigo='AR' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'BRA', '076' FROM catalogo_especial WHERE codigo='BR' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'CAN', '124' FROM catalogo_especial WHERE codigo='CA' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'CHN', '156' FROM catalogo_especial WHERE codigo='CN' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'COL', '170' FROM catalogo_especial WHERE codigo='CO' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'CRI', '188' FROM catalogo_especial WHERE codigo='CR' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'CUB', '192' FROM catalogo_especial WHERE codigo='CU' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'ECU', '218' FROM catalogo_especial WHERE codigo='EC' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'SLV', '222' FROM catalogo_especial WHERE codigo='SV' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'ESP', '724' FROM catalogo_especial WHERE codigo='ES' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'USA', '840' FROM catalogo_especial WHERE codigo='US' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'FRA', '250' FROM catalogo_especial WHERE codigo='FR' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'GTM', '320' FROM catalogo_especial WHERE codigo='GT' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'HND', '340' FROM catalogo_especial WHERE codigo='HN' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'ITA', '380' FROM catalogo_especial WHERE codigo='IT' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'JPN', '392' FROM catalogo_especial WHERE codigo='JP' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'MEX', '484' FROM catalogo_especial WHERE codigo='MX' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'NIC', '558' FROM catalogo_especial WHERE codigo='NI' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'PAN', '591' FROM catalogo_especial WHERE codigo='PA' AND tipo_catalogo='CAT020';
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT id, 'GBR', '826' FROM catalogo_especial WHERE codigo='GB' AND tipo_catalogo='CAT020';

-- Placeholder para países no listados (deben actualizarse con la tabla ISO 3166-1 oficial)
INSERT INTO catalogo_paises (catalogo_especial_id, codigo_iso3, codigo_numerico)
SELECT ce.id,
       CONCAT(ce.codigo, 'X'),
       LPAD(ce.id MOD 999, 3, '0')
FROM catalogo_especial ce
LEFT JOIN catalogo_paises cp ON cp.catalogo_especial_id = ce.id
WHERE ce.tipo_catalogo='CAT020' AND cp.id IS NULL;

COMMIT;
START TRANSACTION;

-- =====================================================================
-- CAT-028: Régimen (catalogo_especial + catalogo_regimen)
-- =====================================================================

INSERT INTO catalogo_especial (codigo, descripcion, tipo_catalogo) VALUES
('EX-1.1000.000','Exportación Definitiva. Régimen Común','CAT028'),
('EX-1.1040.000','Exportación Definitiva Sustitución de Mercancías. Régimen Común','CAT028'),
('EX-1.1041.020','Exportación Definitiva Proveniente de Franquicia Provisional. Franq. Presidenciales exento de DAI','CAT028'),
('EX-1.1041.021','Exportación Definitiva Proveniente de Franquicia Provisional. Franq. Presidenciales exento de DAI e IVA','CAT028'),
('EX-1.1048.025','Exportación Definitiva Proveniente de Franquicia Definitiva. Maquinaria y Equipo LZF. DPA','CAT028'),
('EX-1.1048.031','Exportación Definitiva Proveniente de Franquicia Definitiva. Distribución Internacional','CAT028'),
('EX-1.1048.032','Exportación Definitiva Proveniente. de Franquicia Definitiva. Operaciones Internacionales de Logística','CAT028'),
('EX-1.1048.033','Exportación Definitiva Proveniente de Franquicia Definitiva. Centro Internacional de llamadas (Call Center)','CAT028'),
('EX-1.1048.034','Exportación Definitiva Proveniente de Franquicia Definitiva. Tecnologías de Información LSI','CAT028'),
('EX-1.1048.035','Exportación Definitiva Proveniente de Franquicia Definitiva. Investigación y Desarrollo LSI','CAT028'),
('EX-1.1048.036','Exportación Definitiva Proveniente de Franquicia Definitiva. Reparación y Mantenimiento de Embarcaciones Marítimas LSI','CAT028'),
('EX-1.1048.037','Exportación Definitiva Proveniente de Franquicia Definitiva. Reparación y Mantenimiento de Aeronaves LSI','CAT028'),
('EX-1.1048.038','Exportación Definitiva Proveniente de Franquicia Definitiva. Procesos Empresariales LSI','CAT028'),
('EX-1.1048.039','Exportación Definitiva Proveniente de Franquicia Definitiva. Servicios Médico-Hospitalarios LSI','CAT028'),
('EX-1.1048.040','Exportación Definitiva Proveniente de Franquicia Definitiva. Servicios Financieros Internacionales LSI','CAT028'),
('EX-1.1048.043','Exportación Definitiva Proveniente de Franquicia Definitiva. Reparación y Mantenimiento de Contenedores LSI','CAT028'),
('EX-1.1048.044','Exportación Definitiva Proveniente de Franquicia Definitiva. Reparación de Equipos Tecnológicos LSI','CAT028'),
('EX-1.1048.054','Exportación Definitiva Proveniente de Franquicia Definitiva. Atención Ancianos y Convalecientes LSI','CAT028'),
('EX-1.1048.055','Exportación Definitiva Proveniente de Franquicia Definitiva. Telemedicina LSI','CAT028'),
('EX-1.1048.056','Exportación Definitiva Proveniente de Franquicia Definitiva. Cinematografía LSI','CAT028'),
('EX-1.1052.000','Exportación Definitiva de DPA con origen en Compras Locales. Régimen Común','CAT028'),
('EX-1.1054.000','Exportación Definitiva de Zona Franca con origen en Compras Locales. Régimen Común','CAT028'),
('EX-1.1100.000','Exportación Definitiva de Envíos de Socorro. Régimen Común','CAT028'),
('EX-1.1200.000','Exportación Definitiva de Envíos Postales. Régimen Común','CAT028'),
('EX-1.1300.000','Exportación Definitiva Envíos que requieren despacho urgente. Régimen Común','CAT028'),
('EX-1.1400.000','Exportación Definitiva Courier. Régimen Común','CAT028'),
('EX-1.1400.011','Exportación Definitiva Courier. Muestras Sin Valor Comercial','CAT028'),
('EX-1.1400.012','Exportación Definitiva Courier. Material Publicitario','CAT028'),
('EX-1.1400.017','Exportación Definitiva Courier. Declaración de Documentos','CAT028'),
('EX-1.1500.000','Exportación Definitiva Menaje de casa. Régimen Común','CAT028'),
('EX-2.2100.000','Exportación Temporal para Perfeccionamiento Pasivo. Régimen Común','CAT028'),
('EX-2.2200.000','Exportación Temporal con Reimportación en el mismo estado. Régimen Común','CAT028'),
('EX-2.2400.000','Traslados Definitivos','CAT028'),
('EX-3.3050.000','Reexportación Proveniente de Importación Temporal. Régimen Común','CAT028'),
('EX-3.3051.000','Reexportación Proveniente de Tiendas Libres. Régimen Común','CAT028'),
('EX-3.3052.000','Reexportación Proveniente de Admisión Temporal para Perfeccionamiento Activo. Régimen Común','CAT028'),
('EX-3.3053.000','Reexportación Proveniente de Admisión Temporal. Régimen Común','CAT028'),
('EX-3.3054.000','Reexportación Proveniente de Régimen de Zona Franca. Régimen Común','CAT028'),
('EX-3.3055.000','Reexportación Proveniente de Admisión Temporal para Perfeccionamiento Activo con Garantía. Régimen Común','CAT028'),
('EX-3.3056.000','Reexportación Proveniente de Admisión Temporal Distribución Internacional Parque de Servicios. Régimen Común','CAT028'),
('EX-3.3056.057','Reexportación Proveniente de Admisión Temporal Distribución Internacional Parque de Servicios. Remisión entre Usuarios Directos del Mismo Parque de Servicios','CAT028'),
('EX-3.3056.058','Reexportación Proveniente de Admisión Temporal Distribución Internacional Parque de Servicios. Remisión entre Usuarios Directos de Diferente Parque de Servicios','CAT028'),
('EX-3.3056.072','Reexportación Proveniente de Admisión Temporal Distribución Internacional Parque de Servicios. Decreto 738 Eléctricos e Híbridos','CAT028'),
('EX-3.3057.000','Reexportación Proveniente de Admisión Temporal Operaciones Internacional de Logística Parque de Servicios. Régimen Común','CAT028'),
('EX-3.3057.057','Reexportación Proveniente de Admisión Temporal Operaciones Internacional de Logística Parque de Servicios. Remisión entre Usuarios Directos del Mismo Parque de Servicios','CAT028'),
('EX-3.3057.058','Reexportación Proveniente de Admisión Temporal Operaciones Internacional de Logística Parque de Servicios. Remisión entre Usuarios Directos de Diferente Parque de Servicios','CAT028'),
('EX-3.3058.033','Reexportación Proveniente de Admisión Temporal Centro Servicio LSI. Centro Internacional de llamadas (Call Center)','CAT028'),
('EX-3.3058.036','Reexportación Proveniente de Admisión Temporal Centro Servicio LSI. Reparación y Mantenimiento de Embarcaciones Marítimas LSI','CAT028'),
('EX-3.3058.037','Reexportación Proveniente de Admisión Temporal Centro Servicio LSI. Reparación y Mantenimiento de Aeronaves LSI','CAT028'),
('EX-3.3058.043','Reexportación Proveniente de Admisión Temporal Centro Servicio LSI. Reparación y Mantenimiento de Contenedores LSI','CAT028'),
('EX-3.3059.000','Reexportación Proveniente de Admisión Temporal Reparación de Equipo Tecnológico Parque de Servicios. Régimen Común','CAT028'),
('EX-3.3059.057','Reexportación Proveniente de Admisión Temporal Reparación de Equipo Tecnológico Parque de Servicios. Remisión entre Usuarios Directos del Mismo Parque de Servicios','CAT028'),
('EX-3.3059.058','Reexportación Proveniente de Admisión Temporal Reparación de Equipo Tecnológico Parque de Servicios. Remisión entre Usuarios Directos de Diferente Parque de Servicios','CAT028'),
('EX-3.3070.000','Reexportación Proveniente de Depósito. Régimen Común','CAT028'),
('EX-3.3070.072','Reexportación Proveniente de Depósito. Decreto 738 Eléctricos e Híbridos','CAT028'),
('EX-3.3071.000','Reexp. Prov. de Deposito','CAT028');

-- Extensión catalogo_regimen (todos como GENERAL por defecto; ajustar según necesidad fiscal)
INSERT INTO catalogo_regimen (catalogo_especial_id, tipo_regimen)
SELECT id, 'GENERAL' FROM catalogo_especial WHERE tipo_catalogo='CAT028';

COMMIT;
START TRANSACTION;

-- =====================================================================
-- CAT-019: Códigos de Actividad Económica (CIIU)
-- Inserción como hojas de nivel 4. La estructura jerárquica completa
-- (niveles 1-3) puede inferirse posteriormente desde los prefijos de código.
-- =====================================================================

INSERT INTO catalogo_actividad_economica (codigo, descripcion, nivel, es_hoja) VALUES
('01111','Cultivo de cereales excepto arroz y para forrajes',4,1),
('01112','Cultivo de legumbres',4,1),
('01113','Cultivo de semillas oleaginosas',4,1),
('01114','Cultivo de plantas para la preparación de semillas',4,1),
('01119','Cultivo de otros cereales excepto arroz y forrajeros n.c.p.',4,1),
('01120','Cultivo de arroz',4,1),
('01131','Cultivo de raíces y tubérculos',4,1),
('01132','Cultivo de brotes bulbos vegetales tubérculos y cultivos similares',4,1),
('01133','Cultivo hortícola de fruto',4,1),
('01134','Cultivo de hortalizas de hoja y otras hortalizas ncp',4,1),
('01140','Cultivo de caña de azúcar',4,1),
('01150','Cultivo de tabaco',4,1),
('01161','Cultivo de algodón',4,1),
('01162','Cultivo de fibras vegetales excepto algodón',4,1),
('01191','Cultivo de plantas no perennes para la producción de semillas y flores',4,1),
('01192','Cultivo de cereales y pastos para la alimentación animal',4,1),
('01199','Producción de cultivos no estacionales ncp',4,1),
('01220','Cultivo de frutas tropicales',4,1),
('01230','Cultivo de cítricos',4,1),
('01240','Cultivo de frutas de pepita y hueso',4,1),
('01251','Cultivo de frutas ncp',4,1),
('01252','Cultivo de otros frutos y nueces de árboles y arbustos',4,1),
('01260','Cultivo de frutos oleaginosos',4,1),
('01271','Cultivo de café',4,1),
('01272','Cultivo de plantas para la elaboración de bebidas excepto café',4,1),
('01281','Cultivo de especias y aromáticas',4,1),
('01282','Cultivo de plantas para la obtención de productos medicinales y farmacéuticos',4,1),
('01291','Cultivo de árboles de hule (caucho) para la obtención de látex',4,1),
('01292','Cultivo de plantas para la obtención de productos químicos y colorantes',4,1),
('01299','Producción de cultivos perennes ncp',4,1),
('01300','Propagación de plantas',4,1),
('01301','Cultivo de plantas y flores ornamentales',4,1),
('01410','Cría y engorde de ganado bovino',4,1),
('01420','Cría de caballos y otros equinos',4,1),
('01440','Cría de ovejas y cabras',4,1),
('01450','Cría de cerdos',4,1),
('01460','Cría de aves de corral y producción de huevos',4,1),
('01491','Cría de abejas apicultura para la obtención de miel y otros productos apícolas',4,1),
('01492','Cría de conejos',4,1),
('01493','Cría de iguanas y garrobos',4,1),
('01494','Cría de mariposas y otros insectos',4,1),
('01499','Cría y obtención de productos animales n.c.p.',4,1),
('01500','Cultivo de productos agrícolas en combinación con la cría de animales',4,1),
('01611','Servicios de maquinaria agrícola',4,1),
('01612','Control de plagas',4,1),
('01613','Servicios de riego',4,1),
('01614','Servicios de contratación de mano de obra para la agricultura',4,1),
('01619','Servicios agrícolas ncp',4,1),
('01621','Actividades para mejorar la reproducción el crecimiento y el rendimiento de los animales y sus productos',4,1),
('01622','Servicios de mano de obra pecuaria',4,1),
('01629','Servicios pecuarios ncp',4,1),
('01631','Labores post cosecha de preparación de los productos agrícolas para su comercialización o para la industria',4,1),
('01632','Servicio de beneficio de café',4,1),
('01633','Servicio de beneficiado de plantas textiles',4,1),
('01640','Tratamiento de semillas para la propagación',4,1),
('01700','Caza ordinaria y mediante trampas repoblación de animales de caza y servicios conexos',4,1),
('02100','Silvicultura y otras actividades forestales',4,1),
('02200','Extracción de madera',4,1),
('02300','Recolección de productos diferentes a la madera',4,1),
('02400','Servicios de apoyo a la silvicultura',4,1),
('03110','Pesca marítima de altura y costera',4,1),
('03120','Pesca de agua dulce',4,1),
('03210','Acuicultura marítima',4,1),
('03220','Acuicultura de agua dulce',4,1),
('03300','Servicios de apoyo a la pesca y acuicultura',4,1),
('05100','Extracción de hulla',4,1),
('05200','Extracción y aglomeración de lignito',4,1),
('06100','Extracción de petróleo crudo',4,1),
('06200','Extracción de gas natural',4,1),
('07100','Extracción de minerales de hierro',4,1),
('07210','Extracción de minerales de uranio y torio',4,1),
('07290','Extracción de minerales metalíferos no ferrosos',4,1),
('08100','Extracción de piedra arena y arcilla',4,1),
('08910','Extracción de minerales para la fabricación de abonos y productos químicos',4,1),
('08920','Extracción y aglomeración de turba',4,1),
('08930','Extracción de sal',4,1),
('08990','Explotación de otras minas y canteras ncp',4,1),
('09100','Actividades de apoyo a la extracción de petróleo y gas natural',4,1),
('09900','Actividades de apoyo a la explotación de minas y canteras',4,1),
('10101','Servicio de rastros y mataderos de bovinos y porcinos',4,1),
('10102','Matanza y procesamiento de bovinos y porcinos',4,1),
('10103','Matanza y procesamientos de aves de corral',4,1),
('10104','Elaboración y conservación de embutidos y tripas naturales',4,1),
('10105','Servicios de conservación y empaque de carnes',4,1),
('10106','Elaboración y conservación de grasas y aceites animales',4,1),
('10107','Servicios de molienda de carne',4,1),
('10108','Elaboración de productos de carne ncp',4,1),
('10201','Procesamiento y conservación de pescado crustáceos y moluscos',4,1),
('10209','Fabricación de productos de pescado ncp',4,1),
('10301','Elaboración de jugos de frutas y hortalizas',4,1),
('10302','Elaboración y envase de jaleas mermeladas y frutas deshidratadas',4,1),
('10309','Elaboración de productos de frutas y hortalizas n.c.p.',4,1),
('10401','Fabricación de aceites y grasas vegetales y animales comestibles',4,1),
('10402','Fabricación de aceites y grasas vegetales y animales no comestibles',4,1),
('10409','Servicio de maquilado de aceites',4,1),
('10501','Fabricación de productos lácteos excepto sorbetes y quesos sustitutos',4,1),
('10502','Fabricación de sorbetes y helados',4,1),
('10503','Fabricación de quesos',4,1),
('10611','Molienda de cereales',4,1),
('10612','Elaboración de cereales para el desayuno y similares',4,1),
('10621','Fabricación de almidón',4,1),
('10628','Servicio de molienda de maíz húmedo molino para nixtamal',4,1),
('10711','Elaboración de tortillas',4,1),
('10712','Fabricación de pan galletas y barquillos',4,1),
('10713','Fabricación de repostería',4,1),
('10721','Ingenios azucareros',4,1),
('10722','Molienda de caña de azúcar para la elaboración de dulces',4,1),
('10723','Elaboración de jarabes de azúcar y otros similares',4,1),
('10724','Maquilado de azúcar de caña',4,1),
('10730','Fabricación de cacao chocolates y productos de confitería',4,1),
('10740','Elaboración de macarrones fideos y productos farináceos similares',4,1),
('10750','Elaboración de comidas y platos preparados para la reventa en',4,1),
('10791','Elaboración de productos de café',4,1),
('10792','Elaboración de especias sazonadores y condimentos',4,1),
('10793','Elaboración de sopas cremas y consomé',4,1),
('10794','Fabricación de bocadillos tostados y/o fritos',4,1),
('10799','Elaboración de productos alimenticios ncp',4,1),
('10800','Elaboración de alimentos preparados para animales',4,1),
('11012','Fabricación de aguardiente y licores',4,1),
('11020','Elaboración de vinos',4,1),
('11030','Fabricación de cerveza',4,1),
('11041','Fabricación de aguas gaseosas',4,1),
('11042','Fabricación y envasado de agua',4,1),
('11043','Elaboración de refrescos',4,1),
('11048','Maquilado de aguas gaseosas',4,1),
('11049','Elaboración de bebidas no alcohólicas',4,1),
('12000','Elaboración de productos de tabaco',4,1),
('13111','Preparación de fibras textiles',4,1),
('13112','Fabricación de hilados',4,1),
('13120','Fabricación de telas',4,1),
('13130','Acabado de productos textiles',4,1),
('13910','Fabricación de tejidos de punto y ganchillo',4,1),
('13921','Fabricación de productos textiles para el hogar',4,1),
('13922','Sacos bolsas y otros artículos textiles',4,1),
('13929','Fabricación de artículos confeccionados con materiales textiles excepto prendas de vestir n.c.p',4,1),
('13930','Fabricación de tapices y alfombras',4,1),
('13941','Fabricación de cuerdas de henequén y otras fibras naturales (lazos pitas)',4,1),
('13942','Fabricación de redes de diversos materiales',4,1),
('13948','Maquilado de productos trenzables de cualquier material (petates sillas etc.)',4,1),
('13991','Fabricación de adornos etiquetas y otros artículos para prendas de vestir',4,1),
('13992','Servicio de bordados en artículos y prendas de tela',4,1),
('13999','Fabricación de productos textiles ncp',4,1),
('14101','Fabricación de ropa interior para dormir y similares',4,1),
('14102','Fabricación de ropa para niños',4,1),
('14103','Fabricación de prendas de vestir para ambos sexos',4,1),
('14104','Confección de prendas a medida',4,1),
('14105','Fabricación de prendas de vestir para deportes',4,1),
('14106','Elaboración de artesanías de uso personal confeccionadas especialmente de materiales textiles',4,1),
('14108','Maquilado de prendas de vestir accesorios y otros',4,1),
('14109','Fabricación de prendas y accesorios de vestir n.c.p.',4,1),
('14200','Fabricación de artículos de piel',4,1),
('14301','Fabricación de calcetines calcetas medias (panty house) y otros similares',4,1),
('14302','Fabricación de ropa interior de tejido de punto',4,1),
('14309','Fabricación de prendas de vestir de tejido de punto ncp',4,1),
('15110','Curtido y adobo de cueros; adobo y teñido de pieles',4,1),
('15121','Fabricación de maletas bolsos de mano y otros artículos de marroquinería',4,1),
('15122','Fabricación de monturas accesorios y vainas talabartería',4,1),
('15123','Fabricación de artesanías principalmente de cuero natural y sintético',4,1),
('15128','Maquilado de artículos de cuero natural sintético y de otros materiales',4,1),
('15201','Fabricación de calzado',4,1),
('15202','Fabricación de partes y accesorios de calzado',4,1),
('15208','Maquilado de partes y accesorios de calzado',4,1),
('16100','Aserradero y acepilladura de madera',4,1),
('16210','Fabricación de madera laminada terciada enchapada y contrachapada paneles para la construcción',4,1),
('16220','Fabricación de partes y piezas de carpintería para edificios y construcciones',4,1),
('16230','Fabricación de envases y recipientes de madera',4,1),
('16292','Fabricación de artesanías de madera semillas materiales trenzables',4,1),
('16299','Fabricación de productos de madera corcho paja y materiales trenzables ncp',4,1),
('17010','Fabricación de pasta de madera papel y cartón',4,1),
('17020','Fabricación de papel y cartón ondulado y envases de papel y cartón',4,1),
('17091','Fabricación de artículos de papel y cartón de uso personal y doméstico',4,1),
('17092','Fabricación de productos de papel ncp',4,1),
('18110','Impresión',4,1),
('18120','Servicios relacionados con la impresión',4,1),
('18200','Reproducción de grabaciones',4,1),
('19100','Fabricación de productos de hornos de coque',4,1),
('19201','Fabricación de combustible',4,1),
('19202','Fabricación de aceites y lubricantes',4,1),
('20111','Fabricación de materias primas para la fabricación de colorantes',4,1),
('20112','Fabricación de materiales curtientes',4,1),
('20113','Fabricación de gases industriales',4,1),
('20114','Fabricación de alcohol etílico',4,1),
('20119','Fabricación de sustancias químicas básicas',4,1),
('20120','Fabricación de abonos y fertilizantes',4,1),
('20130','Fabricación de plástico y caucho en formas primarias',4,1),
('20210','Fabricación de plaguicidas y otros productos químicos de uso agropecuario',4,1),
('20220','Fabricación de pinturas barnices y productos de revestimiento similares; tintas de imprenta y masillas',4,1),
('20231','Fabricación de jabones detergentes y similares para limpieza',4,1),
('20232','Fabricación de perfumes cosméticos y productos de higiene y cuidado personal incluyendo tintes champú etc.',4,1),
('20291','Fabricación de tintas y colores para escribir y pintar; fabricación de cintas para impresoras',4,1),
('20292','Fabricación de productos pirotécnicos explosivos y municiones',4,1),
('20299','Fabricación de productos químicos n.c.p.',4,1),
('20300','Fabricación de fibras artificiales',4,1),
('21001','Manufactura de productos farmacéuticos sustancias químicas y productos botánicos',4,1),
('21008','Maquilado de medicamentos',4,1),
('22110','Fabricación de cubiertas y cámaras; renovación y recauchutado de cubiertas',4,1),
('22190','Fabricación de otros productos de caucho',4,1),
('22201','Fabricación de envases plásticos',4,1),
('22202','Fabricación de productos plásticos para uso personal o doméstico',4,1),
('22208','Maquila de plásticos',4,1),
('22209','Fabricación de productos plásticos n.c.p.',4,1),
('23101','Fabricación de vidrio',4,1),
('23102','Fabricación de recipientes y envases de vidrio',4,1),
('23108','Servicio de maquilado',4,1),
('23109','Fabricación de productos de vidrio ncp',4,1),
('23910','Fabricación de productos refractarios',4,1),
('23920','Fabricación de productos de arcilla para la construcción',4,1),
('23931','Fabricación de productos de cerámica y porcelana no refractaria',4,1),
('23932','Fabricación de productos de cerámica y porcelana ncp',4,1),
('23940','Fabricación de cemento cal y yeso',4,1),
('23950','Fabricación de artículos de hormigón cemento y yeso',4,1),
('23960','Corte tallado y acabado de la piedra',4,1),
('23990','Fabricación de productos minerales no metálicos ncp',4,1),
('24100','Industrias básicas de hierro y acero',4,1),
('24200','Fabricación de productos primarios de metales preciosos y metales no ferrosos',4,1),
('24310','Fundición de hierro y acero',4,1),
('24320','Fundición de metales no ferrosos',4,1),
('25111','Fabricación de productos metálicos para uso estructural',4,1),
('25118','Servicio de maquila para la fabricación de estructuras metálicas',4,1),
('25120','Fabricación de tanques depósitos y recipientes de metal',4,1),
('25130','Fabricación de generadores de vapor excepto calderas de agua caliente para calefacción central',4,1),
('25200','Fabricación de armas y municiones',4,1),
('25910','Forjado prensado estampado y laminado de metales; pulvimetalurgia',4,1),
('25920','Tratamiento y revestimiento de metales',4,1),
('25930','Fabricación de artículos de cuchillería herramientas de mano y artículos de ferretería',4,1),
('25991','Fabricación de envases y artículos conexos de metal',4,1),
('25992','Fabricación de artículos metálicos de uso personal y/o doméstico',4,1),
('25999','Fabricación de productos elaborados de metal ncp',4,1),
('26100','Fabricación de componentes electrónicos',4,1),
('26200','Fabricación de computadoras y equipo conexo',4,1),
('26300','Fabricación de equipo de comunicaciones',4,1),
('26400','Fabricación de aparatos electrónicos de consumo para audio video radio y televisión',4,1),
('26510','Fabricación de instrumentos y aparatos para medir verificar ensayar navegar y de control de procesos industriales',4,1),
('26520','Fabricación de relojes y piezas de relojes',4,1),
('26600','Fabricación de equipo médico de irradiación y equipo electrónico de uso médico y terapéutico',4,1),
('26700','Fabricación de instrumentos de óptica y equipo fotográfico',4,1),
('26800','Fabricación de medios magnéticos y ópticos',4,1),
('27100','Fabricación de motores generadores transformadores eléctricos aparatos de distribución y control de electricidad',4,1),
('27200','Fabricación de pilas baterías y acumuladores',4,1),
('27310','Fabricación de cables de fibra óptica',4,1),
('27320','Fabricación de otros hilos y cables eléctricos',4,1),
('27330','Fabricación de dispositivos de cableados',4,1),
('27400','Fabricación de equipo eléctrico de iluminación',4,1),
('27500','Fabricación de aparatos de uso doméstico',4,1),
('27900','Fabricación de otros tipos de equipo eléctrico',4,1),
('28110','Fabricación de motores y turbinas excepto motores para aeronaves vehículos automotores y motocicletas',4,1),
('28120','Fabricación de equipo hidráulico',4,1),
('28130','Fabricación de otras bombas compresores grifos y válvulas',4,1),
('28140','Fabricación de cojinetes engranajes trenes de engranajes y piezas de transmisión',4,1),
('28150','Fabricación de hornos y quemadores',4,1),
('28160','Fabricación de equipo de elevación y manipulación',4,1),
('28170','Fabricación de maquinaria y equipo de oficina',4,1),
('28180','Fabricación de herramientas manuales',4,1),
('28190','Fabricación de otros tipos de maquinaria de uso general',4,1),
('28210','Fabricación de maquinaria agropecuaria y forestal',4,1),
('28220','Fabricación de máquinas para conformar metales y maquinaria herramienta',4,1),
('28230','Fabricación de maquinaria metalúrgica',4,1),
('28240','Fabricación de maquinaria para la explotación de minas y canteras y para obras de construcción',4,1),
('28250','Fabricación de maquinaria para la elaboración de alimentos bebidas y tabaco',4,1),
('28260','Fabricación de maquinaria para la elaboración de productos textiles prendas de vestir y cueros',4,1),
('28291','Fabricación de máquinas para imprenta',4,1),
('28299','Fabricación de maquinaria de uso especial ncp',4,1),
('29100','Fabricación vehículos automotores',4,1),
('29200','Fabricación de carrocerías para vehículos automotores; fabricación de remolques y semirremolques',4,1),
('29300','Fabricación de partes piezas y accesorios para vehículos automotores',4,1),
('30110','Fabricación de buques',4,1),
('30120','Construcción y reparación de embarcaciones de recreo',4,1),
('30200','Fabricación de locomotoras y de material rodante',4,1),
('30300','Fabricación de aeronaves y naves espaciales',4,1),
('30400','Fabricación de vehículos militares de combate',4,1),
('30910','Fabricación de motocicletas',4,1),
('30920','Fabricación de bicicletas y sillones de ruedas para inválidos',4,1),
('30990','Fabricación de equipo de transporte ncp',4,1),
('31001','Fabricación de colchones y somier',4,1),
('31002','Fabricación de muebles y otros productos de madera a medida',4,1),
('31008','Servicios de maquilado de muebles',4,1),
('31009','Fabricación de muebles ncp',4,1),
('32110','Fabricación de joyas platerías y joyerías',4,1),
('32120','Fabricación de joyas de imitación (fantasía) y artículos conexos',4,1),
('32200','Fabricación de instrumentos musicales',4,1),
('32301','Fabricación de artículos de deporte',4,1),
('32308','Servicio de maquila de productos deportivos',4,1),
('32401','Fabricación de juegos de mesa y de salón',4,1),
('32402','Servicio de maquilado de juguetes y juegos',4,1),
('32409','Fabricación de juegos y juguetes n.c.p.',4,1),
('32500','Fabricación de instrumentos y materiales médicos y odontológicos',4,1),
('32901','Fabricación de lápices bolígrafos sellos y artículos de librería en general',4,1),
('32902','Fabricación de escobas cepillos pinceles y similares',4,1),
('32903','Fabricación de artesanías de materiales diversos',4,1),
('32904','Fabricación de artículos de uso personal y domésticos n.c.p.',4,1),
('32905','Fabricación de accesorios para las confecciones y la marroquinería n.c.p.',4,1),
('32908','Servicios de maquila ncp',4,1),
('32909','Fabricación de productos manufacturados n.c.p.',4,1),
('33110','Reparación y mantenimiento de productos elaborados de metal',4,1),
('33120','Reparación y mantenimiento de maquinaria',4,1),
('33130','Reparación y mantenimiento de equipo electrónico y óptico',4,1),
('33140','Reparación y mantenimiento de equipo eléctrico',4,1),
('33150','Reparación y mantenimiento de equipo de transporte excepto vehículos automotores',4,1),
('33190','Reparación y mantenimiento de equipos n.c.p.',4,1),
('33200','Instalación de maquinaria y equipo industrial',4,1),
('35101','Generación de energía eléctrica',4,1),
('35102','Transmisión de energía eléctrica',4,1),
('35103','Distribución de energía eléctrica',4,1),
('35200','Fabricación de gas distribución de combustibles gaseosos por tuberías',4,1),
('35300','Suministro de vapor y agua caliente',4,1),
('36000','Captación tratamiento y suministro de agua',4,1),
('37000','Evacuación de aguas residuales (alcantarillado)',4,1),
('38110','Recolección y transporte de desechos sólidos proveniente de hogares y sector urbano',4,1),
('38120','Recolección de desechos peligrosos',4,1),
('38210','Tratamiento y eliminación de desechos inicuos',4,1),
('38220','Tratamiento y eliminación de desechos peligrosos',4,1),
('38301','Reciclaje de desperdicios y desechos textiles',4,1),
('38302','Reciclaje de desperdicios y desechos de plástico y caucho',4,1),
('38303','Reciclaje de desperdicios y desechos de vidrio',4,1),
('38304','Reciclaje de desperdicios y desechos de papel y cartón',4,1),
('38305','Reciclaje de desperdicios y desechos metálicos',4,1),
('38309','Reciclaje de desperdicios y desechos no metálicos n.c.p.',4,1),
('39000','Actividades de Saneamiento y otros Servicios de Gestión de Desechos',4,1),
('41001','Construcción de edificios residenciales',4,1),
('41002','Construcción de edificios no residenciales',4,1),
('42100','Construcción de carreteras calles y caminos',4,1),
('42200','Construcción de proyectos de servicio público',4,1),
('42900','Construcción de obras de ingeniería civil n.c.p.',4,1),
('43110','Demolición',4,1),
('43120','Preparación de terreno',4,1),
('43210','Instalaciones eléctricas',4,1),
('43220','Instalación de fontanería calefacción y aire acondicionado',4,1),
('43290','Otras instalaciones para obras de construcción',4,1),
('43300','Terminación y acabado de edificios',4,1),
('43900','Otras actividades especializadas de construcción',4,1),
('43901','Fabricación de techos y materiales diversos',4,1),
('45100','Venta de vehículos automotores',4,1),
('45201','Reparación mecánica de vehículos automotores',4,1),
('45202','Reparaciones eléctricas del automotor y recarga de baterías',4,1),
('45203','Enderezado y pintura de vehículos automotores',4,1),
('45204','Reparaciones de radiadores escapes y silenciadores',4,1),
('45205','Reparación y reconstrucción de vías stop y otros artículos de fibra de vidrio',4,1),
('45206','Reparación de llantas de vehículos automotores',4,1),
('45207','Polarizado de vehículos (mediante la adhesión de papel especial a los vidrios)',4,1),
('45208','Lavado y pasteado de vehículos (carwash)',4,1),
('45209','Reparaciones de vehículos n.c.p.',4,1),
('45211','Remolque de vehículos automotores',4,1),
('45301','Venta de partes piezas y accesorios nuevos para vehículos automotores',4,1),
('45302','Venta de partes piezas y accesorios usados para vehículos automotores',4,1),
('45401','Venta de motocicletas',4,1),
('45402','Venta de repuestos piezas y accesorios de motocicletas',4,1),
('45403','Mantenimiento y reparación de motocicletas',4,1);

INSERT INTO catalogo_actividad_economica (codigo, descripcion, nivel, es_hoja) VALUES
('46100','Venta al por mayor a cambio de retribución o por contrata',4,1),
('46201','Venta al por mayor de materias primas agrícolas',4,1),
('46202','Venta al por mayor de productos de la silvicultura',4,1),
('46203','Venta al por mayor de productos pecuarios y de granja',4,1),
('46211','Venta de productos para uso agropecuario',4,1),
('46291','Venta al por mayor de granos básicos (cereales leguminosas)',4,1),
('46292','Venta al por mayor de semillas mejoradas para cultivo',4,1),
('46293','Venta al por mayor de café oro y uva',4,1),
('46294','Venta al por mayor de caña de azúcar',4,1),
('46295','Venta al por mayor de flores plantas y otros productos naturales',4,1),
('46296','Venta al por mayor de productos agrícolas',4,1),
('46297','Venta al por mayor de ganado bovino (vivo)',4,1),
('46298','Venta al por mayor de animales porcinos ovinos caprino canículas apícolas avícolas vivos',4,1),
('46299','Venta de otras especies vivas del reino animal',4,1),
('46301','Venta al por mayor de alimentos',4,1),
('46302','Venta al por mayor de bebidas',4,1),
('46303','Venta al por mayor de tabaco',4,1),
('46371','Venta al por mayor de frutas hortalizas (verduras) legumbres y tubérculos',4,1),
('46372','Venta al por mayor de pollos gallinas destazadas pavos y otras aves',4,1),
('46373','Venta al por mayor de carne bovina y porcina productos de carne y embutidos',4,1),
('46374','Venta al por mayor de huevos',4,1),
('46375','Venta al por mayor de productos lácteos',4,1),
('46376','Venta al por mayor de productos farináceos de panadería (pan dulce cakes repostería etc.)',4,1),
('46377','Venta al por mayor de pastas alimenticias aceites y grasas comestibles vegetal y animal',4,1),
('46378','Venta al por mayor de sal comestible',4,1),
('46379','Venta al por mayor de azúcar',4,1),
('46391','Venta al por mayor de abarrotes (vinos licores productos alimenticios envasados etc.)',4,1),
('46392','Venta al por mayor de aguas gaseosas',4,1),
('46393','Venta al por mayor de agua purificada',4,1),
('46394','Venta al por mayor de refrescos y otras bebidas líquidas o en polvo',4,1),
('46395','Venta al por mayor de cerveza y licores',4,1),
('46396','Venta al por mayor de hielo',4,1),
('46411','Venta al por mayor de hilados tejidos y productos textiles de mercería',4,1),
('46412','Venta al por mayor de artículos textiles excepto confecciones para el hogar',4,1),
('46413','Venta al por mayor de confecciones textiles para el hogar',4,1),
('46414','Venta al por mayor de prendas de vestir y accesorios de vestir',4,1),
('46415','Venta al por mayor de ropa usada',4,1),
('46416','Venta al por mayor de calzado',4,1),
('46417','Venta al por mayor de artículos de marroquinería y talabartería',4,1),
('46418','Venta al por mayor de artículos de peletería',4,1),
('46419','Venta al por mayor de otros artículos textiles n.c.p.',4,1),
('46471','Venta al por mayor de instrumentos musicales',4,1),
('46472','Venta al por mayor de colchones almohadas cojines etc.',4,1),
('46473','Venta al por mayor de artículos de aluminio para el hogar y para otros usos',4,1),
('46474','Venta al por mayor de depósitos y otros artículos plásticos para el hogar y otros usos',4,1),
('46475','Venta al por mayor de cámaras fotográficas accesorios y materiales',4,1),
('46482','Venta al por mayor de medicamentos artículos y otros productos de uso veterinario',4,1),
('46483','Venta al por mayor de productos y artículos de belleza y de uso personal',4,1),
('46484','Venta de productos farmacéuticos y medicinales',4,1),
('46491','Venta al por mayor de productos medicinales cosméticos perfumería y productos de limpieza',4,1),
('46492','Venta al por mayor de relojes y artículos de joyería',4,1),
('46493','Venta al por mayor de electrodomésticos y artículos del hogar excepto bazar; artículos de iluminación',4,1),
('46494','Venta al por mayor de artículos de bazar y similares',4,1),
('46495','Venta al por mayor de artículos de óptica',4,1),
('46496','Venta al por mayor de revistas periódicos libros artículos de librería y artículos de papel y cartón en general',4,1),
('46497','Venta de artículos deportivos juguetes y rodados',4,1),
('46498','Venta al por mayor de productos usados para el hogar o el uso personal',4,1),
('46499','Venta al por mayor de enseres domésticos y de uso personal n.c.p.',4,1),
('46500','Venta al por mayor de bicicletas partes accesorios y otros',4,1),
('46510','Venta al por mayor de computadoras equipo periférico y programas informáticos',4,1),
('46520','Venta al por mayor de equipos de comunicación',4,1),
('46530','Venta al por mayor de maquinaria y equipo agropecuario accesorios partes y suministros',4,1),
('46590','Venta de equipos e instrumentos de uso profesional y científico y aparatos de medida y control',4,1),
('46591','Venta al por mayor de maquinaria equipo accesorios y materiales para la industria de la madera y sus productos',4,1),
('46592','Venta al por mayor de maquinaria equipo accesorios y materiales para la industria gráfica',4,1),
('46593','Venta al por mayor de maquinaria equipo accesorios y materiales para la industria de productos químicos plástico y caucho',4,1),
('46594','Venta al por mayor de maquinaria equipo accesorios y materiales para la industria metálica y de sus productos',4,1),
('46595','Venta al por mayor de equipamiento para uso médico odontológico veterinario y servicios conexos',4,1),
('46596','Venta al por mayor de maquinaria equipo accesorios y partes para la industria de la alimentación',4,1),
('46597','Venta al por mayor de maquinaria equipo accesorios y partes para la industria textil confecciones y cuero',4,1),
('46598','Venta al por mayor de maquinaria equipo y accesorios para la construcción y explotación de minas y canteras',4,1),
('46599','Venta al por mayor de otro tipo de maquinaria y equipo con sus accesorios y partes',4,1),
('46610','Venta al por mayor de otros combustibles sólidos líquidos gaseosos y de productos conexos',4,1),
('46612','Venta al por mayor de combustibles para automotores aviones barcos maquinaria y otros',4,1),
('46613','Venta al por mayor de lubricantes grasas y otros aceites para automotores maquinaria industrial etc.',4,1),
('46614','Venta al por mayor de gas propano',4,1),
('46615','Venta al por mayor de leña y carbón',4,1),
('46620','Venta al por mayor de metales y minerales metalíferos',4,1),
('46631','Venta al por mayor de puertas ventanas vitrinas y similares',4,1),
('46632','Venta al por mayor de artículos de ferretería y pinturerías',4,1),
('46633','Vidrierías',4,1),
('46634','Venta al por mayor de maderas',4,1),
('46639','Venta al por mayor de materiales para la construcción n.c.p.',4,1),
('46691','Venta al por mayor de sal industrial sin yodar',4,1),
('46692','Venta al por mayor de productos intermedios y desechos de origen textil',4,1),
('46693','Venta al por mayor de productos intermedios y desechos de origen metálico',4,1),
('46694','Venta al por mayor de productos intermedios y desechos de papel y cartón',4,1),
('46695','Venta al por mayor fertilizantes abonos agroquímicos y productos similares',4,1),
('46696','Venta al por mayor de productos intermedios y desechos de origen plástico',4,1),
('46697','Venta al por mayor de tintas para imprenta productos curtientes y materias y productos colorantes',4,1),
('46698','Venta de productos intermedios y desechos de origen químico y de caucho',4,1),
('46699','Venta al por mayor de productos intermedios y desechos ncp',4,1),
('46701','Venta de algodón en oro',4,1),
('46900','Venta al por mayor de otros productos',4,1),
('46901','Venta al por mayor de cohetes y otros productos pirotécnicos',4,1),
('46902','Venta al por mayor de artículos diversos para consumo humano',4,1),
('46903','Venta al por mayor de armas de fuego municiones y accesorios',4,1),
('46904','Venta al por mayor de toldos y tiendas de campaña de cualquier material',4,1),
('46905','Venta al por mayor de exhibidores publicitarios y rótulos',4,1),
('46906','Venta al por mayor de artículos promocionales diversos',4,1),
('47111','Venta en supermercados',4,1),
('47112','Venta en tiendas de artículos de primera necesidad',4,1),
('47119','Almacenes (venta de diversos artículos)',4,1),
('47190','Venta al por menor de otros productos en comercios no especializados',4,1),
('47199','Venta de establecimientos no especializados con surtido compuesto principalmente de alimentos bebidas y tabaco',4,1),
('47211','Venta al por menor de frutas y hortalizas',4,1),
('47212','Venta al por menor de carnes embutidos y productos de granja',4,1),
('47213','Venta al por menor de pescado y mariscos',4,1),
('47214','Venta al por menor de productos lácteos',4,1),
('47215','Venta al por menor de productos de panadería repostería y galletas',4,1),
('47216','Venta al por menor de huevos',4,1),
('47217','Venta al por menor de carnes y productos cárnicos',4,1),
('47218','Venta al por menor de granos básicos y otros',4,1),
('47219','Venta al por menor de alimentos n.c.p.',4,1),
('47221','Venta al por menor de hielo',4,1),
('47223','Venta de bebidas no alcohólicas para su consumo fuera del establecimiento',4,1),
('47224','Venta de bebidas alcohólicas para su consumo fuera del establecimiento',4,1),
('47225','Venta de bebidas alcohólicas para su consumo dentro del establecimiento',4,1),
('47230','Venta al por menor de tabaco',4,1),
('47300','Venta de combustibles lubricantes y otros (gasolineras)',4,1),
('47411','Venta al por menor de computadoras y equipo periférico',4,1),
('47412','Venta de equipo y accesorios de telecomunicación',4,1),
('47420','Venta al por menor de equipo de audio y video',4,1),
('47510','Venta al por menor de hilados tejidos y productos textiles de mercería; confecciones para el hogar y textiles n.c.p.',4,1),
('47521','Venta al por menor de productos de madera',4,1),
('47522','Venta al por menor de artículos de ferretería',4,1),
('47523','Venta al por menor de productos de pinturerías',4,1),
('47524','Venta al por menor en vidrierías',4,1),
('47529','Venta al por menor de materiales de construcción y artículos conexos',4,1),
('47530','Venta al por menor de tapices alfombras y revestimientos de paredes y pisos en comercios especializados',4,1),
('47591','Venta al por menor de muebles',4,1),
('47592','Venta al por menor de artículos de bazar',4,1),
('47593','Venta al por menor de aparatos electrodomésticos repuestos y accesorios',4,1),
('47594','Venta al por menor de artículos eléctricos y de iluminación',4,1),
('47598','Venta al por menor de instrumentos musicales',4,1),
('47610','Venta al por menor de libros periódicos y artículos de papelería en comercios especializados',4,1),
('47620','Venta al por menor de discos láser cassettes cintas de video y otros',4,1),
('47630','Venta al por menor de productos y equipos de deporte',4,1),
('47631','Venta al por menor de bicicletas accesorios y repuestos',4,1),
('47640','Venta al por menor de juegos y juguetes en comercios especializados',4,1),
('47711','Venta al por menor de prendas de vestir y accesorios de vestir',4,1),
('47712','Venta al por menor de calzado',4,1),
('47713','Venta al por menor de artículos de peletería marroquinería y talabartería',4,1),
('47721','Venta al por menor de medicamentos farmacéuticos y otros materiales y artículos de uso médico odontológico y veterinario',4,1),
('47722','Venta al por menor de productos cosméticos y de tocador',4,1),
('47731','Venta al por menor de productos de joyería bisutería óptica relojería',4,1),
('47732','Venta al por menor de plantas semillas animales y artículos conexos',4,1),
('47733','Venta al por menor de combustibles de uso doméstico (gas propano y gas licuado)',4,1),
('47734','Venta al por menor de artesanías artículos cerámicos y recuerdos en general',4,1),
('47735','Venta al por menor de ataúdes lápidas y cruces trofeos artículos religiosos en general',4,1),
('47736','Venta al por menor de armas de fuego municiones y accesorios',4,1),
('47737','Venta al por menor de artículos de cohetería y pirotécnicos',4,1),
('47738','Venta al por menor de artículos desechables de uso personal y doméstico',4,1),
('47739','Venta al por menor de otros productos n.c.p.',4,1),
('47741','Venta al por menor de artículos usados',4,1),
('47742','Venta al por menor de textiles y confecciones usados',4,1),
('47743','Venta al por menor de libros revistas papel y cartón usados',4,1),
('47749','Venta al por menor de productos usados n.c.p.',4,1),
('47811','Venta al por menor de frutas verduras y hortalizas',4,1),
('47814','Venta al por menor de productos lácteos (mercados)',4,1),
('47815','Venta al por menor de productos de panadería galletas y similares',4,1),
('47816','Venta al por menor de bebidas',4,1),
('47818','Venta al por menor en tiendas de mercado y puestos',4,1),
('47821','Venta al por menor de hilados tejidos y productos textiles de mercería en puestos de mercados y ferias',4,1),
('47822','Venta al por menor de artículos textiles excepto confecciones para el hogar en puestos de mercados y ferias',4,1),
('47823','Venta al por menor de confecciones textiles para el hogar en puestos de mercados y ferias',4,1),
('47824','Venta al por menor de prendas de vestir accesorios de vestir y similares en puestos de mercados y ferias',4,1),
('47825','Venta al por menor de ropa usada',4,1),
('47826','Venta al por menor de calzado artículos de marroquinería y talabartería en puestos de mercados y ferias',4,1),
('47827','Venta al por menor de artículos de marroquinería y talabartería en puestos de mercados y ferias',4,1),
('47829','Venta al por menor de artículos textiles ncp en puestos de mercados y ferias',4,1),
('47891','Venta al por menor de animales flores y productos conexos en puestos de feria y mercados',4,1),
('47892','Venta al por menor de productos medicinales cosméticos de tocador y de limpieza en puestos de ferias y mercados',4,1),
('47893','Venta al por menor de artículos de bazar en puestos de ferias y mercados',4,1),
('47894','Venta al por menor de artículos de papel envases libros revistas y conexos en puestos de feria y mercados',4,1),
('47895','Venta al por menor de materiales de construcción electrodomésticos accesorios para autos y similares en puestos de feria y mercados',4,1),
('47896','Venta al por menor de equipos accesorios para las comunicaciones en puestos de feria y mercados',4,1),
('47899','Venta al por menor en puestos de ferias y mercados n.c.p.',4,1),
('47910','Venta al por menor por correo o Internet',4,1),
('49110','Transporte interurbano de pasajeros por ferrocarril',4,1),
('49120','Transporte de carga por ferrocarril',4,1),
('49211','Transporte de pasajeros urbanos e interurbano mediante buses',4,1),
('49212','Transporte de pasajeros interdepartamental mediante microbuses',4,1),
('49213','Transporte de pasajeros urbanos e interurbano mediante microbuses',4,1),
('49214','Transporte de pasajeros interdepartamental mediante buses',4,1),
('49221','Transporte internacional de pasajeros',4,1),
('49222','Transporte de pasajeros mediante taxis y autos con chofer',4,1),
('49223','Transporte escolar',4,1),
('49225','Transporte de pasajeros para excursiones',4,1),
('49226','Servicios de transporte de personal',4,1),
('49229','Transporte de pasajeros por vía terrestre ncp',4,1),
('49231','Transporte de carga urbano',4,1),
('49232','Transporte nacional de carga',4,1),
('49233','Transporte de carga internacional',4,1),
('49234','Servicios de mudanza',4,1),
('49235','Alquiler de vehículos de carga con conductor',4,1),
('49300','Transporte por oleoducto o gasoducto',4,1),
('50110','Transporte de pasajeros marítimo y de cabotaje',4,1),
('50120','Transporte de carga marítimo y de cabotaje',4,1),
('50211','Transporte de pasajeros por vías de navegación interiores',4,1),
('50212','Alquiler de equipo de transporte de pasajeros por vías de navegación interior con conductor',4,1),
('50220','Transporte de carga por vías de navegación interiores',4,1),
('51100','Transporte aéreo de pasajeros',4,1),
('51201','Transporte de carga por vía aérea',4,1),
('51202','Alquiler de equipo de aerotransporte con operadores para el propósito de transportar carga',4,1),
('52101','Alquiler de instalaciones de almacenamiento en zonas francas',4,1),
('52102','Alquiler de silos para conservación y almacenamiento de granos',4,1),
('52103','Alquiler de instalaciones con refrigeración para almacenamiento y conservación de alimentos y otros productos',4,1),
('52109','Alquiler de bodegas para almacenamiento y depósito n.c.p.',4,1),
('52211','Servicio de garaje y estacionamiento',4,1),
('52212','Servicios de terminales para el transporte por vía terrestre',4,1),
('52219','Servicios para el transporte por vía terrestre n.c.p.',4,1),
('52220','Servicios para el transporte acuático',4,1),
('52230','Servicios para el transporte aéreo',4,1),
('52240','Manipulación de carga',4,1),
('52290','Servicios para el transporte ncp',4,1),
('52291','Agencias de tramitaciones aduanales',4,1),
('53100','Servicios de correo nacional',4,1),
('53200','Actividades de correo distintas a las actividades postales nacionales',4,1),
('53201','Agencia privada de correo y encomiendas',4,1),
('55101','Actividades de alojamiento para estancias cortas',4,1),
('55102','Hoteles',4,1),
('55200','Actividades de campamentos parques de vehículos de recreo y parques de caravanas',4,1),
('55900','Alojamiento n.c.p.',4,1),
('56101','Restaurantes',4,1),
('56106','Pupusería',4,1),
('56107','Actividades varias de restaurantes',4,1),
('56108','Comedores',4,1),
('56109','Merenderos ambulantes',4,1),
('56210','Preparación de comida para eventos especiales',4,1),
('56291','Servicios de provisión de comidas por contrato',4,1),
('56292','Servicios de concesión de cafetines y chalet en empresas',4,1),
('56299','Servicios de preparación de comidas ncp',4,1),
('56301','Servicio de expendio de bebidas en salones y bares',4,1),
('56302','Servicio de expendio de bebidas en puestos callejeros mercados y ferias',4,1),
('58110','Edición de libros folletos partituras y otras ediciones distintas a estas',4,1),
('58120','Edición de directorios y listas de correos',4,1),
('58130','Edición de periódicos revistas y otras publicaciones periódicas',4,1),
('58190','Otras actividades de edición',4,1),
('58200','Edición de programas informáticos (software)',4,1),
('59110','Actividades de producción cinematográfica',4,1),
('59120','Actividades de post producción de películas videos y programas de televisión',4,1),
('59130','Actividades de distribución de películas cinematográficas videos y programas de televisión',4,1),
('59140','Actividades de exhibición de películas cinematográficas y cintas de video',4,1),
('59200','Actividades de edición y grabación de música',4,1),
('60100','Servicios de difusiones de radio',4,1),
('60201','Actividades de programación y difusión de televisión abierta',4,1),
('60202','Actividades de suscripción y difusión de televisión por cable y/o suscripción',4,1),
('60299','Servicios de televisión incluye televisión por cable',4,1),
('60900','Programación y transmisión de radio y televisión',4,1),
('61101','Servicio de telefonía',4,1),
('61102','Servicio de Internet',4,1),
('61103','Servicio de telefonía fija',4,1),
('61109','Servicio de Internet n.c.p.',4,1),
('61201','Servicios de telefonía celular',4,1),
('61202','Servicios de Internet inalámbrico',4,1),
('61209','Servicios de telecomunicaciones inalámbrico n.c.p.',4,1),
('61301','Telecomunicaciones satelitales',4,1),
('61309','Comunicación vía satélite n.c.p.',4,1),
('61900','Actividades de telecomunicación n.c.p.',4,1),
('62010','Programación Informática',4,1),
('62020','Consultorías y gestión de servicios informáticos',4,1),
('62090','Otras actividades de tecnología de información y servicios de computadora',4,1),
('63110','Procesamiento de datos y actividades relacionadas',4,1),
('63120','Portales WEB',4,1),
('63910','Servicios de Agencias de Noticias',4,1),
('63990','Otros servicios de información n.c.p.',4,1),
('64110','Servicios provistos por el Banco Central de El salvador',4,1),
('64190','Bancos',4,1),
('64192','Entidades dedicadas al envío de remesas',4,1),
('64199','Otras entidades financieras',4,1),
('64200','Actividades de sociedades de cartera',4,1),
('64300','Fideicomisos fondos y otras fuentes de financiamiento',4,1),
('64910','Arrendamientos financieros',4,1),
('64920','Asociaciones cooperativas de ahorro y crédito dedicadas a la intermediación financiera',4,1),
('64921','Instituciones emisoras de tarjetas de crédito y otros',4,1),
('64922','Tipos de crédito ncp',4,1),
('64928','Prestamistas y casas de empeño',4,1),
('64990','Actividades de servicios financieros excepto la financiación de planes de seguros y de pensiones n.c.p.',4,1),
('65110','Planes de seguros de vida',4,1),
('65120','Planes de seguro excepto de vida',4,1),
('65199','Seguros generales de todo tipo',4,1),
('65200','Planes se seguro',4,1),
('65300','Planes de pensiones',4,1),
('66110','Administración de mercados financieros (Bolsa de Valores)',4,1),
('66120','Actividades bursátiles (Corredores de Bolsa)',4,1),
('66190','Actividades auxiliares de la intermediación financiera ncp',4,1),
('66210','Evaluación de riesgos y daños',4,1),
('66220','Actividades de agentes y corredores de seguros',4,1),
('66290','Otras actividades auxiliares de seguros y fondos de pensiones',4,1),
('66300','Actividades de administración de fondos',4,1),
('68101','Servicio de alquiler y venta de lotes en cementerios',4,1),
('68109','Actividades inmobiliarias realizadas con bienes propios o arrendados n.c.p.',4,1),
('68200','Actividades Inmobiliarias Realizadas a Cambio de una Retribución o por Contrata',4,1),
('69100','Actividades jurídicas',4,1),
('69200','Actividades de contabilidad teneduría de libros y auditoría; asesoramiento en materia de impuestos',4,1),
('70100','Actividades de oficinas centrales de sociedades de cartera',4,1),
('70200','Actividades de consultoría en gestión empresarial',4,1),
('71101','Servicios de arquitectura y planificación urbana y servicios conexos',4,1),
('71102','Servicios de ingeniería',4,1),
('71103','Servicios de agrimensura topografía cartografía prospección y geofísica y servicios conexos',4,1),
('71200','Ensayos y análisis técnicos',4,1),
('72100','Investigaciones y desarrollo experimental en el campo de las ciencias naturales y la ingeniería',4,1),
('72199','Investigaciones científicas',4,1),
('72200','Investigaciones y desarrollo experimental en el campo de las ciencias sociales y las humanidades',4,1),
('73100','Publicidad',4,1),
('73200','Investigación de mercados y realización de encuestas de opinión pública',4,1),
('74100','Actividades de diseño especializado',4,1),
('74200','Actividades de fotografía',4,1),
('74900','Servicios profesionales y científicos ncp',4,1),
('75000','Actividades veterinarias',4,1),
('77101','Alquiler de equipo de transporte terrestre',4,1),
('77102','Alquiler de equipo de transporte acuático',4,1),
('77103','Alquiler de equipo de transporte por vía aérea',4,1),
('77210','Alquiler y arrendamiento de equipo de recreo y deportivo',4,1),
('77220','Alquiler de cintas de video y discos',4,1),
('77290','Alquiler de otros efectos personales y enseres domésticos',4,1),
('77300','Alquiler de maquinaria y equipo',4,1),
('77400','Arrendamiento de productos de propiedad intelectual',4,1),
('78100','Obtención y dotación de personal',4,1),
('78200','Actividades de las agencias de trabajo temporal',4,1),
('78300','Dotación de recursos humanos y gestión; gestión de las funciones de recursos humanos',4,1),
('79110','Actividades de agencias de viajes y organizadores de viajes; actividades de asistencia a turistas',4,1),
('79120','Actividades de los operadores turísticos',4,1),
('79900','Otros servicios de reservas y actividades relacionadas',4,1),
('80100','Servicios de seguridad privados',4,1),
('80201','Actividades de servicios de sistemas de seguridad',4,1),
('80202','Actividades para la prestación de sistemas de seguridad',4,1),
('80300','Actividades de investigación',4,1),
('81100','Actividades combinadas de mantenimiento de edificios e instalaciones',4,1),
('81210','Limpieza general de edificios',4,1),
('81290','Otras actividades combinadas de mantenimiento de edificios e instalaciones ncp',4,1),
('81300','Servicio de jardinería',4,1),
('82110','Servicios administrativos de oficinas',4,1),
('82190','Servicio de fotocopiado y similares excepto en imprentas',4,1),
('82200','Actividades de las centrales de llamadas (call center)',4,1),
('82300','Organización de convenciones y ferias de negocios',4,1),
('82910','Actividades de agencias de cobro y oficinas de crédito',4,1),
('82921','Servicios de envase y empaque de productos alimenticios',4,1),
('82922','Servicios de envase y empaque de productos medicinales',4,1),
('82929','Servicio de envase y empaque ncp',4,1),
('82990','Actividades de apoyo empresariales ncp',4,1),
('84110','Actividades de la Administración Pública en general',4,1),
('84111','Alcaldías Municipales',4,1),
('84120','Regulación de las actividades de prestación de servicios sanitarios educativos culturales y otros servicios sociales excepto seguridad social',4,1),
('84130','Regulación y facilitación de la actividad económica',4,1),
('84210','Actividades de administración y funcionamiento del Ministerio de Relaciones Exteriores',4,1),
('84220','Actividades de defensa',4,1),
('84230','Actividades de mantenimiento del orden público y de seguridad',4,1),
('84300','Actividades de planes de seguridad social de afiliación obligatoria',4,1),
('85101','Guardería educativa',4,1),
('85102','Enseñanza preescolar o parvularia',4,1),
('85103','Enseñanza primaria',4,1),
('85104','Servicio de educación preescolar y primaria integrada',4,1),
('85211','Enseñanza secundaria tercer ciclo (7°. 8° y 9°)',4,1),
('85212','Enseñanza secundaria de formación general bachillerato',4,1),
('85221','Enseñanza secundaria de formación técnica y profesional',4,1),
('85222','Enseñanza secundaria de formación técnica y profesional integrada con enseñanza primaria',4,1),
('85301','Enseñanza superior universitaria',4,1),
('85302','Enseñanza superior no universitaria',4,1),
('85303','Enseñanza superior integrada a educación secundaria y/o primaria',4,1),
('85410','Educación deportiva y recreativa',4,1),
('85420','Educación cultural',4,1),
('85490','Otros tipos de enseñanza n.c.p.',4,1),
('85499','Enseñanza formal',4,1),
('85500','Servicios de apoyo a la enseñanza',4,1),
('86100','Actividades de hospitales',4,1),
('86201','Clínicas médicas',4,1),
('86202','Servicios de Odontología',4,1),
('86203','Servicios médicos',4,1),
('86901','Servicios de análisis y estudios de diagnóstico',4,1),
('86902','Actividades de atención de la salud humana',4,1),
('86909','Otros Servicio relacionados con la salud ncp',4,1),
('87100','Residencias de ancianos con atención de enfermería',4,1),
('87200','Instituciones dedicadas al tratamiento del retraso mental problemas de salud mental y el uso indebido de sustancias nocivas',4,1),
('87300','Instituciones dedicadas al cuidado de ancianos y discapacitados',4,1),
('87900','Actividades de asistencia a niños y jóvenes',4,1),
('87901','Otras actividades de atención en instituciones',4,1),
('88100','Actividades de asistencia sociales sin alojamiento para ancianos y discapacitados',4,1),
('88900','Servicios sociales sin alojamiento ncp',4,1),
('90000','Actividades creativas artísticas y de esparcimiento',4,1),
('91010','Actividades de bibliotecas y archivos',4,1),
('91020','Actividades de museos y preservación de lugares y edificios históricos',4,1),
('91030','Actividades de jardines botánicos zoológicos y de reservas naturales',4,1),
('92000','Actividades de juegos y apuestas',4,1),
('93110','Gestión de instalaciones deportivas',4,1),
('93120','Actividades de clubes deportivos',4,1),
('93190','Otras actividades deportivas',4,1),
('93210','Actividades de parques de atracciones y parques temáticos',4,1),
('93291','Discotecas y salas de baile',4,1),
('93298','Centros vacacionales',4,1),
('93299','Actividades de esparcimiento ncp',4,1),
('94110','Actividades de organizaciones empresariales y de empleadores',4,1),
('94120','Actividades de organizaciones profesionales',4,1),
('94200','Actividades de sindicatos',4,1),
('94910','Actividades de organizaciones religiosas',4,1),
('94920','Actividades de organizaciones políticas',4,1),
('94990','Actividades de asociaciones n.c.p.',4,1),
('95110','Reparación de computadoras y equipo periférico',4,1),
('95120','Reparación de equipo de comunicación',4,1),
('95210','Reparación de aparatos electrónicos de consumo',4,1),
('95220','Reparación de aparatos doméstico y equipo de hogar y jardín',4,1),
('95230','Reparación de calzado y artículos de cuero',4,1),
('95240','Reparación de muebles y accesorios para el hogar',4,1),
('95291','Reparación de Instrumentos musicales',4,1),
('95292','Servicios de cerrajería y copiado de llaves',4,1),
('95293','Reparación de joyas y relojes',4,1),
('95294','Reparación de bicicletas sillas de ruedas y rodados n.c.p.',4,1),
('95299','Reparaciones de enseres personales n.c.p.',4,1),
('96010','Lavado y limpieza de prendas de tela y de piel incluso la limpieza en seco',4,1),
('96020','Peluquería y otros tratamientos de belleza',4,1),
('96030','Pompas fúnebres y actividades conexas',4,1),
('96091','Servicios de sauna y otros servicios para la estética corporal n.c.p.',4,1),
('96092','Servicios n.c.p.',4,1),
('97000','Actividad de los hogares en calidad de empleadores de personal doméstico',4,1),
('98100','Actividades indiferenciadas de producción de bienes de los hogares privados para uso propio',4,1),
('98200','Actividades indiferenciadas de producción de servicios de los hogares privados para uso propio',4,1),
('99000','Actividades de organizaciones y órganos extraterritoriales',4,1),
-- Empleados y otras personas naturales
('10001','Empleados',4,1),
('10002','Pensionado',4,1),
('10003','Estudiante',4,1),
('10004','Desempleado',4,1),
('10005','Otros',4,1),
('10006','Comerciante',4,1);

COMMIT;
START TRANSACTION;

-- =====================================================================
-- TABLA: catalogo_relaciones (ANEXO_1 - Tabla de Conversiones)
-- Factor de conversión entre unidades de medida (CAT-014)
-- =====================================================================

INSERT INTO catalogo_relaciones (tipo_relacion, codigo_origen, codigo_destino, factor_conversion, descripcion_relacion) VALUES
('CONVERSION_UNIDAD','2','1',0.91440000,'1 yarda = 0.9144 metros (1 yd = 91.4 cm)'),
('CONVERSION_UNIDAD','10','13',10000.00000000,'1 hectárea = 10000 m²'),
('CONVERSION_UNIDAD','18','23',1000.00000000,'1 metro cúbico = 1000 litros'),
('CONVERSION_UNIDAD','20','22',42.00000000,'1 barril = 42 galones (USA)'),
('CONVERSION_UNIDAD','22','23',3.78541200,'1 galón USA = 3.785412 litros'),
('CONVERSION_UNIDAD','24','26',750.00000000,'1 botella = 750 mililitros'),
('CONVERSION_UNIDAD','23','26',1000.00000000,'1 litro = 1000 mililitros'),
('CONVERSION_UNIDAD','30','34',1000.00000000,'1 tonelada = 1000 kilogramos'),
('CONVERSION_UNIDAD','32','34',45.35924000,'1 quintal (100 lb) = 45.35924 kg'),
('CONVERSION_UNIDAD','33','34',11.33981000,'1 arroba (25 lb) = 11.33981 kg'),
('CONVERSION_UNIDAD','34','36',2.20462248,'1 kilogramo = 2.204622476 libras'),
('CONVERSION_UNIDAD','36','39',453.59240000,'1 libra = 453.5924 gramos'),
('CONVERSION_UNIDAD','37','39',31.10344800,'1 onza troy = 31.103448 gramos'),
('CONVERSION_UNIDAD','38','39',28.34952000,'1 onza = 28.34952 gramos'),
('CONVERSION_UNIDAD','34','39',1000.00000000,'1 kilogramo = 1000 gramos'),
('CONVERSION_UNIDAD','39','40',1000.00000000,'1 gramo = 1000 miligramos'),
('CONVERSION_UNIDAD','55','59',1000.00000000,'1 millar = 1000 unidades'),
('CONVERSION_UNIDAD','56','59',500.00000000,'1 medio millar = 500 unidades'),
('CONVERSION_UNIDAD','57','59',100.00000000,'1 ciento = 100 unidades'),
('CONVERSION_UNIDAD','58','59',12.00000000,'1 docena = 12 unidades');

COMMIT;
START TRANSACTION;

-- =====================================================================
-- TABLA: catalogo_referencia (metadatos de los 32 catálogos del MH)
-- =====================================================================

INSERT INTO catalogo_referencia
    (tipo_catalogo, nombre_original, descripcion_catalogo, tabla_consolidada, version_mh, fecha_version, observaciones)
VALUES
('CAT001','Ambiente de destino','Ambiente de destino de los documentos (prueba o producción)','catalogo_maestro','1.1','2024-08-01',NULL),
('CAT002','Tipo de Documento','Tipos de documentos tributarios electrónicos','catalogo_maestro','1.1','2024-08-01',NULL),
('CAT003','Modelo de Facturación','Modelos de facturación (previo o diferido)','catalogo_maestro','1.1','2024-08-01',NULL),
('CAT004','Tipo de Transmisión','Tipos de transmisión (normal o por contingencia)','catalogo_maestro','1.1','2024-08-01',NULL),
('CAT005','Tipo de Contingencia','Tipos de contingencia en la transmisión','catalogo_maestro','1.1','2024-08-01',NULL),
('CAT006','Retención IVA MH','Retenciones de IVA por el Ministerio de Hacienda','catalogo_maestro+catalogo_valores_numericos','1.1','2024-08-01','Incluye porcentajes en valores numéricos'),
('CAT007','Tipo de Generación del Documento','Tipo de generación del documento (físico o electrónico)','catalogo_maestro','1.1','2024-08-01',NULL),
('CAT008','Catálogo eliminado','Catálogo eliminado por el MH','catalogo_maestro','1.1','2024-08-01','Catálogo descontinuado'),
('CAT009','Tipo de establecimiento','Tipo de establecimiento (sucursal, casa matriz, etc.)','catalogo_maestro','1.1','2024-08-01',NULL),
('CAT010','Código tipo de Servicio Médico','Tipos de servicio médico para facturación','catalogo_maestro','1.1','2024-08-01','Aplica para F-958'),
('CAT011','Tipo de ítem','Clasificación de ítems (bienes, servicios, ambos, etc.)','catalogo_maestro','1.1','2024-08-01',NULL),
('CAT012','Departamento','Departamentos de El Salvador','catalogo_ubicacion','1.1','2024-08-01','Estructura jerárquica con CAT013'),
('CAT013','Municipio','Municipios consolidados de El Salvador','catalogo_ubicacion','1.1','2024-08-01','Códigos no únicos globalmente; deben combinarse con departamento'),
('CAT014','Unidad de Medida','Unidades de medida para productos y servicios','catalogo_especial+catalogo_unidades','1.1','2024-08-01','Incluye símbolos y conversiones'),
('CAT015','Tributos','Tributos aplicables a documentos tributarios','catalogo_especial+catalogo_tributos','1.1','2024-08-01','Incluye porcentajes y tipos'),
('CAT016','Condición de la Operación','Condición de operación (contado, crédito, otro)','catalogo_maestro','1.1','2024-08-01',NULL),
('CAT017','Forma de Pago','Formas de pago aceptadas','catalogo_maestro','1.1','2024-08-01',NULL),
('CAT018','Plazo','Unidades de plazo (días, meses, años)','catalogo_maestro+catalogo_valores_numericos','1.1','2024-08-01','Incluye factor de conversión a días'),
('CAT019','Código de Actividad Económica','Códigos CIIU jerárquicos','catalogo_actividad_economica','1.1','2024-08-01','Estructura jerárquica de 4 niveles; cargados como hojas nivel 4'),
('CAT020','País','Países según ISO 3166-1','catalogo_especial+catalogo_paises','1.1','2024-08-01','Incluye códigos ISO3 y numéricos'),
('CAT021','Otros Documentos Asociados','Documentos asociados al DTE','catalogo_maestro','1.1','2024-08-01',NULL),
('CAT022','Tipo de documento de identificación del Receptor','Tipo de identificación del receptor (NIT, DUI, etc.)','catalogo_maestro','1.1','2024-08-01',NULL),
('CAT023','Tipo de Documento en Contingencia','Tipos de documento en contingencia','catalogo_maestro','1.1','2024-08-01',NULL),
('CAT024','Tipo de Invalidación','Motivos de invalidación de DTE','catalogo_maestro','1.1','2024-08-01',NULL),
('CAT025','Título a que se remiten los bienes','Título por el cual se remiten los bienes','catalogo_maestro','1.1','2024-08-01',NULL),
('CAT026','Tipo de Donación','Tipos de donación (efectivo, bien, servicio)','catalogo_maestro','1.1','2024-08-01',NULL),
('CAT027','Recinto fiscal','Recintos fiscales (aduanas, zonas francas, etc.)','catalogo_maestro','1.1','2024-08-01',NULL),
('CAT028','Régimen','Régimen tributario para exportaciones','catalogo_especial+catalogo_regimen','1.1','2024-08-01','Incluye tipo de régimen'),
('CAT029','Tipo de persona','Tipo de persona (natural o jurídica)','catalogo_maestro','1.1','2024-08-01',NULL),
('CAT030','Transporte','Modos de transporte','catalogo_maestro','1.1','2024-08-01',NULL),
('CAT031','INCOTERMS','Términos internacionales de comercio','catalogo_maestro','1.1','2024-08-01',NULL),
('CAT032','Domicilio Fiscal','Domicilio fiscal (domiciliado o no domiciliado)','catalogo_maestro','1.1','2024-08-01',NULL);

-- =====================================================================
-- FINALIZACIÓN
-- =====================================================================

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
SET UNIQUE_CHECKS = 1;
SET AUTOCOMMIT = 1;

-- =====================================================================
-- VERIFICACIÓN DE INSERCIONES
-- =====================================================================
SELECT 'catalogo_maestro' AS tabla, COUNT(*) AS registros FROM catalogo_maestro
UNION ALL SELECT 'catalogo_valores_numericos', COUNT(*) FROM catalogo_valores_numericos
UNION ALL SELECT 'catalogo_ubicacion', COUNT(*) FROM catalogo_ubicacion
UNION ALL SELECT 'catalogo_actividad_economica', COUNT(*) FROM catalogo_actividad_economica
UNION ALL SELECT 'catalogo_especial', COUNT(*) FROM catalogo_especial
UNION ALL SELECT 'catalogo_unidades', COUNT(*) FROM catalogo_unidades
UNION ALL SELECT 'catalogo_tributos', COUNT(*) FROM catalogo_tributos
UNION ALL SELECT 'catalogo_paises', COUNT(*) FROM catalogo_paises
UNION ALL SELECT 'catalogo_regimen', COUNT(*) FROM catalogo_regimen
UNION ALL SELECT 'catalogo_relaciones', COUNT(*) FROM catalogo_relaciones
UNION ALL SELECT 'catalogo_referencia', COUNT(*) FROM catalogo_referencia;

-- =====================================================================
-- FIN DEL SCRIPT DE SEEDERS
-- =====================================================================
