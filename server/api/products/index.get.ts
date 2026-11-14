import { createError, defineEventHandler, getQuery } from 'h3'
import {
  assertSwellBackendEnabled,
  listSwellProducts,
} from '~/server/utils/swellBackend'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 24
const MAX_LIMIT = 100
const DEFAULT_SORT = 'date_created desc'

function numberInRange(value: unknown, fallback: number, minimum: number, maximum?: number) {
  const parsed = typeof value === 'number' || typeof value === 'string' ? Number(value) : Number.NaN
  if (!Number.isFinite(parsed)) return fallback
  const integer = Math.floor(parsed)
  if (integer < minimum) return minimum
  return maximum === undefined ? integer : Math.min(integer, maximum)
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  assertSwellBackendEnabled(config)

  const query = getQuery(event)
  const sort = query.sort === undefined ? DEFAULT_SORT : query.sort
  if (typeof sort !== 'string' || sort !== DEFAULT_SORT) {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported product sort' })
  }

  const categories = query.categories
  if (categories !== undefined && typeof categories !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid product category' })
  }

  return listSwellProducts({
    page: numberInRange(query.page, DEFAULT_PAGE, 1),
    limit: numberInRange(query.limit, DEFAULT_LIMIT, 1, MAX_LIMIT),
    sort,
    ...(categories ? { categories } : {}),
  }, config)
})
