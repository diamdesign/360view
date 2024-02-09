import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const labelContainerElem = document.querySelector("#labels");

// Set up Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a video element
const video = document.createElement("video");
video.src =
	"ayutthaya_-_needs_stabilization_and_horizon_correction___360_vr_master_series___free_download (1080p).mp4";
video.crossOrigin = "anonymous";
video.loop = true;
video.muted = false;
video.playsInline = true;
video.load();
video.play();

// Create a texture from the video element
const texture = new THREE.VideoTexture(video);
texture.encoding = THREE.LinearEncoding;
texture.needsUpdate = true; // Update the texture
texture.wrapS = THREE.RepeatWrapping;
texture.repeat.x = -1; // Flip texture horizontally
texture.mapping = THREE.UVMapping; // Apply UV mapping
texture.encoding = THREE.sRGBEncoding; // Set texture encoding to sRGB
texture.gammaFactor = 2.2; // Adjust gamma correction (e.g., 2.2 for typical images)

// Create a sphere geometry for the 360 photo
const geometry = new THREE.SphereGeometry(100, 80, 80); // Increase the radius to 10

const material = new THREE.MeshStandardMaterial({
	map: texture,
	side: THREE.DoubleSide,
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Create ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Reduce intensity
scene.add(ambientLight);

// Create directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Reduce intensity
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Add mouse controls to the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = -1;

// Set camera position
camera.position.set(0, 0, 1); // Move the camera further from the object
controls.minDistance = 0.1; // Set a minimum zoom distance that allows zooming in closer
controls.maxDistance = 50; // Set maximum zoom distance
controls.zoomSpeed = 10; // Adjust zoom speed

// Create a helper object to track the position in front of the camera
const lightHelper = new THREE.Object3D();
camera.add(lightHelper);

// Update the light's position relative to the helper object
const lightDistance = 1; // Distance from camera to light
lightHelper.position.set(0, 0, lightDistance);
directionalLight.position.setFromMatrixPosition(lightHelper.matrixWorld);

function animate() {
	requestAnimationFrame(animate);
	controls.update(); // Update mouse controls

	// Update the light's position relative to the helper object
	directionalLight.position.setFromMatrixPosition(lightHelper.matrixWorld);

	renderer.render(scene, camera);
}
animate();

document.addEventListener("DOMContentLoaded", function () {
	// Get all the <li> elements
	const listItems = document.querySelectorAll("li");
	// Add click event listener to each <li> element
	listItems.forEach(function (item) {
		item.addEventListener("click", function () {
			// Get the value of the data-image attribute

			listItems.forEach((item) => {
				item.classList.remove("active");
			});

			item.classList.add("active");
			const videoId = item.getAttribute("data-image");

			// Call a function to change the 360 image based on the imageId
			change360Video(videoId);
		});
	});

	// Function to change the 360 image
	function change360Video(videoId) {
		// Load the new image based on the imageId
		const textureLoader = new THREE.videoTexture();

		const texture = loader.load(`${videoId}.jpg`, function (texture) {
			texture.wrapS = THREE.RepeatWrapping;
			texture.repeat.x = -1; // Flip texture horizontally
			texture.mapping = THREE.UVMapping; // Apply UV mapping
			texture.encoding = THREE.sRGBEncoding; // Set texture encoding to sRGB
			texture.gammaFactor = 2.2; // Adjust gamma correction (e.g., 2.2 for typical images)
		});

		// Assuming sphere is the mesh representing the 360 image
		// Update the texture of the sphere mesh
		sphere.material.map = texture;
		sphere.material.needsUpdate = true;
	}
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

const scrollableContent = document.getElementById("locations");

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
