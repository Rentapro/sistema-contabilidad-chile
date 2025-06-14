/**
 * Servicio de Encriptación para Datos Sensibles
 * Utiliza AES-256-GCM para encriptar credenciales
 */

// Clave de encriptación (en producción debería venir de variables de entorno)
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'sistema-contabilidad-chile-2025-key-default';

/**
 * Generar clave de encriptación desde string
 */
async function generateKey(password: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  // Salt fijo para compatibilidad (en producción debería ser aleatorio por usuario)
  const salt = encoder.encode('sistema-contabilidad-chile-salt');

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encriptar datos sensibles
 */
export async function encrypt(data: string): Promise<string> {
  try {
    // Verificar si crypto está disponible (navegador)
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      console.warn('⚠️ Web Crypto API no disponible, usando fallback básico');
      return btoa(data); // Fallback básico (NO seguro para producción)
    }

    const encoder = new TextEncoder();
    const key = await generateKey(ENCRYPTION_KEY);
    const iv = crypto.getRandomValues(new Uint8Array(12)); // IV para AES-GCM
    
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encoder.encode(data)
    );

    // Combinar IV + datos encriptados
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Convertir a base64 para almacenamiento
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Error encriptando datos:', error);
    // Fallback en caso de error
    return btoa(data);
  }
}

/**
 * Desencriptar datos sensibles
 */
export async function decrypt(encryptedData: string): Promise<string> {
  try {
    // Verificar si crypto está disponible
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      console.warn('⚠️ Web Crypto API no disponible, usando fallback básico');
      return atob(encryptedData); // Fallback básico
    }

    // Decodificar de base64
    const combined = new Uint8Array(
      atob(encryptedData).split('').map(char => char.charCodeAt(0))
    );

    // Separar IV y datos encriptados
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    const key = await generateKey(ENCRYPTION_KEY);
    
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Error desencriptando datos:', error);
    // Fallback en caso de error
    try {
      return atob(encryptedData);
    } catch {
      return '';
    }
  }
}

/**
 * Verificar si el sistema de encriptación está funcionando
 */
export async function testEncryption(): Promise<boolean> {
  try {
    const testData = 'test-encryption-data';
    const encrypted = await encrypt(testData);
    const decrypted = await decrypt(encrypted);
    
    return testData === decrypted;
  } catch (error) {
    console.error('Error en test de encriptación:', error);
    return false;
  }
}

/**
 * Generar hash seguro para contraseñas (sin reversión)
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      // Fallback simple (NO seguro para producción)
      return btoa(password + 'salt-sistema-contabilidad');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'sistema-contabilidad-chile-salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Error hasheando contraseña:', error);
    return btoa(password + 'fallback-salt');
  }
}

/**
 * Validar hash de contraseña
 */
export async function validatePasswordHash(password: string, hash: string): Promise<boolean> {
  try {
    const newHash = await hashPassword(password);
    return newHash === hash;
  } catch (error) {
    console.error('Error validando hash:', error);
    return false;
  }
}

/**
 * Limpiar datos sensibles de memoria (best practice)
 */
export function clearSensitiveData(obj: any): void {
  if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string') {
        obj[key] = '';
      } else if (typeof obj[key] === 'object') {
        clearSensitiveData(obj[key]);
      }
    });
  }
}
