// Simple AES decryption using Web Crypto API
export async function decrypt(encrypted: string, keyStr: string) {
  const [ivHex, dataHex] = encrypted.split(":");
  const iv = new Uint8Array(
    ivHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
  );
  const data = new Uint8Array(
    dataHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
  );

  const keyBytes = new TextEncoder().encode(keyStr);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    "AES-CBC",
    false,
    ["decrypt"],
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    cryptoKey,
    data,
  );

  return new TextDecoder().decode(decryptedBuffer);
}
