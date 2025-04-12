const defaultTheme = require('tailwindcss/defaultTheme');
const { heroui } = require("@heroui/react");

/** @type { import('tailwindcss').Config } */
export default {
	content: [
		"./index.html",
    	"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
	],
	theme: {
		extend: {
			fontFamily: {
				'mono': [ '"JetBrains Mono Variable"', ...defaultTheme.fontFamily.mono ]
			},
			colors: {
				primary: 'var(--color-primary)',
				secondary: 'var(--color-secondary)',
				accent: {
					'50': '#f0f8ff',
					'100': '#e0f0fe',
					'200': '#b9e3fe',
					'300': '#7ccdfd',
					'400': '#36b4fa',
					'500': '#0c9beb',
					'600': '#0080d2',
					'700': '#0161a3',
					'800': '#065386',
					'900': '#0b456f',
					'950': '#072c4a'
				},
				'link-water': {
					'50': '#f3f6fa',
					'100': '#e3e8f2',
					'200': '#d8deed',
					'300': '#c1c9e0',
					'400': '#a7b0d2',
					'500': '#9097c4',
					'600': '#787ab3',
					'700': '#66689c',
					'800': '#54567f',
					'900': '#484a67',
					'950': '#2a2b3c'
				},
				bunker: {
					'50': '#f6f7f9',
					'100': '#eceef2',
					'200': '#d4d8e3',
					'300': '#afb7ca',
					'400': '#8390ad',
					'500': '#637294',
					'600': '#4f5b7a',
					'700': '#414a63',
					'800': '#383f54',
					'900': '#323848',
					'925': '#212430',
					'950': '#15171e'
				},
				mercury: {
					'50': '#f6f6f8',
					'100': '#e6e6ea',
					'200': '#dcdce1',
					'300': '#c3c4cd',
					'400': '#a6a6b4',
					'500': '#9190a1',
					'600': '#817f91',
					'700': '#757283',
					'800': '#63606d',
					'900': '#504f59',
					'950': '#343338'
				}
			}
		}
	},
	plugins: [ heroui() ]
};