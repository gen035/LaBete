# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Swell product sourcing

Non-production deployments can read inactive and published Swell products together through the server-side Backend API. Configure these variables in every non-production deployment:

- `SWELL_STORE_ID` and `SWELL_PUBLIC_KEY` for the existing storefront client.
- `SWELL_SECRET_KEY` for authenticated Backend API reads.

The Backend API path is enabled automatically when `VERCEL_ENV` is not `production` (for example, `preview`). Production deployments use Swell's public Frontend API and only published products are returned; the secret is never included in public runtime configuration.

## Branching workflow

Feature branches start from `staging`:

```bash
git switch --create <feature-name> staging
```

Open feature pull requests against `staging`, and merge only completed and validated feature work into `staging`. After staging validation, promote `staging` → `master` through a pull request. Never target feature branches directly at `master`.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

For Vercel deployments, the Nitro server build inlines `unhead` so the serverless function does not depend on runtime package installation.
