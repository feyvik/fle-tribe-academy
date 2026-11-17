import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
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

/** The security headers from vercel.json, so `npm run preview` behaves like the live site (one place to edit them). */
function liveHeaders(): Record<string, string> {
  const config = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8'))
  const all = config.headers?.find((h: { source: string }) => h.source === '/(.*)')?.headers ?? []
  return Object.fromEntries(all.map((h: { key: string; value: string }) => [h.key, h.value]))
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), siteUrl(mode)],
  preview: { headers: liveHeaders() },
  build: {
    rollupOptions: {
      output: {
        // Libraries change rarely, so keep them in their own files: returning visitors re-download only the app code.
        manualChunks: {
          react: ['react', 'react-dom', 'react-dom/client', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
}))
