import { defineConfig } from 'vite';
import { version } from '../package.json';

export default defineConfig({
  base: '',

  define: {
    'import.meta.env.VERSION': JSON.stringify(version),
  },
});
