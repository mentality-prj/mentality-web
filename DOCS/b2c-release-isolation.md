# B2C-only release isolation (partial implementation)

Set `DZVIN_B2C_ONLY_RELEASE=true` **on the Next.js server deployment** to opt in. It is disabled by default so existing internal B2B/Research environments remain unaffected.

In this mode, authenticated users cannot navigate to the Next.js `/company`, `/admin` or `/research` layouts. The same-origin `/api/backend/*` BFF returns HTTP 404 for privileged company/research/QDIP/decision-support/prediction and operational/team/admin-diagnostics/personal-reporting resource prefixes **before** reading an auth session, forwarding credentials, or contacting NestJS. `requests/dipClient.ts` additionally fails closed with 503 for any server action calling QDIP admin.

Current B2C paths such as `auth/me`, `mood-record`, `mood-story`, `diary`, `goals` and guide exercise APIs retain ordinary NestJS authorization. Avoid using client navigation as a security boundary.

**Not production-certified**: this is a Next.js boundary only. Unqualified B2B endpoints on the NestJS origin must independently deny unauthorized direct access, and any other privileged Next.js API/server actions require inventory and explicit negative tests. Never put an admin API key into public Next.js env vars. Validate mode in the actual deployment, run QA1/QA2 authorized & denied direct POST/GET checks (including Server Actions), review B2C navigation, and reconcile production-only branch changes before promotion (#439, #448, #449). No production deployment has been performed by this PR.
