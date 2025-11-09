# Logger for Next.js Frontend

A simple yet powerful logger for Next.js with SSR/CSR support, automatic
reporting of critical errors to the backend, and environment-aware behavior.

## Features

✅ **Zero dependencies** - pure TypeScript  
✅ **SSR/CSR safe** - works both on server and client  
✅ **Environment aware** - different behavior for dev/production  
✅ **Auto error reporting** - sends critical errors to the backend  
✅ **Structured logging** - context in JSON format  
✅ **Type-safe** - full TypeScript support  
✅ **Tiny bundle** - ~2KB gzipped

## Installation

File already created: `lib/logger.ts`

## Usage

### Basic logging

```typescript
import { logger } from '@/lib/logger'

// Debug (development only)
logger.debug('User data loaded', { userId: '123', items: 5 })

// Info (development only)
logger.info('Payment initiated', { amount: 100, currency: 'USD' })

// Warning (always + sent to backend in production)
logger.warn('API rate limit approaching', { remaining: 10 })

// Error (always + sent to backend)
logger.error('Payment failed', error, { userId: '123', amount: 100 })
```

### Shorthand Functions

```typescript
import { logError, logWarning, logInfo, logDebug } from '@/lib/logger'

logError('Failed to load user', error)
logWarning('Session expires soon')
logInfo('User logged in successfully')
logDebug('Component mounted', { component: 'UserProfile' })
```

### API Request Logging

```typescript
import { logger } from '@/lib/logger'

const startTime = Date.now()

try {
  const response = await fetch('/api/users')
  const duration = Date.now() - startTime

  logger.apiRequest('GET', '/api/users', response.status, duration)
  // Dev: [DEBUG] GET /api/users {status: 200, duration: "45ms"}
} catch (error) {
  logger.error('API request failed', error, { endpoint: '/api/users' })
}
```

### User Action Tracking

```typescript
import { logger } from '@/lib/logger'

// Track user actions (development only)
logger.action('button_clicked', { buttonId: 'checkout', page: 'cart' })
logger.action('form_submitted', { formType: 'registration' })
```

## Behavior per Environment

### Development (`NODE_ENV !== 'production'`)

- Logs all levels (debug, info, warn, error)
- Formats messages with timestamp and context
- Does not send logs to the backend
- Shows full stack traces

### Production (`NODE_ENV === 'production'`)

- Logs only `warn` and `error`
- Automatically sends `error` logs to the backend
- Includes metadata: userAgent, URL, timestamp
- Minimal console output

## Integration with Backend

The logger automatically sends critical errors to your backend:

### Backend Endpoint (example for NestJS)

```typescript
// logs.controller.ts
@Post('logs')
async receiveLogs(@Body() logData: {
  level: string
  message: string
  context: any
  timestamp: string
  userAgent: string
  url: string
}) {
  // Save to DB or forward to Sentry/DataDog
  await this.logsService.create(logData)
  return { status: 'ok' }
}
```

### Format of sent data

```json
{
  "level": "error",
  "message": "Payment processing failed",
  "context": {
    "userId": "123",
    "amount": 100,
    "error": {
      "name": "PaymentError",
      "message": "Insufficient funds",
      "stack": "..."
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "userAgent": "Mozilla/5.0...",
  "url": "https://example.com/checkout"
}
```

## Examples in the project

### 1. OAuth Authentication (auth.ts)

```typescript
try {
  const response = await fetch(`${API_URL}/auth/validate-token`, {...})

  if (response.ok) {
    logger.info('Backend user validated', { userId: backendUserData._id })
  } else {
    logger.warn('Backend user validation failed', { status: response.status })
  }
} catch (error) {
  logger.error('Error getting backend user ID', error)
}
```

### 2. API Requests (requests/tags.ts)

```typescript
try {
  const response = await fetch(`${APIUrl}/tags`, {...})

  if (!response.ok) {
    logger.warn('Failed to add tag', {
      status: response.status,
      error: errorData,
      key
    })
  } else {
    logger.info('Tag successfully added', { key })
  }
} catch (err) {
  logger.error('Failed to add tag', err, { key })
}
```

### 3. Error Boundaries (error.tsx)

```typescript
'use client'
import { logger } from '@/lib/logger'

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    logger.error('React error boundary caught error', error)
  }, [error])

  return <div>Something went wrong</div>
}
```

### 4. Server Actions

```typescript
'use server'
import { logger } from '@/lib/logger'

export async function updateGoal(id: string, data: GoalData) {
  try {
    const result = await db.goals.update(id, data)
    logger.info('Goal updated', { goalId: id })
    return result
  } catch (error) {
    logger.error('Failed to update goal', error, { goalId: id })
    throw error
  }
}
```

## Configuration

The logger auto-configures from environment variables:

```env
# Backend API URL for sending logs
NEXT_PUBLIC_API_URL=https://api.example.com

# Environment (auto-detected by Next.js)
NODE_ENV=production
```

## Comparison with alternatives

| Characteristic    | Custom Logger | Pino  | Winston | Console |
| ----------------- | ------------- | ----- | ------- | ------- |
| Bundle Size       | 2KB           | 50KB+ | 80KB+   | 0KB     |
| SSR Safe          | ✅            | ❌    | ❌      | ✅      |
| Backend Reporting | ✅            | ➖    | ➖      | ❌      |
| Zero Config       | ✅            | ❌    | ❌      | ✅      |
| Type Safety       | ✅            | ➖    | ➖      | ❌      |
| Production Ready  | ✅            | ✅    | ✅      | ❌      |

## Best Practices

### ✅ DO

```typescript
// Add context to logs
logger.error('Payment failed', error, {
  userId: user.id,
  amount: 100,
  paymentMethod: 'card',
})

// Use the correct level
logger.debug('Function called') // Development debugging
logger.info('User action completed') // Important events
logger.warn('Deprecated API used') // Potential issues
logger.error('Critical failure', error) // Real errors
```

### ❌ DON'T

```typescript
// Do not log sensitive data
logger.info('User logged in', {
  password: '123456', // ❌ NEVER
})

// Do not use console directly
console.log('User data:', userData) // ❌ Use the logger

// Do not log too frequently
for (let i = 0; i < 10000; i++) {
  logger.debug(`Processing item ${i}`) // ❌ Performance hit
}
```

## Extension

Easy to extend functionality:

```typescript
// lib/logger.ts
class Logger {
  // Add metrics
  metric(name: string, value: number, tags?: Record<string, string>) {
    if (process.env.NODE_ENV === 'production') {
      // Send to DataDog/CloudWatch
    }
  }

  // Add performance tracking
  performance(action: string, duration: number) {
    this.debug(`Performance: ${action}`, { duration: `${duration}ms` })
  }
}
```

## Migration from console

```bash
# Find all console.log
grep -r "console\." --include="*.ts" --include="*.tsx"

# Replace automatically (example)
sed -i 's/console\.log/logger.info/g' **/*.ts
sed -i 's/console\.error/logger.error/g' **/*.ts
sed -i 's/console\.warn/logger.warn/g' **/*.ts
```

## Troubleshooting

### Logs not being sent to the backend

Make sure that:

1. `NEXT_PUBLIC_API_URL` is set
2. Backend endpoint `/logs` exists
3. CORS is configured correctly
4. `NODE_ENV=production`

### Too many logs in development

```typescript
// Temporarily disable debug logs
const logger = new Logger()
logger.config.minLevel = 'info'
```

## License

MIT - free to use in your project
