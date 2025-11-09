# User Feedback System

System for displaying user messages + technical logging.

## Concept

**Rule:** If information is important for the user - use `user-feedback`; if
it's only for developers - use `logger`.

```typescript
// ❌ Do NOT use logger for user-facing messages
logger.info('Tag successfully added', { key })

// ✅ Use notifySuccess - will show toast + also log
notifySuccess('Tag successfully added', { key })
```

## Functions

### `notifySuccess(message, context?, options?)`

Shows a green success toast + logs for monitoring

```typescript
import { notifySuccess } from '@/lib/user-feedback'

// Basic usage
notifySuccess('Goal created successfully')

// With technical context (for logs)
notifySuccess('Tag added', { tagId: '123', key: 'health' })

// With custom options
notifySuccess('Saved!', undefined, { duration: 2000, icon: '✅' })
```

### `notifyError(message, error?, context?, options?)`

Shows a red error toast + logs with full stack trace

```typescript
import { notifyError } from '@/lib/user-feedback'

try {
  await updateGoal(id, data)
} catch (error) {
  // Shows error to the user + logs for debugging
  notifyError('Failed to update goal. Please try again.', error, { goalId: id })
}

// For HTTP errors
if (!response.ok) {
  notifyError('You are not authorized. Please log in.', undefined, {
    status: response.status,
  })
}
```

### `notifyWarning(message, context?, options?)`

Shows a yellow warning toast + logs as warning

```typescript
import { notifyWarning } from '@/lib/user-feedback'

// For non-critical issues
if (!response.ok && response.status !== 500) {
  notifyWarning('Failed to load data. Using cached version.', {
    status: response.status,
  })
}
```

### `notifyInfo(message, options?)`

Shows an informational toast WITHOUT logging (for UI feedback)

```typescript
import { notifyInfo } from '@/lib/user-feedback'

// For pure UI feedback without technical meaning
notifyInfo('Form auto-saved')
notifyInfo('Copied to clipboard!', { icon: '📋' })
```

### `notifyPromise(promise, messages, context?)`

Automatic loading → success/error toast for a promise

```typescript
import { notifyPromise } from '@/lib/user-feedback'

const saveGoal = async (data) => {
  return notifyPromise(
    api.saveGoal(data),
    {
      loading: 'Saving goal...',
      success: 'Goal saved successfully!',
      error: 'Failed to save goal',
    },
    { goalId: data.id }
  )
}
```

## Usage examples

### API Requests (tags.ts, tips.ts)

```typescript
try {
  const response = await fetch(`${APIUrl}/tags`, {...})

  if (!response.ok) {
    const errorData = await response.json()

    let errorMessage = 'Failed to add tag'
    switch (response.status) {
      case 401:
        errorMessage = 'You are not authorized. Please log in.'
        break
      case 500:
        errorMessage = 'Server error. Please try again later.'
        break
      default:
        errorMessage = errorData.message || 'Unknown error'
    }

    // Toast for user + log for devs
    notifyError(errorMessage, undefined, {
      key,
      status: response.status
    })
  } else {
    // Toast for user + log for devs
    notifySuccess(`Tag "${key}" successfully added`, { key })
  }
} catch (err) {
  // General network error
  notifyError('Failed to add tag. Please check your connection.', err, { key })
}
```

### Server Actions (personalGoals.action.ts)

```typescript
'use server'

export async function updatePersonalGoal(id: string, data: GoalData) {
  try {
    const response = await axios.patch(`${APIUrl}/goals/${id}`, data)

    // Only technical logging (no toast, because this is a server action)
    logger.info('Goal updated', { goalId: id })

    return response.data
  } catch (error) {
    // Logging for debugging
    logger.error('Failed to update goal', error, { goalId: id })

    // Re-throw so client can show its own toast
    throw error
  }
}
```

**Client-side usage of server action:**

