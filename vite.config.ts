import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/Skull-king-score/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['skull-mark.svg'],
      manifest: {
        name: 'Skull King Score',
        short_name: 'Skull Score',
        description: 'Compteur de points local-first pour Skull King',
        theme_color: '#172126',
        background_color: '#f3f0e8',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'skull-mark.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'skull-mark.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
