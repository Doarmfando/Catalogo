-- ============================================================================
-- FIX: Configuración del bucket para acceso público
-- ============================================================================
-- Este script asegura que el bucket car-images sea completamente público
-- y accesible desde cualquier origen
-- ============================================================================

-- 1. Asegurarse de que el bucket existe y es público
UPDATE storage.buckets
SET public = true
WHERE id = 'car-images';

-- 2. Eliminar políticas antiguas si existen
DROP POLICY IF EXISTS "public_read_car_images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_upload_car_images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_update_car_images" ON storage.objects;
DROP POLICY IF EXISTS "admin_delete_car_images" ON storage.objects;

-- 3. Crear política simple de lectura pública (sin autenticación)
CREATE POLICY "public_read_car_images"
ON storage.objects FOR SELECT
USING (bucket_id = 'car-images');

-- 4. Permitir INSERTS sin autenticación (temporalmente para desarrollo)
CREATE POLICY "public_upload_car_images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'car-images');

-- 5. Permitir UPDATES sin autenticación (temporalmente para desarrollo)
CREATE POLICY "public_update_car_images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'car-images')
WITH CHECK (bucket_id = 'car-images');

-- 6. Permitir DELETES sin autenticación (temporalmente para desarrollo)
CREATE POLICY "public_delete_car_images"
ON storage.objects FOR DELETE
USING (bucket_id = 'car-images');

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

-- Ver configuración del bucket
SELECT
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets
WHERE id = 'car-images';

-- Ver políticas activas
SELECT
    policyname,
    cmd as operation,
    qual as using_expression
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND policyname LIKE '%car_images%';

-- ============================================================================
-- NOTA IMPORTANTE
-- ============================================================================
-- Estas políticas son MUY PERMISIVAS y están diseñadas solo para DESARROLLO.
-- Cuando actives la autenticación, deberás reemplazarlas con políticas
-- más restrictivas que requieran auth.role() = 'authenticated'
-- ============================================================================
