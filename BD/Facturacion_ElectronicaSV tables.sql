-- =====================================================================
-- ESQUEMA DE BASE DE DATOS - CATÁLOGOS MINISTERIO DE HACIENDA
-- Sistema de Facturación Electrónica - El Salvador
-- Generado a partir de: diccionario_datos.md
-- Versión MH: 1.1 (08/2024)
-- =====================================================================

-- ---------------------------------------------------------------------
-- Configuración de base de datos
-- ---------------------------------------------------------------------

USE sistema_negocio;

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';

-- ---------------------------------------------------------------------
-- Limpieza previa (orden inverso por dependencias FK)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS catalogo_referencia;
DROP TABLE IF EXISTS catalogo_relaciones;
DROP TABLE IF EXISTS catalogo_regimen;
DROP TABLE IF EXISTS catalogo_paises;
DROP TABLE IF EXISTS catalogo_tributos;
DROP TABLE IF EXISTS catalogo_unidades;
DROP TABLE IF EXISTS catalogo_especial;
DROP TABLE IF EXISTS catalogo_actividad_economica;
DROP TABLE IF EXISTS catalogo_ubicacion;
DROP TABLE IF EXISTS catalogo_valores_numericos;
DROP TABLE IF EXISTS catalogo_maestro;

-- =====================================================================
-- 1. TABLA: catalogo_maestro
-- Propósito: Almacena todos los catálogos simples del Ministerio de Hacienda
-- Tipo: Tabla central consolidada
-- =====================================================================
CREATE TABLE catalogo_maestro (
    id                  INT             NOT NULL AUTO_INCREMENT,
    tipo_catalogo       VARCHAR(10)     NOT NULL COMMENT 'Código del tipo de catálogo (CAT001, CAT002, etc.)',
    codigo              VARCHAR(10)     NOT NULL COMMENT 'Código del elemento dentro del catálogo',
    descripcion         VARCHAR(500)    NOT NULL COMMENT 'Descripción detallada del elemento',
    activo              TINYINT(1)      NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
    fecha_creacion      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_catalogo_maestro_tipo_codigo (tipo_catalogo, codigo),
    INDEX idx_catalogo_maestro_tipo (tipo_catalogo),
    INDEX idx_catalogo_maestro_codigo (codigo),
    INDEX idx_catalogo_maestro_activo (activo),
    INDEX idx_catalogo_maestro_descripcion (descripcion(100))
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Catálogos simples del MH (tabla central consolidada)';

-- =====================================================================
-- 2. TABLA: catalogo_valores_numericos
-- Propósito: Extiende catalogo_maestro con valores numéricos específicos
-- Tipo: Tabla de extensión (1:1)
-- =====================================================================
CREATE TABLE catalogo_valores_numericos (
    id                      INT                 NOT NULL AUTO_INCREMENT,
    catalogo_maestro_id     INT                 NOT NULL,
    valor_numerico          DECIMAL(10,4)       NOT NULL COMMENT 'Valor numérico asociado al catálogo',
    tipo_valor              ENUM('PORCENTAJE','DIAS','FACTOR','CANTIDAD') NOT NULL,
    fecha_creacion          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_valores_numericos_maestro (catalogo_maestro_id),
    INDEX idx_valores_numericos_tipo (tipo_valor),
    CONSTRAINT fk_valores_numericos_maestro
        FOREIGN KEY (catalogo_maestro_id) REFERENCES catalogo_maestro(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Extensión 1:1 de catalogo_maestro con valores numéricos';

-- =====================================================================
-- 3. TABLA: catalogo_ubicacion
-- Propósito: Estructura jerárquica de departamentos y municipios
-- Tipo: Tabla jerárquica auto-referenciada
-- =====================================================================
CREATE TABLE catalogo_ubicacion (
    id                      INT             NOT NULL AUTO_INCREMENT,
    codigo                  VARCHAR(10)     NOT NULL COMMENT 'Código único de ubicación',
    nombre                  VARCHAR(255)    NOT NULL COMMENT 'Nombre de la ubicación',
    tipo                    ENUM('DEPARTAMENTO','MUNICIPIO') NOT NULL,
    ubicacion_padre_id      INT             NULL COMMENT 'ID del departamento padre (para municipios)',
    activo                  TINYINT(1)      NOT NULL DEFAULT 1,
    fecha_creacion          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    -- NOTA: los códigos de municipios se repiten entre departamentos según CAT-013 del MH;
    -- por eso el UK incluye ubicacion_padre_id para hacerlos únicos dentro del padre.
    UNIQUE KEY uk_ubicacion_codigo_tipo_padre (codigo, tipo, ubicacion_padre_id),
    INDEX idx_ubicacion_tipo (tipo),
    INDEX idx_ubicacion_padre (ubicacion_padre_id),
    INDEX idx_ubicacion_activo (activo),
    CONSTRAINT fk_ubicacion_padre
        FOREIGN KEY (ubicacion_padre_id) REFERENCES catalogo_ubicacion(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Jerarquía departamentos/municipios (CAT012, CAT013)';

-- =====================================================================
-- 4. TABLA: catalogo_actividad_economica
-- Propósito: Códigos CIIU en estructura jerárquica de 4 niveles
-- Tipo: Tabla jerárquica auto-referenciada
-- =====================================================================
CREATE TABLE catalogo_actividad_economica (
    id                      INT             NOT NULL AUTO_INCREMENT,
    codigo                  VARCHAR(10)     NOT NULL COMMENT 'Código CIIU único',
    descripcion             VARCHAR(500)    NOT NULL COMMENT 'Descripción de la actividad económica',
    nivel                   TINYINT         NOT NULL COMMENT 'Nivel jerárquico (1-4)',
    actividad_padre_id      INT             NULL COMMENT 'ID de la actividad padre',
    es_hoja                 TINYINT(1)      NOT NULL DEFAULT 0 COMMENT '1=nodo terminal, 0=rama',
    activo                  TINYINT(1)      NOT NULL DEFAULT 1,
    fecha_creacion          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_actividad_codigo (codigo),
    INDEX idx_actividad_nivel (nivel),
    INDEX idx_actividad_padre (actividad_padre_id),
    INDEX idx_actividad_es_hoja (es_hoja),
    INDEX idx_actividad_activo (activo),
    CONSTRAINT fk_actividad_padre
        FOREIGN KEY (actividad_padre_id) REFERENCES catalogo_actividad_economica(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT chk_actividad_nivel CHECK (nivel BETWEEN 1 AND 4)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Actividades económicas CIIU jerárquicas (CAT019)';

-- =====================================================================
-- 5. TABLA: catalogo_especial
-- Propósito: Base para catálogos con estructuras especiales
-- Tipo: Tabla base especializada (CAT014, CAT015, CAT020, CAT028)
-- =====================================================================
CREATE TABLE catalogo_especial (
    id                  INT             NOT NULL AUTO_INCREMENT,
    codigo              VARCHAR(50)     NOT NULL COMMENT 'Código único del elemento',
    descripcion         VARCHAR(500)    NOT NULL COMMENT 'Descripción del elemento',
    tipo_catalogo       ENUM('CAT014','CAT015','CAT020','CAT028') NOT NULL,
    activo              TINYINT(1)      NOT NULL DEFAULT 1,
    fecha_creacion      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_especial_codigo_tipo (codigo, tipo_catalogo),
    INDEX idx_especial_tipo (tipo_catalogo),
    INDEX idx_especial_activo (activo)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Base para catálogos especiales (CAT014, CAT015, CAT020, CAT028)';

-- =====================================================================
-- 6. TABLA: catalogo_unidades
-- Propósito: Extiende catalogo_especial con símbolos de unidades de medida
-- Tipo: Tabla de extensión especializada (1:1) - CAT014
-- =====================================================================
CREATE TABLE catalogo_unidades (
    id                      INT             NOT NULL AUTO_INCREMENT,
    catalogo_especial_id    INT             NOT NULL,
    simbolo                 VARCHAR(10)     NOT NULL COMMENT 'Símbolo de la unidad (kg, m, L, etc.)',
    fecha_creacion          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_unidades_especial (catalogo_especial_id),
    UNIQUE KEY uk_unidades_simbolo (simbolo),
    CONSTRAINT fk_unidades_especial
        FOREIGN KEY (catalogo_especial_id) REFERENCES catalogo_especial(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Unidades de medida con símbolo (CAT014)';

-- =====================================================================
-- 7. TABLA: catalogo_tributos
-- Propósito: Extiende catalogo_especial con información de tributos
-- Tipo: Tabla de extensión especializada (1:1) - CAT015
-- =====================================================================
CREATE TABLE catalogo_tributos (
    id                      INT             NOT NULL AUTO_INCREMENT,
    catalogo_especial_id    INT             NOT NULL,
    tipo_tributo            ENUM('IVA','RENTA','ESPECIFICO','OTRO') NOT NULL,
    porcentaje              DECIMAL(7,4)    NULL COMMENT 'Porcentaje del tributo (cuando aplica)',
    es_retencion            TINYINT(1)      NOT NULL DEFAULT 0,
    es_percepcion           TINYINT(1)      NOT NULL DEFAULT 0,
    fecha_creacion          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_tributos_especial (catalogo_especial_id),
    INDEX idx_tributos_tipo (tipo_tributo),
    INDEX idx_tributos_retencion (es_retencion),
    INDEX idx_tributos_percepcion (es_percepcion),
    CONSTRAINT fk_tributos_especial
        FOREIGN KEY (catalogo_especial_id) REFERENCES catalogo_especial(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Tributos con porcentajes y tipos (CAT015)';

-- =====================================================================
-- 8. TABLA: catalogo_paises
-- Propósito: Extiende catalogo_especial con códigos ISO de países
-- Tipo: Tabla de extensión especializada (1:1) - CAT020
-- =====================================================================
CREATE TABLE catalogo_paises (
    id                      INT             NOT NULL AUTO_INCREMENT,
    catalogo_especial_id    INT             NOT NULL,
    codigo_iso3             CHAR(3)         NOT NULL COMMENT 'Código ISO 3166-1 alpha-3',
    codigo_numerico         CHAR(3)         NOT NULL COMMENT 'Código ISO 3166-1 numérico',
    fecha_creacion          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_paises_especial (catalogo_especial_id),
    UNIQUE KEY uk_paises_iso3 (codigo_iso3),
    UNIQUE KEY uk_paises_numerico (codigo_numerico),
    CONSTRAINT fk_paises_especial
        FOREIGN KEY (catalogo_especial_id) REFERENCES catalogo_especial(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Países con códigos ISO 3166-1 (CAT020)';

-- =====================================================================
-- 9. TABLA: catalogo_regimen
-- Propósito: Extiende catalogo_especial con tipos de régimen tributario
-- Tipo: Tabla de extensión especializada (1:1) - CAT028
-- =====================================================================
CREATE TABLE catalogo_regimen (
    id                      INT             NOT NULL AUTO_INCREMENT,
    catalogo_especial_id    INT             NOT NULL,
    tipo_regimen            ENUM('GENERAL','SIMPLIFICADO','ESPECIAL','EXENTO') NOT NULL,
    fecha_creacion          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_regimen_especial (catalogo_especial_id),
    INDEX idx_regimen_tipo (tipo_regimen),
    CONSTRAINT fk_regimen_especial
        FOREIGN KEY (catalogo_especial_id) REFERENCES catalogo_especial(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Régimen tributario (CAT028)';

-- =====================================================================
-- 10. TABLA: catalogo_relaciones
-- Propósito: Gestiona relaciones y conversiones entre catálogos
-- Tipo: Tabla de relaciones independiente
-- =====================================================================
CREATE TABLE catalogo_relaciones (
    id                      INT             NOT NULL AUTO_INCREMENT,
    tipo_relacion           ENUM('CONVERSION_UNIDAD','EQUIVALENCIA','DEPENDENCIA')
                                            NOT NULL DEFAULT 'CONVERSION_UNIDAD',
    codigo_origen           VARCHAR(10)     NOT NULL COMMENT 'Código del elemento origen',
    codigo_destino          VARCHAR(10)     NOT NULL COMMENT 'Código del elemento destino',
    factor_conversion       DECIMAL(15,8)   NULL COMMENT 'Factor de conversión numérico',
    descripcion_relacion    VARCHAR(255)    NULL COMMENT 'Descripción de la relación',
    activo                  TINYINT(1)      NOT NULL DEFAULT 1,
    fecha_creacion          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_relaciones_origen_destino_tipo (codigo_origen, codigo_destino, tipo_relacion),
    INDEX idx_relaciones_tipo (tipo_relacion),
    INDEX idx_relaciones_origen (codigo_origen),
    INDEX idx_relaciones_destino (codigo_destino),
    INDEX idx_relaciones_activo (activo)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Relaciones y conversiones entre elementos de catálogos';

-- =====================================================================
-- 11. TABLA: catalogo_referencia
-- Propósito: Metadatos y mapeo de catálogos originales del MH
-- Tipo: Tabla de metadatos independiente
-- =====================================================================
CREATE TABLE catalogo_referencia (
    id                      INT             NOT NULL AUTO_INCREMENT,
    tipo_catalogo           VARCHAR(10)     NOT NULL COMMENT 'Tipo de catálogo (CAT001, CAT002, etc.)',
    nombre_original         VARCHAR(255)    NOT NULL COMMENT 'Nombre original del catálogo del MH',
    descripcion_catalogo    TEXT            NULL COMMENT 'Descripción del propósito del catálogo',
    tabla_consolidada       VARCHAR(50)     NOT NULL COMMENT 'Tabla donde se almacenan los datos',
    version_mh              VARCHAR(10)     NOT NULL DEFAULT '1.1',
    fecha_version           DATE            NULL COMMENT 'Fecha de la versión del catálogo',
    observaciones           TEXT            NULL,
    fecha_creacion          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_referencia_tipo (tipo_catalogo),
    INDEX idx_referencia_tabla (tabla_consolidada)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Metadatos y mapeo de catálogos originales del MH';

-- ---------------------------------------------------------------------
-- Restaurar configuración
-- ---------------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- VERIFICACIÓN DE CREACIÓN
-- =====================================================================
SELECT
    TABLE_NAME              AS tabla,
    TABLE_ROWS              AS filas,
    TABLE_COMMENT           AS proposito
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'catalogo_mh_dte'
ORDER BY TABLE_NAME;

-- =====================================================================
-- FIN DEL SCRIPT
-- Total de tablas creadas: 11
--   - 1 central         (catalogo_maestro)
--   - 1 base especial   (catalogo_especial)
--   - 5 extensiones 1:1 (valores_numericos, unidades, tributos, paises, regimen)
--   - 2 jerárquicas     (ubicacion, actividad_economica)
--   - 2 independientes  (relaciones, referencia)
-- =====================================================================
