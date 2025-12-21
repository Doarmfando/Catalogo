/**
 * Utilidades para gestionar Supabase Storage
 *
 * Funciones para subir, eliminar y obtener URLs de imágenes
 */

import { createClient } from './client'

const BUCKET_NAME = 'car-images'

/**
 * Estructura de carpetas en el bucket:
 *
 * car-images/
 * ├── cars/              - Imágenes principales de autos
 * ├── cars-frontal/      - Imágenes laterales/frontales
 * ├── colors/            - Galería de imágenes por color
 * │   └── [version_color_id]/
 * ├── brands/            - Logos de marcas (opcional)
 * └── banners/           - Imágenes de banners
 */

export type UploadFolder = 'cars' | 'cars-frontal' | 'colors' | 'brands' | 'banners'

/**
 * Sube una imagen al bucket de Supabase Storage
 *
 * @param file - Archivo a subir (File o Blob)
 * @param folder - Carpeta destino ('cars', 'colors', etc.)
 * @param fileName - Nombre del archivo (sin extensión, se genera automáticamente)
 * @returns URL pública de la imagen subida
 */
export async function uploadImage(
  file: File | Blob,
  folder: UploadFolder,
  fileName?: string
): Promise<{ url: string; path: string } | { error: string }> {
  const supabase = createClient()

  // Generar nombre único si no se proporciona
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  const extension = file instanceof File ? file.name.split('.').pop() : 'jpg'
  const finalFileName = fileName
    ? `${fileName}.${extension}`
    : `${timestamp}-${random}.${extension}`

  const filePath = `${folder}/${finalFileName}`

  try {
    // Subir archivo
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false, // No sobrescribir si ya existe
      })

    if (error) {
      console.error('Error uploading image:', error)
      return { error: error.message }
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path)

    return {
      url: publicUrl,
      path: data.path,
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { error: 'Error inesperado al subir imagen' }
  }
}

/**
 * Sube múltiples imágenes a la vez
 *
 * @param files - Array de archivos a subir
 * @param folder - Carpeta destino
 * @returns Array de URLs públicas
 */
export async function uploadMultipleImages(
  files: File[],
  folder: UploadFolder
): Promise<Array<{ url: string; path: string } | { error: string }>> {
  const uploadPromises = files.map((file) => uploadImage(file, folder))
  return Promise.all(uploadPromises)
}

/**
 * Elimina una imagen del bucket
 *
 * @param filePath - Ruta completa del archivo (ej: 'cars/palisade-2026.png')
 * @returns true si se eliminó correctamente, false si hubo error
 */
export async function deleteImage(filePath: string): Promise<boolean> {
  const supabase = createClient()

  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) {
      console.error('Error deleting image:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error:', error)
    return false
  }
}

/**
 * Obtiene la URL pública de una imagen
 *
 * @param filePath - Ruta del archivo (ej: 'cars/palisade-2026.png')
 * @returns URL pública completa
 */
export function getPublicUrl(filePath: string): string {
  const supabase = createClient()

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)

  return publicUrl
}

/**
 * Lista todos los archivos en una carpeta
 *
 * @param folder - Carpeta a listar
 * @returns Array de archivos
 */
export async function listFiles(folder: UploadFolder) {
  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    })

  if (error) {
    console.error('Error listing files:', error)
    return []
  }

  return data
}

/**
 * Crea una URL con firma temporal (para imágenes privadas)
 *
 * @param filePath - Ruta del archivo
 * @param expiresIn - Tiempo de expiración en segundos (default: 1 hora)
 * @returns URL firmada temporalmente
 */
export async function createSignedUrl(
  filePath: string,
  expiresIn: number = 3600
): Promise<string | null> {
  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, expiresIn)

  if (error) {
    console.error('Error creating signed URL:', error)
    return null
  }

  return data.signedUrl
}

/**
 * Valida si un archivo es una imagen válida
 *
 * @param file - Archivo a validar
 * @returns true si es válido, mensaje de error si no
 */
export function validateImageFile(
  file: File
): { valid: true } | { valid: false; error: string } {
  // Validar tipo de archivo
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de archivo no válido. Solo se permiten JPG, PNG y WebP.',
    }
  }

  // Validar tamaño (máximo 50MB)
  const maxSize = 50 * 1024 * 1024 // 50MB en bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Archivo demasiado grande. El tamaño máximo es 50MB.',
    }
  }

  return { valid: true }
}
