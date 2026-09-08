const trackers = new WeakMap()
const isRouteAsset = pathname => /^\/assets\/.+\.md\.[\w-]+\.js$/.test(pathname)

export class VitePressRequestTracker {
  activeRoute = ''
  successfulRouteAssets = new Map()
  constructor(projectName) { this.projectName = projectName }
  setActiveRoute(route) { this.activeRoute = route }
  recordSuccessfulResponse(url, status) {
    const parsed = new URL(url)
    if (status < 400 && isRouteAsset(parsed.pathname)) this.successfulRouteAssets.set(parsed.href, this.activeRoute)
  }
  isIgnorable(request, errorText) { return isIgnorableCancelledVitePressPrefetch(this.projectName, this.activeRoute, request, errorText, this.successfulRouteAssets) }
}

export function installVitePressRequestTracker(page, projectName) {
  const tracker = new VitePressRequestTracker(projectName)
  trackers.set(page, tracker)
  return tracker
}

export function setActiveVitePressRoute(page, route) { trackers.get(page)?.setActiveRoute(route) }

export function isIgnorableCancelledVitePressPrefetch(projectName, activeRoute, request, errorText, successfulRouteAssets = new Map()) {
  if (!/^desktop-webkit$/.test(projectName) || request.resourceType() !== 'script' || !/Load request cancelled/i.test(errorText)) return false
  const url = new URL(request.url())
  if (url.hostname !== '127.0.0.1' || !isRouteAsset(url.pathname)) return false
  const succeededFor = successfulRouteAssets.get(url.href)
  return Boolean(succeededFor && (succeededFor === activeRoute || succeededFor !== activeRoute))
}
