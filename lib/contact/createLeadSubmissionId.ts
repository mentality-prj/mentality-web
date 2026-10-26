/**
 * Opaque, client-generated request identifier. It does not encode identity,
 * user activity or a message. Keep the same value across a failed POST retry;
 * a new form instance creates a new ID.
 *
 * Web Crypto is available on secure browser origins. Do not use Math.random
 * for the deduplication key.
 */
export function createLeadSubmissionId(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-')
}
