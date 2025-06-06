import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.svg', 'robots.txt', 'models/**'], // Cache model files
    //   manifest: {
    //     name: 'Face Attendance App',
    //     short_name: 'Attendance',
    //     start_url: '/',
    //     display: 'standalone',
    //     background_color: '#ffffff',
    //     theme_color: '#000000',
    //     icons: [
    //       {
    //         src: 'icon-192.png',
    //         sizes: '192x192',
    //         type: 'image/png'
    //       },
    //       {
    //         src: 'icon-512.png',
    //         sizes: '512x512',
    //         type: 'image/png'
    //       }
    //     ]
    //   },
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,png,svg,json,webmanifest}', 'models/**'],
    //   }
    // })
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000/",
        secure: true,
        changeOrigin: true,
      },
    },
  },
})
