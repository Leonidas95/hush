import './ui/styles.css';
import { UIProvider } from './ui/index';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { registerServiceWorker } from './register-sw';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<UIProvider mode="dark">
			<App />
		</UIProvider>
	</StrictMode>,
);

registerServiceWorker();
