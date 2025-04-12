import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [ react() ],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true
			},
			'/user': {
				target: 'http://localhost:8080'
			}
		}
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
			'@api': resolve(__dirname, './src/api'),
			'@assets': resolve(__dirname, './src/assets'),
			'@components': resolve(__dirname, './src/components'),
			'@consts': resolve(__dirname, './src/constants'),
			'@hooks': resolve(__dirname, './src/hooks'),
			'@lib': resolve(__dirname, './src/lib'),
			'@icons': resolve(__dirname, './src/assets/icons'),
			'@pages': resolve(__dirname, './src/pages'),
			'@sections': resolve(__dirname, './src/sections')
		}
	},
	build: {
		minify: 'terser',
		cssMinify: 'lightningcss'
	}
});