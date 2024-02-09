var threshold = 40;
const locationsElem = document.getElementById("locations");

const settingsBrightness = document.getElementById("brightness");
const settingsContrast = document.getElementById("contrast");
const settingsSaturate = document.getElementById("saturation");
const settingsBrightnessNo = document.getElementById("brightnessNo");
const settingsContrastNo = document.getElementById("contrastNo");
const settingsSaturateNo = document.getElementById("saturationNo");
settingsBrightness.addEventListener("input", () => {
	const c = document.getElementsByTagName("canvas")[0];
	const currentFilter = c.style.filter || "contrast(1) brightness(1) saturate(1)";
	const contrastRegex = /contrast\((\d+(\.\d+)?)\)/;
	const currentContrast = parseFloat(currentFilter.match(contrastRegex)[1]);
	const saturationRegex = /saturate\((\d+(\.\d+)?)\)/;
	const currentSaturation = parseFloat(currentFilter.match(saturationRegex)[1]);
	const brightness = settingsBrightness.value;

	c.style.filter = `contrast(${currentContrast}) brightness(${brightness}) saturate(${currentSaturation})`;
	settingsBrightnessNo.value = brightness; // Update value of the corresponding input
});

settingsContrast.addEventListener("input", () => {
	const c = document.getElementsByTagName("canvas")[0];
	const currentFilter = c.style.filter || "contrast(1) brightness(1) saturate(1)";
	const brightnessRegex = /brightness\((\d+(\.\d+)?)\)/;
	const currentBrightness = parseFloat(currentFilter.match(brightnessRegex)[1]);
	const saturationRegex = /saturate\((\d+(\.\d+)?)\)/;
	const currentSaturation = parseFloat(currentFilter.match(saturationRegex)[1]);
	const contrast = settingsContrast.value;

	c.style.filter = `contrast(${contrast}) brightness(${currentBrightness}) saturate(${currentSaturation})`;
	settingsContrastNo.value = contrast; // Update value of the corresponding input
});

settingsSaturate.addEventListener("input", () => {
	const c = document.getElementsByTagName("canvas")[0];
	const currentFilter = c.style.filter || "contrast(1) brightness(1) saturate(1)";
	const brightnessRegex = /brightness\((\d+(\.\d+)?)\)/;
	const currentBrightness = parseFloat(currentFilter.match(brightnessRegex)[1]);
	const contrastRegex = /contrast\((\d+(\.\d+)?)\)/;
	const currentContrast = parseFloat(currentFilter.match(contrastRegex)[1]);
	const saturation = settingsSaturate.value;

	c.style.filter = `contrast(${currentContrast}) brightness(${currentBrightness}) saturate(${saturation})`;
	settingsSaturateNo.value = saturation; // Update value of the corresponding input
});

function updateScrollableContentStyle(event) {
	const mouseY = event.clientY; // Get the vertical position of the mouse

	// Get the height of the viewport
	const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

	// Get the current style of scrollableContent
	const scrollableBottom = parseFloat(locationsElem.style.bottom);

	// Check if scrollableContent is at bottom: 0
	if (scrollableBottom === 0) {
		threshold = 175;
	} else {
		threshold = 40;
	}

	// Check if the mouse is within the threshold distance from the bottom
	if (viewportHeight - mouseY < threshold) {
		locationsElem.style.bottom = "0";
	} else {
		locationsElem.style.bottom = "-175px";
	}
}

// Add mousemove event listener to the document
document.addEventListener("mousemove", function (event) {
	updateScrollableContentStyle(event);
});
