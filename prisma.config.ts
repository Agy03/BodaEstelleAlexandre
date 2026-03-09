import path from 'node:path'
import { defineConfig } from 'prisma/config'

// Load .env.local for local Prisma CLI usage (on Vercel, env vars are already set)
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const dotenv = require('dotenv')
  dotenv.config({ path: path.resolve(__dirname, '.env.local') })
} catch {
  // dotenv not available (e.g. on Vercel) — env vars already provided
}

export default defineConfig({
  migrations: {
    seed: 'tsx prisma/seed.ts'
  }
})
