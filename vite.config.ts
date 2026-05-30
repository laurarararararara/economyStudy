import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** 开发时：旧 /stories/* 在加载 JS 前就 302 到讲次页 */
const legacyStoryRedirects: Plugin = {
  name: 'legacy-story-redirects',
  configureServer(server) {
    const map: Record<string, string> = {
      '/stories/broken-window': '/lectures/003?view=dialogue',
      '/stories/pow-camp': '/lectures/001?view=dialogue',
      '/stories/pencil-story': '/lectures/007?view=dialogue',
      '/stories/manure-case': '/lectures/002?view=dialogue',
      '/stories/charity-business': '/lectures/008?view=dialogue',
      '/stories/coase-theorem': '/lectures/020?view=dialogue',
      '/stories/spring-festival-tickets': '/lectures/039?view=dialogue',
      '/stories/lighthouse': '/lectures/057?view=dialogue',
      '/stories/lemon-market': '/lectures/079?view=dialogue',
      '/stories/marriage-economics': '/lectures/087?view=dialogue',
    };
    server.middlewares.use((req, res, next) => {
      const path = req.url?.split('?')[0] ?? '';
      const target = map[path];
      if (target) {
        res.statusCode = 302;
        res.setHeader('Location', target);
        res.end();
        return;
      }
      next();
    });
  },
};

export default defineConfig({
  plugins: [react(), legacyStoryRedirects],
});
