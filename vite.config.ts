import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/**
 * Fills __SITE_URL__ in index.html (canonical link and social preview tags), which need a full address.
 * Uses VITE_SITE_URL if set (e.g. your own domain), otherwise the production address Vercel provides at build time.
 */
function siteUrl(mode: string): Plugin {
  const env = loadEnv(mode, process.cwd(), '')
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const url = (env.VITE_SITE_URL || (vercel ? `https://${vercel}` : '')).replace(/\/$/, '')
  return { name: 'site-url', transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', url) }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), siteUrl(mode)],
}))
