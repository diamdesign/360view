const fs = require("fs");
const terser = require("terser");

// Read the source JavaScript file
const code = fs.readFileSync("js/360.js", "utf8");

// Minify the JavaScript code
terser
	.minify(code)
	.then((result) => {
		// Write the minified code to a new file
		fs.writeFileSync("dist/360.min.js", result.code);
		console.log("Minification complete! Output saved to dist/360.min.js");
	})
	.catch((error) => {
		console.error("Error minifying JavaScript:", error);
	});
