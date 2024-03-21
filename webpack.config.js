// webpack.config.js

const path = require("path");

module.exports = {
	mode: "production", // or 'production' for minified output
	entry: "/js/360.min.js",
	// Enable optimization features including tree shaking
	optimization: {
		// Enable module concatenation
		concatenateModules: true,
		// Minimize output JavaScript
		minimize: true,
		// Enable tree shaking
		usedExports: true,
	},
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"), // Output directory
	},
};
