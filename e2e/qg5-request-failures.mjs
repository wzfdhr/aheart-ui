const trackers = new WeakMap()
const requestRoutes = new WeakMap()
const isRouteAsset = pathname => /^\/assets\/.+\.md\.[\w-]+\.js$/.test(pathname)
const routeStems = route => {
  const value = route.replace(/^\/+/, '')
  return [`${value.replaceAll('/', '_')}.md.`, `${value.replaceAll('/', '-')}.md.`]
}
const assetBelongsToRoute = (pathname, route) => Boolean(route && routeStems(route).some(stem => pathname.includes(`/assets/${stem}`)))

export class VitePressRequestTracker {
  activeRoute = ''
  completedUrls = new Set()
  constructor(readonlyProjectName) { this.projectName = readonlyProjectName }
  setActiveRoute(route) { this.activeRoute = route }
  attach(page) {
    page.on('request', request => requestRoutes.set(request, { route: this.activeRoute, url: request.url() }))
  }
  async recordCompletedResponse(response) {
    const request = response.request()
    const snapshot = requestRoutes.get(request)
    if (!snapshot || !isRouteAsset(new URL(response.url()).pathname)) return
    try {
      const finishedError = await response.finished()
      if (finishedError === null && response.ok()) this.completedUrls.add(response.url())
    } catch { /* cancelled or body failure is deliberately not a success */ }
  }
  isIgnorable(request, errorText) {
    const snapshot = requestRoutes.get(request)
    return isIgnorableCancelledVitePressPrefetch(this.projectName, snapshot, request, errorText, this.completedUrls)
  }
}

export function installVitePressRequestTracker(page, projectName) {
  const tracker = new VitePressRequestTracker(projectName)
  trackers.set(page, tracker)
  tracker.attach(page)
  return tracker
}

export function setActiveVitePressRoute(page, route) { trackers.get(page)?.setActiveRoute(route) }

export function isIgnorableCancelledVitePressPrefetch(projectName, snapshot, request, errorText, completedUrls = new Set()) {
  if (projectName !== 'desktop-webkit' || errorText.trim().toLowerCase() !== 'load request cancelled' || request.resourceType() !== 'script') return false
  const url = new URL(request.url())
  if (url.hostname !== '127.0.0.1' || !isRouteAsset(url.pathname) || !snapshot?.route) return false
  if (!assetBelongsToRoute(url.pathname, snapshot.route)) return true
  return completedUrls.has(url.href)
}
