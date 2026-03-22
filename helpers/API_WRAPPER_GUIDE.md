# API Wrapper Guide

## Overview

`apiRequestWithAuth` is the standard wrapper for all authenticated API requests to the backend. It automatically:

- ✅ Adds the user's OAuth token to headers
- ✅ Handles authorization errors and calls `signOut()` on 401
- ✅ Logs all requests via a structured logger
- ✅ Standardizes response format
- ✅ Provides type-safety via TypeScript

### Two available functions

| Function             | File                               | Use when                                                                                         |
| -------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| `apiRequestWithAuth` | `helpers/api-request-with-auth.ts` | **Default — all authenticated requests.** Calls `signOut()` automatically on 401.                |
| `apiRequest`         | `helpers/api-wrapper.ts`           | Internal/low-level use only. Does NOT auto sign-out on 401. Do not use directly in feature code. |

> **Rule:** always import `apiRequestWithAuth` in `requests/*.ts` files. `apiRequest` is an implementation detail.

## Usage

### Basic example

```typescript
import { apiRequestWithAuth } from '@/helpers/api-request-with-auth'
import { CustomSession } from '@/types/auth'
import { APIUrl } from './config'

export async function addTag(session: CustomSession | null, tag: Tag) {
  const { data, error } = await apiRequestWithAuth(session, `${APIUrl}/tags`, {
    method: 'POST',
    body: { key: tag.key, translations: tag.translations },
  })

  if (error) {
    logger.error('Failed to add tag', { error, tagKey: tag.key })
    return { error: error.message }
  }

  logger.info('Tag successfully added', { tagKey: tag.key })
  return { data }
}
```

### Getting session in a component

```typescript
import { useSession } from 'next-auth/react'

export default function MyComponent() {
  const { data: session } = useSession()

  const handleSubmit = async () => {
    // Pass the entire session object
    const result = await addTag(session, tag)

    if (result.error) {
      // Handle error
      toast.error(result.error)
    } else {
      // Success
      toast.success('Tag added successfully')
    }
  }
}
```

## API

### `apiRequestWithAuth<T>(session, url, options, opts?)`

#### Parameters

- **session**: `CustomSession | null` - Session object from `useSession()`
- **url**: `string` - Full endpoint URL (including `APIUrl`)
- **options**: `ApiRequestOptions` (optional)
  - `method`: `'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'` (default: `'GET'`)
  - `body`: `Record<string, unknown> | FormData` (optional)
  - `headers`: `HeadersInit` (optional — additional headers)
- **opts**: (optional)
  - `autoSignOutOn401`: `boolean` (default: `true`) — call `signOut()` when response is 401

#### Returns

```typescript
Promise<{
  data?: T // Response data (if successful)
  headers?: Headers // Response headers (if successful)
  error?: {
    // Error object (if failed)
    name: string // Error name (Unauthorized, ServerError, etc.)
    message: string // Human-readable error message
    status?: number // HTTP status code
  }
}>
```

## Method examples

### GET request

```typescript
export async function getTags(session: CustomSession | null) {
  const { data, error } = await apiRequestWithAuth<Tag[]>(session, `${APIUrl}/tags`, {
    method: 'GET',
  })

  if (error) {
    return { error: error.message }
  }

  return { data }
}
```

### POST request with JSON body

```typescript
export async function createUser(session: CustomSession | null, userData: UserData) {
  const { data, error } = await apiRequestWithAuth(session, `${APIUrl}/users`, {
    method: 'POST',
    body: userData,
  })

  if (error) {
    return { error: error.message }
  }

  return { data }
}
```

### POST request with FormData

```typescript
export async function uploadFile(session: CustomSession | null, formData: FormData) {
  const { data, error } = await apiRequestWithAuth(session, `${APIUrl}/upload`, {
    method: 'POST',
    body: formData, // FormData is detected automatically
  })

  if (error) {
    return { error: error.message }
  }

  return { data }
}
```

### PUT/PATCH request

