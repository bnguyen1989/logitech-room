import { visualizer } from 'rollup-plugin-visualizer';

export default {
  server: {
    open: true,
    port: 8000,
    proxy: {
      '/api': 'http://localhost:8080'
    },
    host: '0.0.0.0' // allow external connections
  },
  plugins: [visualizer()]
};
