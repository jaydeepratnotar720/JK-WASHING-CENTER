import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JK WASHING CENTER — Car & Bike Wash Management System',
    short_name: 'JK Washing',
    description: 'Your Car. Your Bike. Our Shine. Premium automobile detailing, booking and business management system.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0e17',
    theme_color: '#0066ff',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
    categories: ['automotive', 'business', 'productivity'],
  };
}
