export class Cache<D extends Record<string, any>, V extends D[keyof D]> {
  private cache: Record<string, V> = {};

  public set(key: string, value: V) {
    this.cache[key] = value;
  }

  public update(key: string, value: V) {
    const prev = this.cache[key];
    if (typeof prev !== "object" || typeof value !== "object") {
      this.set(key, value);
      return;
    }
    this.cache[key] = {
      ...prev,
      ...value,
    };
  }

  public get(key: string): V {
    return this.cache[key];
  }

  public clearCache() {
    this.cache = {};
  }
}
