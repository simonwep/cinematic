import { defineConfig } from 'vite';
import { version } from '../package.json';

export default defineConfig({
  define: {
    'import.meta.env.VERSION': JSON.stringify(version),
  },
});
