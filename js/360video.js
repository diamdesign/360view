import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scrollableContent = document.querySelector("#scrollable");
const labelContainerElem = document.querySelector("#labels");

// Function to extract and display the first frame of the video as an image
function extractVideoFrame(videoUrl, callback) {
	var video = document.createElement("video");
	video.crossOrigin = "anonymous"; // Allow cross-origin access to video
	video.src = "video/" + videoUrl;

	video.onloadedmetadata = function () {
		// Set the playback time to 10 seconds
		video.currentTime = 10; // Adjust as needed

		video.onseeked = function () {
			// Capture the frame at the current time (10 seconds)
			var canvas = document.createElement("canvas");
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

			// Convert the canvas to a data URL (JPEG format)
			var imageUrl = canvas.toDataURL("image/jpeg"); // Specify JPEG format

			// Call the callback function with the data URL
			callback(imageUrl);
		};
	};
}

var videoArray = [
	{
		id: 1,
		image: "360_vr_master_series___free_asset_download____bavarian_alps_wimbachklamm (1080p).mp4",
		title: "Bavarian Alps",
	},

	{
		id: 2,
		image: "ayutthaya_-_needs_stabilization_and_horizon_correction___360_vr_master_series___free_download (1080p).mp4",
		title: "Ayutthaya",
	},
	{
		id: 3,
		image: "ayutthaya_-_easy_tripod_paint___360_vr_master_series___free_download (1080p).mp4",
		title: "Ayutthaya Two",
	},
	{
		id: 4,
		image: "360_vr_master_series___free_download___london_park_ducks_swans (1080p).mp4",
		title: "London Park",
	},
	{
		id: 5,
		image: "360_vr_master_series___free_download___london_on_tower_bridge (1080p).mp4",
		title: "London Tower Bridge",
	},
];
let promises = [];

// Create a promise for the first item
let firstPromise = new Promise((resolve) => {
	let isFirst = true;
	extractVideoFrame(videoArray[0].image, function (imageUrl) {
		let activeClass = isFirst ? "active" : "";
		let itemHtml = `<li class="${activeClass}" data-image="${videoArray[0].image}" data-id="${videoArray[0].id}">
                            <div>${videoArray[0].title}</div>
                            <img src="${imageUrl}" alt="" />
                        </li>`;
		isFirst = false; // Set isFirst to false after the first iteration
		resolve(itemHtml);
	});
});

promises.push(firstPromise); // Push the first promise

// Create promises for the remaining items
for (let i = 1; i < videoArray.length; i++) {
	let promise = new Promise((resolve) => {
		extractVideoFrame(videoArray[i].image, function (imageUrl) {
			let itemHtml = `<li data-image="${videoArray[i].image}" data-id="${videoArray[i].id}">
                                <div>${videoArray[i].title}</div>
                                <img src="${imageUrl}" alt="" />
                            </li>`;
			resolve(itemHtml);
		});
	});
	promises.push(promise);
}

Promise.all(promises).then((htmlArray) => {
	let locationHtml = htmlArray.join("");
	const locationElem = document.querySelector("#locations ul");
	locationElem.innerHTML = locationHtml;

	const listItems = document.querySelectorAll("#locations li");
	// Add click event listener to each <li> element
	listItems.forEach(function (item) {
		item.addEventListener("click", function () {
			listItems.forEach((item) => {
				item.classList.remove("active");
			});

			item.classList.add("active");
			const videoId = item.getAttribute("data-image");
			// Call a function to change the 360 image based on the imageId
			change360Video(videoId);
		});
	});
});

// Set up Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a video element
const video = document.createElement("video");
video.src = "video/" + videoArray[0].image;
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

let ambientIntensity = 4;
let ambientLight;
// Function to update ambient light intensity
function updateLight(intensity) {
	ambientIntensity = intensity;

	if (ambientLight) {
		scene.remove(ambientLight); // Remove existing ambient light from the scene
	}
	ambientLight = new THREE.AmbientLight(0xffffff, intensity); // Create new ambient light
	scene.add(ambientLight); // Add new ambient light to the scene
}

