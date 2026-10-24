// Images are resized by Cloudflare's Image Transformations on the zone serving
// the site (https://developers.cloudflare.com/images/transform-images/), and
// GitHub avatars by GitHub's own `s` parameter.
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith('https://avatars.githubusercontent.com/')) {
    return `${src}${src.includes('?') ? '&' : '?'}s=${width}`
  }
  if (process.env.NODE_ENV === 'development') {
    return `${src}?w=${width}`
  }
  let options = [`width=${width}`, `quality=${quality || 75}`, 'format=auto', 'onerror=redirect']
  return `/cdn-cgi/image/${options.join(',')}${src}`
}
