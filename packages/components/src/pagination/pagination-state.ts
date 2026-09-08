/** Internal pagination state normalization shared by Table and Pagination. */
export const normalizeTotal = (total: number): number =>
  Number.isFinite(total) && Number.isInteger(total) && total >= 0 ? total : 0

export const normalizePageSize = (size: number): number =>
  Number.isFinite(size) && size > 0 ? Math.max(1, Math.trunc(size)) : 1

export const getPageCount = (total: number, size: number): number =>
  Math.max(1, Math.ceil(normalizeTotal(total) / normalizePageSize(size)))

export const normalizeCurrent = (current: number, total: number, size: number): number => {
  const pageCount = getPageCount(total, size)
  const normalized = Number.isFinite(current) && current > 0 ? Math.trunc(current) : 1
  return Math.min(Math.max(normalized, 1), pageCount)
}
