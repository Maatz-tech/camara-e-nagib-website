/**
 * Prefix an absolute path with Astro's `base` config.
 * Pass `/sobre` → returns `/camara-e-nagib-website/sobre` (or just `/sobre` when base is empty).
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return base + cleanPath;
}