```typescript
export async function updateTag(session: CustomSession | null, tagId: string, updates: Partial<Tag>) {
  const { data, error } = await apiRequestWithAuth(session, `${APIUrl}/tags/${tagId}`, {
    method: 'PATCH',
    body: updates,
  })

  if (error) {
    return { error: error.message }
  }

  return { data }
}
```

### DELETE request

```typescript
export async function deleteTag(session: CustomSession | null, tagId: string) {
  const { data, error } = await apiRequestWithAuth(session, `${APIUrl}/tags/${tagId}`, {
    method: 'DELETE',
  })

  if (error) {
    return { error: error.message }
  }

  return { data }
}
```

## Error handling

The wrapper automatically handles common HTTP errors:

| Status | Error name         | Description                          |
| ------ | ------------------ | ------------------------------------ |
| 400    | BadRequest         | Invalid request data                 |
| 401    | Unauthorized       | No authorization or token is invalid |
| 403    | Forbidden          | Insufficient access rights           |
| 404    | NotFound           | Resource not found                   |
| 409    | Conflict           | Data conflict (e.g., duplicate)      |
| 422    | ValidationError    | Data validation error                |
| 500    | ServerError        | Internal server error                |
| 502    | BadGateway         | Gateway returned an error            |
| 503    | ServiceUnavailable | Service unavailable                  |

## Logging

All requests are logged automatically:

```typescript
// Successful request
logger.info('API request successful', {
  url: 'https://api.example.com/tags',
  method: 'POST',
  status: 200,
  userId: 'user@example.com',
})

// Failed request
logger.error('API request failed', {
  url: 'https://api.example.com/tags',
  method: 'POST',
  status: 401,
  error: { message: 'Unauthorized' },
  userId: 'user@example.com',
})
```

## Security

### Automatic checks:

1. ✅ **Authentication check** - request won't run without a session
2. ✅ **Token check** - request won't run without an OAuth token
3. ✅ **Safe headers** - use of the Headers API to prevent injection

### Added automatically:

```typescript
headers: {
  'Authorization': `Bearer ${session.OAuthToken}`,
  'Content-Type': 'application/json' // for JSON body
}
```

## Migration from old code

### Before:

```typescript
export async function addTag(user: CustomUser, tag: Tag) {
  if (user && user.role === Roles.ADMIN) {
    try {
      const response = await fetch(`${APIUrl}/tags`, {
        method: 'POST',
        body: JSON.stringify({ key, translations }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })

      if (!response.ok) {
        // A lot of code for error handling...
      }

      console.log(`Tag ${key} successfully added`)
    } catch (err) {
      console.log('error', err)
    }
  }
}

// Called in component
if (session?.user) {
  await addTag(session.user, tag)
}
```

### After:

```typescript
export async function addTag(session: CustomSession | null, tag: Tag) {
  const { data, error } = await apiRequestWithAuth(session, `${APIUrl}/tags`, {
    method: 'POST',
    body: { key: tag.key, translations: tag.translations },
  })

  if (error) {
    logger.error('Failed to add tag', { error, tagKey: tag.key })
    return { error: error.message }
  }

  logger.info('Tag successfully added', { tagKey: tag.key })
  return { data }
}

// Called in component
if (session) {
  const result = await addTag(session, tag)
}
```

## Best Practices

1. **Always check errors**:

   ```typescript
   const { data, error } = await apiRequestWithAuth(...)
   if (error) {
     // Handle error
   }
   ```

2. **Use TypeScript generics**:

   ```typescript
   const { data, error } = await apiRequestWithAuth<Tag[]>(session, url)
   // data has type Tag[] | undefined
   ```

3. **Log important events**:

   ```typescript
   if (error) {
     logger.error('Operation failed', { error, context: {...} })
   } else {
     logger.info('Operation successful', { context: {...} })
   }
   ```

4. **Return a standard format**:

   ```typescript
   return { data } // or return { error: error.message }
   ```

5. **Pass the whole session object**:

   ```typescript
   // ✅ Correct
   await addTag(session, tag)

   // ❌ Incorrect
   await addTag(session.user, tag)
   ```
