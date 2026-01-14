export function isUrl(content: string) {
  try {
    const contentIsUrl = new URL(content)
    return !!contentIsUrl
  } catch {
    return false
  }
}
