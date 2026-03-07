class Cache {
  constructor(ttlMs = 60000) {
    this.ttlMs = ttlMs;
    this.store = new Map();
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;

    const fresh = Date.now() - entry.timestamp < this.ttlMs;
    return { data: entry.data, fresh, timestamp: entry.timestamp };
  }

  set(key, data) {
    this.store.set(key, { data, timestamp: Date.now() });
  }
}

module.exports = Cache;
