const scrollableContent = document.getElementById("locations");
const labelContainerElem = document.querySelector("#labels");

function updateScrollableContentStyle(event) {
	const mouseY = event.clientY; // Get the vertical position of the mouse

	// Get the height of the viewport
	const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

	// Define the threshold distance from the bottom
	const threshold = 180;

	// Check if the mouse is within the threshold distance from the bottom
	if (viewportHeight - mouseY < threshold) {
		scrollableContent.style.bottom = "0";
	} else {
		scrollableContent.style.bottom = "-175px";
	}
}

// Add mousemove event listener to the document
document.addEventListener("mousemove", function (event) {
	updateScrollableContentStyle(event);
});

// Add resize event listener to update the style when the window is resized
window.addEventListener("resize", function () {
	updateScrollableContentStyle(event);
});

scrollableContent.addEventListener("wheel", function (event) {
	// Prevent the default scroll behavior
	event.preventDefault();

	// Calculate the amount to scroll
	const scrollAmount = event.deltaY;

	// Adjust the scrollLeft property based on the scroll amount
	scrollableContent.scrollLeft += scrollAmount;
});

let isDragging = false;
let startX;
let scrollLeft;

scrollableContent.addEventListener("mousedown", function (event) {
	// Prevent default click behavior when starting drag
	event.preventDefault();

	isDragging = true;
	startX = event.pageX - scrollableContent.offsetLeft;
	scrollLeft = scrollableContent.scrollLeft;
	scrollableContent.style.cursor = "grabbing"; // Change cursor style
});

scrollableContent.addEventListener("mouseup", function (event) {
	isDragging = false;
	scrollableContent.style.cursor = "grab"; // Restore cursor style
});

scrollableContent.addEventListener("mouseleave", function (event) {
	isDragging = false;
	scrollableContent.style.cursor = "grab"; // Restore cursor style
});

scrollableContent.addEventListener("mousemove", function (event) {
	if (!isDragging) return;
	const x = event.pageX - scrollableContent.offsetLeft;
	const walk = (x - startX) * 3; // Adjust scroll speed
	scrollableContent.scrollLeft = scrollLeft - walk;
});

// Refresh the canvas on window resize
window.addEventListener("resize", function () {
	// Update camera aspect ratio
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	// Update renderer size
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);

	// Render the scene
	renderer.render(scene, camera);
});
