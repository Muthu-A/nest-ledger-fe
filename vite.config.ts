import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: {
        enabled: true, // Enables PWA support during development
      },
      manifest: {
        name: "Nest Ledger",
        short_name: "NestLedger",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#1c3829",
       icons: [
  {
    src: "/favicon-32x32.png",
    sizes: "32x32",
    type: "image/png",
  },
  {
    src: "/apple-touch-icon.png",
    sizes: "180x180",
    type: "image/png",
  },
  {
    src: "/pwa-192.png",
    sizes: "192x192",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/notification-icon-192.png",
    sizes: "192x192",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/pwa-512.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/maskable-512.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "maskable",
  },
],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
