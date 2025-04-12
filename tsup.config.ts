import { defineConfig } from 'tsup';

export default defineConfig({
	entry: [ './src/index.ts' ],
	outDir: 'dist',
	format: 'cjs',
	sourcemap: false,
	shims: true,
	skipNodeModulesBundle: true,
	clean: true,
	minify: true
});