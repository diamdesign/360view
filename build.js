const fs = require("fs");
const terser = require("terser");

// Minify 360.js
minifyFile("js/360.js", "js/360.min.js");

// Minify functions.js
minifyFile("js/functions.js", "js/functions.min.js");

minifyFile("js/comments.js", "js/comments.min.js");

// Minify 360template.js
minifyFile("js/360template.js", "js/360template.min.js");

function minifyFile(inputFilePath, outputFilePath) {
	// Read the source JavaScript file
	const code = fs.readFileSync(inputFilePath, "utf8");

	// Minify the JavaScript code
	terser
		.minify(code)
		.then((result) => {
			// Write the minified code to a new file
			fs.writeFileSync(outputFilePath, result.code);
			console.log(`Minification complete! Output saved to ${outputFilePath}`);
		})
		.catch((error) => {
			console.error(`Error minifying JavaScript in ${inputFilePath}:`, error);
		});
}
