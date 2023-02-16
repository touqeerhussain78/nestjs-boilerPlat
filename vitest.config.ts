import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    ...VitePluginNode({
      adapter: 'nest',
      appPath: './src/main.ts',
      tsCompiler: 'swc',
    }),
  ],
  test: {
    threads: false,
    globals: true,
    setupFiles: './test/setup.ts',
    include: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
    coverage: {
      src: ['src'],
      reporter: ['text-summary', 'html-spa', 'clover', 'lcovonly'],
      all: true,
    },
  },
});