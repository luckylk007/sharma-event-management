type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date);

/**
 * Convert Prisma records to the API shape the frontend expects:
 * - `id` → `_id`
 * - Date → ISO string
 * - `relatedServiceIds` / `relatedPostIds` stay as ID arrays unless hydrated separately
 */
export function serialize<T = unknown>(value: unknown): T {
  if (value === null || value === undefined) return value as T;
  if (value instanceof Date) return value.toISOString() as T;
  if (Array.isArray(value)) return value.map((item) => serialize(item)) as T;

  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      if (key === 'id') {
        out._id = val;
        continue;
      }
      if (key === 'password') continue;
      out[key] = serialize(val);
    }
    return out as T;
  }

  return value as T;
}

export function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === 'string');
}

export function asJsonArray(value: unknown): JsonValue[] {
  return Array.isArray(value) ? (value as JsonValue[]) : [];
}
