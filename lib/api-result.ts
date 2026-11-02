/**
 * Public contract for domain API responses. Transport details such as Headers
 * stay inside the HTTP adapter; consumers receive either data or an error.
 */
export type ApiFailure = { error: string; status?: number }
export type ApiResult<T> = { data: T } | ApiFailure
export type ApiResultPromise<T> = Promise<ApiResult<T>>

/** Preserve upstream HTTP status without adding an undefined property. */
export function forwardApiFailure(failure: ApiFailure): ApiFailure {
  return typeof failure.status === 'number'
    ? { error: failure.error, status: failure.status }
    : { error: failure.error }
}