updateLight(4);

/*
// Create directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Reduce intensity
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);
*/

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

/*
// Update the light's position relative to the helper object
const lightDistance = 1; // Distance from camera to light
lightHelper.position.set(0, 0, lightDistance);
directionalLight.position.setFromMatrixPosition(lightHelper.matrixWorld);
*/

// Store the initial camera rotation and position
const initialCameraRotation = camera.rotation.clone();
const initialCameraPosition = camera.position.clone();

// Function to reset the camera rotation and position to its initial state
function resetCameraRotation() {
	const initialRotation = new THREE.Quaternion().setFromEuler(camera.rotation.clone());
	const targetRotation = new THREE.Quaternion().setFromEuler(initialCameraRotation.clone());

	// Interpolate between the current position and the initial position
	const initialPos = camera.position.clone();
	const targetPos = initialCameraPosition.clone();

	const duration = 1000; // Duration of the animation in milliseconds
	const startTime = performance.now(); // Get the start time of the animation

	function updateCameraRotation() {
		const currentTime = performance.now(); // Get the current time
		const elapsedTime = currentTime - startTime; // Calculate elapsed time
		const t = Math.min(elapsedTime / duration, 1); // Calculate progress (clamped to 1)

		// Interpolate rotation between initial and target rotations
		camera.quaternion.slerpQuaternions(initialRotation, targetRotation, t);

		// Interpolate position between initial and target positions
		camera.position.lerpVectors(initialPos, targetPos, t);

		// Update controls target to keep it in sync with camera rotation
		controls.target
			.copy(camera.position)
			.add(new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion));

		// Update angle indicator rotation based on camera rotation
		const azimuthalAngle = Math.atan2(camera.position.x, camera.position.z);
		angleIndicator.style.transform = `translate(-50%, -50%) rotate(${azimuthalAngle}rad)`;

		// If animation is not completed, request the next frame
		if (elapsedTime < duration) {
			requestAnimationFrame(updateCameraRotation);
		}
	}

	// Start the animation
	updateCameraRotation();
}

// Function to create and update the angle indicator
function createAngleIndicator() {
	const angleIndicator = document.createElement("div");
	angleIndicator.id = "angleIndicator";
	angleIndicator.textContent = "↑"; // Add an arrow on top
	document.body.appendChild(angleIndicator);

	// Add click event listener
	angleIndicator.addEventListener("click", () => {
		// Reset the camera rotation to its initial state
		resetCameraRotation();
	});

	return angleIndicator;
}

const angleIndicator = createAngleIndicator();

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	// directionalLight.position.setFromMatrixPosition(lightHelper.matrixWorld);
	renderer.render(scene, camera);

	// Calculate azimuthal angle
	const azimuthalAngle = Math.atan2(camera.position.x, camera.position.z);

	// Update angle indicator rotation
	angleIndicator.style.transform = `translate(-50%, -50%) rotate(${azimuthalAngle}rad)`;
}
animate();

document.addEventListener("DOMContentLoaded", function () {
	// Get all the <li> elements
	// Function to change the 360 image
});

// Initialize currentVideoSrc with the URL of the initial video
let currentVideoSrc = videoArray[0].image;

function change360Video(videoId) {
	// Check if the videoId is the same as the current video
	if (currentVideoSrc === videoId) {
		return; // No need to change the video if it's the same
	}

	// Update the src attribute of the existing video element
	video.src = "video/" + videoId;
	video.load();
	video.play();

	// Update the current video source
	currentVideoSrc = "video/" + videoId;

	// Update the texture with the new video source
	texture.needsUpdate = true;
}

// Refresh the canvas on window resize
window.addEventListener("resize", function (event) {
	// Update camera aspect ratio
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	// Update renderer size
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);

	// Render the scene
	renderer.render(scene, camera);
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
