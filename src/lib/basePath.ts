export const basePath = process.env.PUBLIC_URL || '/'
export const scoped = (path: string) => basePath + path.substring(1)
