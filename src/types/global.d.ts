declare module 'buffer' {
  export class Buffer {
    static from(data: string, encoding?: string): Buffer;
    readInt16LE(offset: number): number;
    readUInt16LE(offset: number): number;
    readUInt8(offset: number): number;
    writeInt16LE(value: number, offset: number): void;
    writeUInt16LE(value: number, offset: number): void;
    static alloc(size: number): Buffer;
  }
}
