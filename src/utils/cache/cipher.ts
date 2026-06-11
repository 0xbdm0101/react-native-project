import { decrypt as aesDecrypt, encrypt as aesEncrypt } from "crypto-js/aes";
import UTF8, { parse } from "crypto-js/enc-utf8";
import pkcs7 from "crypto-js/pad-pkcs7";
import CTR from "crypto-js/mode-ctr";
import Base64 from "crypto-js/enc-base64";

export interface Encryption {
  encrypt(plainText: string): string;
  decrypt(cipherText: string): string;
}

export interface EncryptionParams {
  key: string;
  iv: string;
}

class AesEncryption implements Encryption {
  private readonly key;
  private readonly iv;

  constructor({ key, iv }: EncryptionParams) {
    this.key = parse(key);
    this.iv = parse(iv);
  }

  get getOptions() {
    return {
      mode: CTR,
      padding: pkcs7,
      iv: this.iv,
    };
  }

  encrypt(plainText: string) {
    return aesEncrypt(plainText, this.key, this.getOptions).toString();
  }

  decrypt(cipherText: string) {
    return aesDecrypt(cipherText, this.key, this.getOptions).toString(UTF8);
  }
}

class Base64Encryption implements Encryption {
  private static instance: Base64Encryption;

  private constructor() {}

  public static getInstance(): Base64Encryption {
    if (!Base64Encryption.instance) {
      Base64Encryption.instance = new Base64Encryption();
    }
    return Base64Encryption.instance;
  }

  encrypt(plainText: string) {
    return UTF8.parse(plainText).toString(Base64);
  }

  decrypt(cipherText: string) {
    return Base64.parse(cipherText).toString(UTF8);
  }
}

export class EncryptionFactory {
  public static createAesEncryption(params: EncryptionParams): Encryption {
    return new AesEncryption(params);
  }

  public static createBase64Encryption(): Encryption {
    return Base64Encryption.getInstance();
  }
}
