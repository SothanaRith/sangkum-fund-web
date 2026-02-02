// Simple encryption/decryption utility for IDs
// Uses a simple XOR-based approach with Base64 encoding for obfuscation

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'donation-platform-secret-key-2024';

// Encrypt ID to a string
export const encryptId = (id) => {
  if (!id) return '';
  
  try {
    const idString = String(id);
    let encrypted = '';
    
    for (let i = 0; i < idString.length; i++) {
      const charCode = idString.charCodeAt(i);
      const keyCharCode = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
      encrypted += String.fromCharCode(charCode ^ keyCharCode);
    }
    
    // Convert to Base64 for URL safety
    return btoa(encrypted).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  } catch (err) {
    console.error('Encryption error:', err);
    return '';
  }
};

// Decrypt encrypted ID back to original
export const decryptId = (encryptedId) => {
  if (!encryptedId) return '';
  
  // If it's already a plain number, return it as-is
  if (/^\d+$/.test(String(encryptedId))) {
    return String(encryptedId);
  }
  
  try {
    // Reverse the URL-safe Base64 conversion
    let base64 = encryptedId.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const encrypted = atob(base64);
    let decrypted = '';
    
    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i);
      const keyCharCode = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
      decrypted += String.fromCharCode(charCode ^ keyCharCode);
    }
    
    return decrypted;
  } catch (err) {
    // Silently return the original ID if decryption fails
    return String(encryptedId);
  }
};
