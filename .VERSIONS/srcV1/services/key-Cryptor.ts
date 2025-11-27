

export class EncryptManager {
  private aesKey: CryptoKey | null 
  = null;
  private readonly storageKey = "gptCryptoKey";

  constructor() {
    this.loadOrCreateKey();
  }

  private async loadOrCreateKey(): Promise<void> {
    const savedKeyBase64 = localStorage.getItem(this.storageKey);

    if (savedKeyBase64) {
      try {
        const rawKey = this.base64ToArrayBuffer(savedKeyBase64);
        this.aesKey = await crypto.subtle.importKey(
          "raw",
          rawKey,
          { name: "AES-GCM" },
          true,
          ["encrypt", "decrypt"]
        );
        return;
      } catch (err) {
        console.error("Chave AES corrompida. Criando nova chave…", err);
      }
    }

    await this.generateAndStoreKey();
  }

  private async generateAndStoreKey(): Promise<void> {
    try {
      this.aesKey = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );

      const rawKey = await crypto.subtle.exportKey("raw", this.aesKey);
      localStorage.setItem(this.storageKey, this.arrayBufferToBase64(rawKey));
    } catch (error) {
      console.error("Erro ao gerar chave AES:", error);
      throw error;
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    // validação simples de Base64
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) {
      throw new Error("Base64 inválido");
    }

    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  }

  // ——————————————————
  // 🔒 CRIPTOGRAFAR TEXTO
  // ——————————————————
  public async encrypt(text: string): Promise<string> {
    if (!this.aesKey) throw new Error("Chave AES não carregada");

    try {
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encoder = new TextEncoder();
      const data = encoder.encode(text);

      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        this.aesKey,
        data
      );

      const encryptedBytes = new Uint8Array(encrypted);
      const combined = new Uint8Array(iv.length + encryptedBytes.length);

      combined.set(iv);
      combined.set(encryptedBytes, iv.length);

      return this.arrayBufferToBase64(combined.buffer);
    } catch (error) {
      console.error("Erro ao criptografar:", error);
      throw new Error("Falha ao criptografar dados");
    }
  }

  // ——————————————————
  // 🔓 DESCRIPTOGRAFAR TEXTO
  // ——————————————————
  public async decrypt(base64: string): Promise<string> {
    if (!this.aesKey) throw new Error("Chave AES não carregada");
    if (!base64) throw new Error("Nenhum dado para descriptografar");

    try {
      const combined = new Uint8Array(this.base64ToArrayBuffer(base64));
      const iv = combined.slice(0, 12);
      const encryptedBytes = combined.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        this.aesKey,
        encryptedBytes
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error("Erro ao descriptografar:", error);

      // erro comum: chave perdida / corrompida
      if (error instanceof DOMException && error.name === "OperationError") {
        throw new Error(
          "Os dados não puderam ser descriptografados. A chave local pode ter sido perdida ou alterada."
        );
      }

      throw new Error("Falha ao descriptografar dados");
    }
  }
}