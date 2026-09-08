import type { Request } from '@playwright/test'

/** VitePress cancels an in-flight route-prefetch script when page.goto moves
 * to the next route. Keep this exception narrower than generic ABORTED. */
export function isIgnorableCancelledVitePressPrefetch(request: Request, errorText: string) {
  if (request.resourceType() !== 'script' || !/Load request cancelled/i.test(errorText)) return false
  const url = new URL(request.url())
  return url.hostname === '127.0.0.1' && /^\/assets\/.+\.md\.[\w-]+\.js$/.test(url.pathname)
}
