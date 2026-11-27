import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.avastrovibe.app',
  appName: 'AV Astro Vibe',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
    backgroundColor: '#fdf6e7',
  },
};

export default config;
