var threshold = 40;
const locationsElem = document.getElementById("locations");

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
