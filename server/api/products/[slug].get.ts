import { createError, defineEventHandler } from 'h3'
import {
  assertSwellBackendEnabled,
  getSwellProduct,
} from '~/server/utils/swellBackend'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  assertSwellBackendEnabled(config)

  const slug = event.context.params?.slug
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Product slug is required' })
  }

  return getSwellProduct(slug, config)
})
