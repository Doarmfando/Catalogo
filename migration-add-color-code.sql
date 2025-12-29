-- ============================================================================
-- MIGRACIÓN: Agregar columna color_code a la tabla colors
-- Fecha: 2025-12-28
-- ============================================================================

-- 1. Agregar la columna color_code (opcional/nullable)
ALTER TABLE colors
ADD COLUMN color_code text;

-- 2. Crear índice para búsquedas rápidas por código
CREATE INDEX idx_colors_code ON colors(color_code);

-- 3. Agregar constraint para que sea único (opcional pero recomendado)
ALTER TABLE colors
ADD CONSTRAINT unique_color_code UNIQUE (color_code);

-- ============================================================================
-- ACTUALIZAR LOS 21 COLORES EXISTENTES CON CÓDIGOS PREDECIBLES
-- ============================================================================

-- Blancos (3 colores)
UPDATE colors SET color_code = 'BLA-PER' WHERE name = 'Blanco Perla';
UPDATE colors SET color_code = 'BLA-STD' WHERE name = 'Blanco';
UPDATE colors SET color_code = 'BLA-POL' WHERE name = 'Blanco Polar';

-- Negros (3 colores)
UPDATE colors SET color_code = 'NEG-MID' WHERE name = 'Negro Midnight';
UPDATE colors SET color_code = 'NEG-STD' WHERE name = 'Negro';
UPDATE colors SET color_code = 'NEG-PHA' WHERE name = 'Negro Phantom';

-- Grises (3 colores)
UPDATE colors SET color_code = 'GRI-GRA' WHERE name = 'Gris Grafito';
UPDATE colors SET color_code = 'GRI-TIT' WHERE name = 'Gris Titanio';
UPDATE colors SET color_code = 'GRI-PLA' WHERE name = 'Gris Plata';

-- Plata (1 color)
UPDATE colors SET color_code = 'PLT-MET' WHERE name = 'Plata Metálico';

-- Azules (4 colores)
UPDATE colors SET color_code = 'AZU-OCE' WHERE name = 'Azul Océano';
UPDATE colors SET color_code = 'AZU-MAR' WHERE name = 'Azul Marino';
UPDATE colors SET color_code = 'AZU-ELE' WHERE name = 'Azul Eléctrico';
UPDATE colors SET color_code = 'AZU-CIE' WHERE name = 'Azul Cielo';

-- Rojos (3 colores)
UPDATE colors SET color_code = 'ROJ-CRI' WHERE name = 'Rojo Crimson';
UPDATE colors SET color_code = 'ROJ-PAS' WHERE name = 'Rojo Pasión';
UPDATE colors SET color_code = 'ROJ-FUE' WHERE name = 'Rojo Fuego';

-- Verdes (1 color)
UPDATE colors SET color_code = 'VER-ESM' WHERE name = 'Verde Esmeralda';

-- Marrones (1 color)
UPDATE colors SET color_code = 'MAR-CHO' WHERE name = 'Marrón Chocolate';

-- Dorado (1 color)
UPDATE colors SET color_code = 'DOR-STD' WHERE name = 'Dorado';

-- Beige (1 color)
UPDATE colors SET color_code = 'BEI-ARE' WHERE name = 'Beige Arena';

-- ============================================================================
-- VERIFICACIÓN: Ver todos los colores con sus códigos
-- ============================================================================
SELECT
    name,
    color_code,
    hex_code,
    color_family
FROM colors
ORDER BY color_family, name;

-- ============================================================================
-- NOTAS:
-- ============================================================================
-- Patrón de códigos:
--   - Primeras 3 letras del color base + guión + primeras 3 letras del subtipo
--   - Para colores base: XXX-STD (Standard)
--   - Ejemplos: BLA-PER, NEG-MID, AZU-OCE
--
-- Ventajas:
--   ✓ Fácil de recordar y predecible
--   ✓ Búsqueda rápida por código
--   ✓ Único para cada color
--   ✓ Compatible con sistemas de inventario
-- ============================================================================
