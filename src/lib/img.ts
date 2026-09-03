/**
 * Netlify Image CDN helpers.
 *
 * Images uploaded through the CMS land in /public. Netlify can resize and
 * re-encode them on the fly, which matters a lot when someone uploads a 5 MB
 * photo straight off a phone.
 *
 * Set PUBLIC_IMAGE_CDN=0 to fall back to serving the original files
 * (useful for local previews, or if the CDN ever needs to be switched off).
 */

const CDN_ENABLED =
  !import.meta.env.DEV && import.meta.env.PUBLIC_IMAGE_CDN !== '0';

const isRemote = (src: string) => /^https?:\/\//.test(src);

export function cdnUrl(
  src: string,
  opts: { w?: number; h?: number; fit?: 'cover' | 'contain'; q?: number } = {}
): string {
  if (!src || isRemote(src) || !CDN_ENABLED) return src;

  const params = new URLSearchParams({ url: src });
  if (opts.w) params.set('w', String(opts.w));
  if (opts.h) params.set('h', String(opts.h));
  if (opts.fit) params.set('fit', opts.fit);
  params.set('q', String(opts.q ?? 72));
  return `/.netlify/images?${params.toString()}`;
}

export function srcSet(
  src: string,
  widths: number[],
  fit: 'cover' | 'contain' = 'cover'
): string | undefined {
  if (!src || isRemote(src) || !CDN_ENABLED) return undefined;
  return widths.map((w) => `${cdnUrl(src, { w, fit })} ${w}w`).join(', ');
}
