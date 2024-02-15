// webpack.config.js

const path = require("path");

module.exports = {
	mode: "development", // or 'production' for minified output
	entry: "./dist/360.min.js",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"), // Output directory
	},
};
