export type ApiResult<T = unknown> = { data: T; error?: undefined } | { error: string; data?: undefined }
