/**
 * Utilidades para manejo de imágenes
 */

/**
 * Convierte una imagen a formato WebP con compresión
 * @param file - Archivo de imagen original
 * @param quality - Calidad de compresión (0-1), default 0.85
 * @returns Promise con el Blob WebP
 */
export async function convertToWebP(
  file: File,
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('No se pudo obtener el contexto del canvas'));
      return;
    }

    img.onload = () => {
      // Mantener dimensiones originales
      canvas.width = img.width;
      canvas.height = img.height;

      // Dibujar imagen en canvas
      ctx.drawImage(img, 0, 0);

      // Convertir a WebP
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Error al convertir la imagen'));
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Error al cargar la imagen'));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Sube una imagen al bucket de Supabase a través del API
 * @param file - Archivo de imagen a subir
 * @param folder - Carpeta dentro del bucket (ej: 'cars', 'frontal')
 * @returns Promise con la URL pública de la imagen
 */
export async function uploadImage(
  file: File,
  folder: string = 'cars'
): Promise<string> {
  try {
    // Convertir a WebP
    const webpBlob = await convertToWebP(file);

    // Crear FormData
    const formData = new FormData();
    formData.append('file', webpBlob, `${Date.now()}.webp`);
    formData.append('folder', folder);

    // Enviar al API
    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al subir la imagen');
    }

    const data = await response.json();
    return data.url;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