```typescript
'use client'

async function handleUpdate(id: string, data: GoalData) {
  try {
    await updatePersonalGoal(id, data)
    // Here we show a toast to the user
    notifySuccess('Goal updated successfully!')
  } catch (error) {
    notifyError('Failed to update goal', error)
  }
}
```

### Client Components

```typescript
'use client'
import { notifySuccess, notifyError } from '@/lib/user-feedback'

function GoalForm() {
  const handleSubmit = async (data: GoalData) => {
    try {
      await createGoal(data)
      notifySuccess('Goal created successfully!')
      router.push('/goals')
    } catch (error) {
      notifyError('Failed to create goal. Please try again.', error)
    }
  }
}
```

### Form Validation

```typescript
import { notifyWarning } from '@/lib/user-feedback'

function validateForm(data: FormData) {
  if (!data.title) {
    notifyWarning('Please enter a title')
    return false
  }

  if (data.title.length < 3) {
    notifyWarning('Title must be at least 3 characters')
    return false
  }

  return true
}
```

## When to use what

### ✅ Use `notifySuccess`

- Successful data save
- Successful create/update/delete
- Completion of an important operation
- User action confirmation

### ✅ Use `notifyError`

- API errors (401, 403, 500, etc.)
- Network errors
- Backend validation errors
- Critical errors that block user action

### ✅ Use `notifyWarning`

- Non-critical issues
- Deprecated functionality
- Limits (rate limit approaching)
- Fallback to cached data

### ✅ Use `notifyInfo`

- Auto-save notification
- Copy to clipboard
- Keyboard shortcuts hint
- UI tips (no technical meaning)

### ✅ Use `logger` directly (WITHOUT toast)

- Debug information
- Performance metrics
- Technical details not relevant to users
- Internal state changes

## Integration with i18n

```typescript
import { useTranslations } from 'next-intl'
import { notifySuccess } from '@/lib/user-feedback'

function MyComponent() {
  const t = useTranslations('Goals')

  const handleSave = async () => {
    try {
      await saveGoal(data)
      notifySuccess(t('savedSuccessfully'))
    } catch (error) {
      notifyError(t('saveFailed'), error)
    }
  }
}
```

## Customizing Toast

```typescript
// Duration
notifySuccess('Saved!', undefined, { duration: 2000 })

// Icon
notifySuccess('Published!', undefined, { icon: '🚀' })
notifyWarning('Warning!', undefined, { icon: '⚠️' })

// Both
notifyError('Failed!', error, undefined, {
  duration: 5000,
  icon: '❌',
})
```

## Best Practices

### ✅ DO

```typescript
// Show clear messages to the user
notifyError('Failed to save goal. Please try again.')

// Add technical context for debugging
notifyError('Failed to save goal', error, { goalId, userId })

// Use the correct level
notifyWarning('Connection slow. Using cached data.')
```

### ❌ DON'T

```typescript
// Do not show technical details to the user
notifyError('TypeError: Cannot read property "id" of undefined')

// Do not log sensitive data
notifyError('Login failed', undefined, { password: '123' }) // ❌

// Do not show too many toasts
for (let i = 0; i < 100; i++) {
  notifySuccess(`Item ${i} saved`) // ❌ Spam
}

// Do not use console directly
console.log('Tag added') // ❌ Use logger or notifySuccess
```

## Architecture

```
User Action → API Call → Response
                           ↓
                    ┌──────┴──────┐
                    ↓             ↓
              notifySuccess    logger
                    ↓             ↓
              Toast for        Logging
              user             for devs
```

## Migration from console + separate toasts

Was:

```typescript
console.log('Tag added')
toast.success('Tag added')
```

Now:

```typescript
notifySuccess('Tag added', { key })
// Automatically: toast + log
```

Was:

```typescript
console.error('Error:', error)
toast.error('Failed to add tag')
```

Now:

```typescript
notifyError('Failed to add tag', error, { key })
// Automatically: toast + log with full error
```
