export class CryptoUtils {
  private cryptoKey: CryptoKey | null = null;
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  async encrypt(text: string): Promise<string> {
    if (!text) return "";

    const key = await this.loadCryptoKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const data = this.encoder.encode(text);

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    const encryptedBytes = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedBytes.length);
    combined.set(iv);
    combined.set(encryptedBytes, iv.length);

    let bin = "";
    for (let i = 0; i < combined.length; i++) {
      bin += String.fromCharCode(combined[i]);
    }
    return btoa(bin);
  }

  async decrypt(base64: string): Promise<string> {
    if (!base64) return "";

    try {
      const key = await this.loadCryptoKey();
      const rawStr = atob(base64);
      const raw = new Uint8Array(rawStr.length);
      for (let i = 0; i < rawStr.length; i++) {
        raw[i] = rawStr.charCodeAt(i);
      }

      const iv = raw.slice(0, 12);
      const data = raw.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        data
      );

      return this.decoder.decode(decrypted);
    } catch (error) {
      console.error('Erro ao descriptografar:', error);
      return '';
    }
  }

  private async loadCryptoKey(): Promise<CryptoKey> {
    if (this.cryptoKey) return this.cryptoKey;

    const storageKey = "agenteIA.secretKey";
    let raw = localStorage.getItem(storageKey);

    if (!raw) {
      const newKey = this.randomBytes(32);
      const bin = String.fromCharCode(...newKey);
      const encoded = btoa(bin);
      localStorage.setItem(storageKey, encoded);
      raw = encoded;
    }

    const rawStr = atob(raw);
    const buffer = new Uint8Array(rawStr.length);
    for (let i = 0; i < rawStr.length; i++) {
      buffer[i] = rawStr.charCodeAt(i);
    }

    this.cryptoKey = await crypto.subtle.importKey(
      "raw",
      buffer,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );

    return this.cryptoKey;
  }

  private randomBytes(size: number): Uint8Array {
    const array = new Uint8Array(size);
    crypto.getRandomValues(array);
    return array;
  }
}