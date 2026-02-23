/**
 * Simple Zero-Knowledge client-side encryption wrapper using AES-GCM.
 * This ensures Gateway Tokens never hit Supabase in plain text.
 */

const KEY_STORAGE_NAME = "anima_local_key";

export async function getOrCreateKey(): Promise<CryptoKey> {
  const existingKeyStr = localStorage.getItem(KEY_STORAGE_NAME);
  if (existingKeyStr) {
    const rawKey = Uint8Array.from(atob(existingKeyStr), c => c.charCodeAt(0));
    return crypto.subtle.importKey(
      "raw",
      rawKey,
      { name: "AES-GCM" },
      true,
      ["encrypt", "decrypt"]
    );
  }

  // Generate a new 256-bit AES-GCM key
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // Export and store
  const rawKey = await crypto.subtle.exportKey("raw", key);
  const base64Key = btoa(String.fromCharCode(...new Uint8Array(rawKey)));
  localStorage.setItem(KEY_STORAGE_NAME, base64Key);

  return key;
}

export async function encryptToken(text: string): Promise<string> {
  const key = await getOrCreateKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedText = new TextEncoder().encode(text);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encodedText
  );

  // Combine IV and Ciphertext for storage
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return btoa(String.fromCharCode(...combined));
}

export async function decryptToken(encryptedBase64: string): Promise<string> {
  const key = await getOrCreateKey();
  const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decryptedBuffer);
}
