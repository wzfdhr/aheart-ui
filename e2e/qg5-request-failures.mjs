const trackers = new WeakMap()
const requestMetadata = new WeakMap()
const assetPattern = /^\/assets\/(.+)\.md\.([\w-]+)(\.lean)?\.js$/

export const normalizeRoute = value => {
  const path = new URL(value, 'http://127.0.0.1').pathname
  return path.replace(/\.html$/, '').replace(/\/+$/, '') || '/'
}
const routeStem = route => normalizeRoute(route).replace(/^\/+/, '').replaceAll('/', '_')
const parseAsset = pathname => {
  const match = assetPattern.exec(pathname)
  return match ? { stem: match[1], hash: match[2], canonical: `${match[1]}:${match[2]}` } : null
}

export class VitePressRequestTracker {
  activeRoute = ''
  completedUrls = new Set()
  constructor(projectName, page) { this.projectName = projectName; this.page = page }
  setActiveRoute(route) { this.activeRoute = normalizeRoute(route) }
  async recordRequest(request) {
    try {
      const headers = await request.allHeaders()
      requestMetadata.set(request, {
        frame: request.frame() === this.page.mainFrame(),
        method: request.method(),
        resourceType: request.resourceType(),
        secFetchDest: headers['sec-fetch-dest'],
        referer: headers.referer ? normalizeRoute(headers.referer) : '',
        activeRoute: this.activeRoute
      })
    } catch { requestMetadata.set(request, null) }
  }
  attach(page) { page.on('request', request => { void this.recordRequest(request) }) }
  async recordCompletedResponse(response) {
    const request = response.request()
    const metadata = requestMetadata.get(request)
    if (!metadata) return
    const parsed = new URL(response.url())
    const asset = parseAsset(parsed.pathname)
    if (!asset) return
    try {
      const finishedError = await response.finished()
      if (finishedError === null && response.ok()) this.completedUrls.add(asset.canonical)
    } catch { /* cancelled/body failure is not a successful transfer */ }
  }
  async isIgnorable(request, errorText) {
    return isIgnorableCancelledVitePressPrefetch(this.projectName, requestMetadata.get(request), request, errorText, this.completedUrls)
  }
}

export function installVitePressRequestTracker(page, projectName) {
  const tracker = new VitePressRequestTracker(projectName, page)
  trackers.set(page, tracker)
  tracker.attach(page)
  return tracker
}
export function setActiveVitePressRoute(page, route) { trackers.get(page)?.setActiveRoute(route) }

export function isIgnorableCancelledVitePressPrefetch(projectName, metadata, request, errorText, completedUrls = new Set()) {
  if (projectName !== 'desktop-webkit' || errorText.trim().toLowerCase() !== 'load request cancelled' || !metadata?.frame || metadata.method !== 'GET' || metadata.resourceType !== 'xhr' || metadata.secFetchDest !== 'empty' || !metadata.referer || metadata.referer !== normalizeRoute(metadata.activeRoute)) return false
  const url = new URL(request.url())
  const match = url.hostname === '127.0.0.1' ? parseAsset(url.pathname) : null
  if (!match) return false
  const currentStem = routeStem(metadata.activeRoute)
  if (match.stem !== currentStem) return true
  return completedUrls.has(match.canonical)
}
