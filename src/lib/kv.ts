// Lightweight KV wrapper that dynamically uses @vercel/kv when available
// Falls back to an in-memory Map when Vercel KV isn't configured (dev only)

type KVLike = {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  del?: (key: string) => Promise<void>;
};

let client: KVLike | null = null;

async function createClient(): Promise<KVLike> {
  if (client) return client;

  const url = process.env.VERCEL_KV_URL;
  const token = process.env.VERCEL_KV_TOKEN;

  if (url && token) {
    try {
      const mod = await import('@vercel/kv');
      const createClient = (mod as any).createClient || (mod as any).default?.createClient;
      const kv = createClient ? createClient({ url, token }) : (mod as any).default({ url, token });

      client = {
        get: async (k: string) => {
          const v = await kv.get(k);
          return typeof v === 'string' ? v : (v == null ? null : JSON.stringify(v));
        },
        set: async (k: string, value: string) => {
          await kv.set(k, value);
        },
        del: async (k: string) => {
          if (kv.del) await kv.del(k);
        },
      };

      return client;
    } catch (e) {
      console.warn('Failed to load @vercel/kv, falling back to memory KV:', e);
    }
  }

  // In-memory fallback (only for local dev/testing). Not persisted across cold starts.
  const map = new Map<string, string>();
  client = {
    get: async (k: string) => {
      return map.has(k) ? map.get(k)! : null;
    },
    set: async (k: string, value: string) => {
      map.set(k, value);
    },
    del: async (k: string) => {
      map.delete(k);
    },
  };

  return client;
}

export async function kvGet(key: string): Promise<string | null> {
  const c = await createClient();
  return c.get(key);
}

export async function kvSet(key: string, value: string): Promise<void> {
  const c = await createClient();
  return c.set(key, value);
}

export async function kvDel(key: string): Promise<void> {
  const c = await createClient();
  if (c.del) return c.del(key);
  return Promise.resolve();
}

export default { kvGet, kvSet, kvDel };
