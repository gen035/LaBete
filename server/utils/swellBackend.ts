import { $fetch } from 'ofetch'
import { createError } from 'h3'

const SWELL_BACKEND_URL = 'https://api.swell.store'
export const SWELL_PRODUCT_EXPAND = 'cross_sells,up_sells'

export interface SwellProductListQuery {
  limit: number
  page: number
  sort: string
  categories?: string
}

export type SwellProduct = Record<string, unknown>

export interface SwellProductListResponse {
  results: SwellProduct[]
  count?: number
  page?: number
  page_count?: number
  [key: string]: unknown
}

function isRecord(value: unknown): value is SwellProduct {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

interface SwellRuntimeConfig {
  swellSecretKey?: string
  public?: {
    swellStoreId?: string
    swellPreview?: boolean
  }
}

function requireBackendCredentials(config: SwellRuntimeConfig) {
  if (!config.public?.swellStoreId || !config.swellSecretKey) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Non-production product access requires Swell backend credentials',
    })
  }
}

export function assertSwellBackendEnabled(config: SwellRuntimeConfig) {
  if (config.public?.swellPreview !== true) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Non-production product access is disabled',
    })
  }
}

function backendHeaders(config: SwellRuntimeConfig) {
  requireBackendCredentials(config)
  const credentials = `${config.public!.swellStoreId}:${config.swellSecretKey}`
  return {
    Authorization: `Basic ${Buffer.from(credentials).toString('base64')}`,
  }
}

async function backendRequest(
  path: string,
  config: SwellRuntimeConfig,
  query?: Record<string, string | number>,
): Promise<unknown> {
  const headers = backendHeaders(config)
  try {
    return await $fetch(`${SWELL_BACKEND_URL}${path}`, {
      headers,
      query,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown Swell error'
    throw createError({
      statusCode: 502,
      statusMessage: `Swell Backend API request failed: ${message}`,
    })
  }
}

export function normalizeSwellProduct(product: unknown): SwellProduct | null {
  if (!isRecord(product)) return null
  return {
    ...product,
    preview_only: product.active === false,
  }
}

export function normalizeSwellProductList(response: unknown): SwellProductListResponse {
  const responseObject = isRecord(response) ? response : {}
  const products = Array.isArray(responseObject.results)
    ? responseObject.results
        .map(normalizeSwellProduct)
        .filter((product): product is SwellProduct => product !== null)
    : []

  const normalized: SwellProductListResponse = { results: products }
  if (typeof responseObject.count === 'number') normalized.count = responseObject.count
  if (typeof responseObject.page === 'number') normalized.page = responseObject.page
  if (typeof responseObject.page_count === 'number') normalized.page_count = responseObject.page_count
  return normalized
}

export async function listSwellProducts(
  query: SwellProductListQuery,
  config: SwellRuntimeConfig,
) {
  const response = await backendRequest('/products', config, {
    limit: query.limit,
    page: query.page,
    sort: query.sort,
    ...(query.categories ? { categories: query.categories } : {}),
  })
  return normalizeSwellProductList(response)
}

export async function getSwellProduct(
  identifier: string,
  config: SwellRuntimeConfig,
) {
  const product = await backendRequest(
    `/products/${encodeURIComponent(identifier)}`,
    config,
    { expand: SWELL_PRODUCT_EXPAND },
  )
  return normalizeSwellProduct(product)
}

