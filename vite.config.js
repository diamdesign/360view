import { defineConfig } from "vite";
import cssMinimizerPlugin from "css-minimizer-webpack-plugin";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		// Specify the output directory
		outDir: "dist",
		// Specify additional rollup options
		rollupOptions: {
			// Add any rollup output options here
		},
		// Enable or disable CSS code splitting
		cssCodeSplit: true,
		// Enable or disable CSS minification
		cssMinify: "cssnano", // or 'cssnano'
	},
});
