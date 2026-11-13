export function withSwellImageWidth(url: string | null | undefined, width: number): string | undefined {
  if (!url) return undefined

  try {
    const imageUrl = new URL(url)
    imageUrl.searchParams.set('width', String(width))
    return imageUrl.toString()
  } catch {
    return url
  }
}
