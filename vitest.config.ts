import { defineConfig } from 'vitest/config';

// The unit suite only reads built files (dist/index.html) and markdown
// frontmatter, so it needs no Astro vite plugins — plain vitest config keeps
// `astro check` happy about the `test` key.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
});
