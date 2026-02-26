declare global {
  var sessionStorage: Storage;
}

class Storage {
  private data: Map<string, any>;

  constructor() {
    this.data = new Map<string, any>();
  }

  public key(n: number) {
    return [...this.data.keys()][n];
  }

  public getItem(key: string) {
    return this.data.get(key);
  }

  public get length() {
    return this.data.size;
  }

  public setItem(key: string, value: any) {
    this.data.set(key, value);
  }

  public removeItem(key: string) {
    this.data.delete(key);
  }

  public clear() {
    this.data = new Map<string, any>();
  }
}

const sessionStorage =
  globalThis.sessionStorage ?? new Storage();

globalThis.sessionStorage = sessionStorage;

export { sessionStorage };