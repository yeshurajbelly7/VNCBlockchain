declare module 'hdkey' {
  export default class HDKey {
    publicKey: Buffer;
    privateKey: Buffer;
    chainCode: Buffer;
    
    constructor();
    
    static fromMasterSeed(seed: Buffer, versions?: Buffer): HDKey;
    static fromExtendedKey(base58key: string, versions?: Buffer): HDKey;
    
    derive(path: string): HDKey;
    deriveChild(index: number): HDKey;
    
    sign(hash: Buffer): Buffer;
    verify(hash: Buffer, signature: Buffer): boolean;
    
    toJSON(): {
      xpriv: string;
      xpub: string;
    };
  }
}
