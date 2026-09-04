export function registerServiceWorker(): void {
	if (import.meta.env.DEV) return;
	if (!('serviceWorker' in navigator)) return;

	window.addEventListener('load', () => {
		const url = `${import.meta.env.BASE_URL}sw.js`;

		navigator.serviceWorker.register(url, { scope: import.meta.env.BASE_URL }).catch((error: unknown) => {
			console.error('Service worker registration failed', error);
		});
	});
}
