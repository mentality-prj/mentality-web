# Dzvin.co App

## Current engineering direction (October 2026)

The active roadmap is [#482](https://github.com/mentality-prj/mentality-web/issues/482): close critical stabilization work and prioritize end-to-end product functionality over a second broad refactor.

- Runtime: Next.js 16.4 (App Router), React 19.3, TypeScript, next-intl, Jest and Yarn (see package.json).
- Auth: Zitadel with server-owned session and same-origin BFF; domain authorization is enforced by NestJS.
- Features: Mood, Company and Research. Prefer existing shared UI/design-system primitives.
- API: use the existing shared transport and response decoders; do not create a second API client.
- Deployment: reconcile dev and production before release; do not assume a merged dev PR is deployed.
- Quality: focused contract/auth/browser checks for changed behavior; document checks that could not run.


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

You can view the live application at [mentality-web.vercel.app](https://mentality-web.vercel.app).

## Getting Started

First, install the dependencies and start the development server:

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Eslint & Prettier

Use linter to format the code:

```bash
yarn lint
yarn fix

yarn prettier
yarn format
```

### Tests

Check unit tests and coverage:

```bash
yarn test
yarn test:cov
```

Check e2e tests:

```bash
yarn cypress run
yarn cypress open
```

### Feature Docs

- [Company management guide](DOCS/company-management.md)
- [Company management guide (UA)](DOCS/company-management.uk.md)
- [Research workspace and reporting guide](DOCS/research-workspace.md)
- [Research workspace and reporting guide (UA)](DOCS/research-workspace.uk.md)

### Font Optimization

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Commitlint Rules

This project follows specific commit message rules enforced by **commitlint** . Below are the configured rules:

### `type-enum`

Specifies the types of changes allowed in the commit message. These types help categorize commits and maintain a clean history.

- **feat** : New feature
- **fix** : Bug fix
- **docs** : Documentation changes
- **style** : Changes that do not affect the meaning of the code (e.g., white-space, formatting)
- **refactor** : Code changes that neither fix a bug nor add a feature
- **perf** : Performance improvement
- **test** : Adding missing tests or correcting existing tests
- **build** : Changes that affect the build system or external dependencies (e.g., npm)
- **ci** : Changes to CI configuration files and scripts
- **chore** : Other changes that don't modify`src` or`test` files
- **revert** : Reverts a previous commit

### `scope-enum`

Defines the allowed scopes of changes. Scopes are used to specify the area of the project affected by the commit.

- **setup** : Project setup
- **config** : Configuration files
- **deps** : Dependency updates
- **feature** : Feature-specific changes
- **bug** : Bug fixes
- **docs** : Documentation
- **style** : Code style/formatting
- **refactor** : Code refactoring
- **test** : Tests
- **build** : Build scripts or configuration
- **ci** : Continuous integration
- **release** : Release-related changes
- **other** : Other changes

### Example Commit Message

#### Message Writing Pattern

`<type-enum>(<optionally: scope-enum>): <short description>`

#### Examples for a Valid Commit Message

- `feat(navbar): added ability to sort items`

- `feat(setup): add commitlint for commit message validation`

Ensure all commit messages adhere to these rules to maintain consistency and improve project traceability.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
