import { createRoot } from 'react-dom/client';
import { HeroUIProvider } from "@heroui/react";

import App from '@/App.jsx';

import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import '@assets/index.css';

createRoot(document.getElementById('root')).render(
	<HeroUIProvider>
		<App />
	</HeroUIProvider>
);