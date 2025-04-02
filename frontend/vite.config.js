import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		proxy: {
			"/api": {
				target: "http://localhost:8000",
				changeOrigin: true,
				secure: false,
				ws: true, // Enable WebSocket proxying
				configure: (proxy, _options) => {
					proxy.on('error', (err, _req, _res) => {
						console.log('Proxy error:', err);
					});
					proxy.on('proxyReq', (proxyReq, req, _res) => {
						console.log('Proxying request:', req.method, req.url);
						// Forward the cookie header to the target
						if (req.headers.cookie) {
							proxyReq.setHeader('Cookie', req.headers.cookie);
						}
					});
					proxy.on('proxyRes', (proxyRes, req, _res) => {
						console.log('Received response for:', req.url, 'Status:', proxyRes.statusCode);
					});
				}
			},
		},
	},
});
