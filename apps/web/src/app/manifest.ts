import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Voeq — Find. Connect. Grow.',
    short_name: 'Voeq',
    description: 'Discover verified campus vendors and connect via WhatsApp. Built for Nigerian students.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F5F0',
    theme_color: '#0F3D2E',
    icons: [
      { src: '/Favicon.png', sizes: '32x32', type: 'image/png' },
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { src: '/Logo.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
