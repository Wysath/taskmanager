import createBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer({
  output: 'export',
  
  // Configuration Turbopack (Next.js 16 default)
  turbopack: {
    resolveAlias: {
      '@': './src',
    },
  },

  // Disabled header for security
  poweredByHeader: false,
  
  // Compression (minification JS/CSS est automatique en production)
  compress: true,

  // Optimisation des images
  images: {
    unoptimized: true, // Puisque output: 'export'
  },

  // ⚡ OPTIMISATION AGRESSIVE des imports (Turbopack tree-shaking)
  experimental: {
    optimizePackageImports: [
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/database',
      'lucide-react',
      'react-hot-toast',
      '@dnd-kit/core',
      '@dnd-kit/utilities',
      '@dnd-kit/sortable',
    ],
  },

  // Phase 5 Optimization: Reduce CSS and remove unused CSS
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      // Production client-side optimizations
      config.performance = {
        ...config.performance,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      };
    }
    return config;
  },

  // ⚠️ NOTE: Headers ne fonctionnent pas avec output: 'export'
  // Pour le caching HTTP, utiliser un serveur statique (Netlify, Vercel, nginx, etc.)
  // ou un CDN (Cloudflare) avec les règles de cache appropriées
});



