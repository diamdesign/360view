import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

var sceneType = "image";

const viewElem = document.getElementById("view-container");
const zoomLevel = document.querySelector("#zoombtn");
const zoomLevelInput = document.querySelector("#zoomlevel");
const mapButton = document.querySelector("#mapbtn");
const fullscreenButton = document.querySelector("#fullscreenbtn");
const locationsElem = document.getElementById("locations");
const angleIndicator = document.getElementById("angleIndicator");
const locationsIndicatorElem = document.querySelector("#indicatorbtn");

locationsIndicatorElem.addEventListener("click", () => {
	const scrollableBottom = parseFloat(locationsElem.style.bottom);
	if (scrollableBottom === 0) {
		locationsElem.style.bottom = "-175px";
		locationsIndicatorElem.classList.remove("rotate180");
	} else {
		locationsIndicatorElem.classList.add("rotate180");
		locationsElem.style.bottom = "0";
	}
});

const scrollableContent = document.querySelector("#scrollable");
const labelContainerElem = document.querySelector("#labels");

const settingsElem = document.querySelector("#settings");
const settingsBrightness = document.getElementById("brightness");
const settingsContrast = document.getElementById("contrast");
const settingsSaturate = document.getElementById("saturation");
const settingsAmbient = document.getElementById("ambient");
const settingsVolume = document.getElementById("volume");
const settingsBrightnessNo = document.getElementById("brightnessNo");
const settingsContrastNo = document.getElementById("contrastNo");
const settingsSaturateNo = document.getElementById("saturationNo");
const settingsAmbientNo = document.getElementById("ambientNo");
const settingsVolumeNo = document.getElementById("volumeNo");

const settingsButton = document.querySelector(".settingsbtn");
const resetButton = document.getElementById("reset");
const closeSettingsButton = document.querySelector(".closebtn");

function viewContainerFadeIn() {
	locationsElem.style.opacity = "1";
	angleIndicator.style.opacity = "1";
	settingsButton.style.opacity = "1";
	zoomLevel.style.opacity = "1";
	mapButton.style.opacity = "1";
	fullscreenButton.style.opacity = "1";
}

function viewContainerFadeOut() {
	locationsElem.style.opacity = "0";
	angleIndicator.style.opacity = "0";
	settingsButton.style.opacity = "0";
	zoomLevel.style.opacity = "0";
	mapButton.style.opacity = "0";
	fullscreenButton.style.opacity = "0";
}

viewContainerFadeIn();

let idleTimeout;
idleTimeout = setTimeout(() => {
	// Fade out the view container after 7 seconds of inactivity
	viewContainerFadeOut();
}, 7000);

// Add mousemove event listener to the document
document.addEventListener("mousemove", function (event) {
	clearTimeout(idleTimeout);

	// If view container is not fully visible, fade it in
	if (zoomLevel.style.opacity !== "1") {
		viewContainerFadeIn();
	}

	// Set a new idle timeout
	idleTimeout = setTimeout(() => {
		// Fade out the view container after 7 seconds of inactivity
		viewContainerFadeOut();
	}, 7000);
});

settingsButton.addEventListener("click", () => {
	settingsElem.style.right = "0px";
	settingsButton.style.opacity = "0";
});

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

var contentArray = [
	{
		id: 1,
		type: "image",
		file: "360.jpg",
		title: "One",
	},
	{
		id: 2,
		type: "image",
		file: "3602.jpg",
		title: "Two",
	},
	{
		id: 3,
		type: "image",
		file: "3603.jpg",
		title: "Three",
	},
	{
		id: 4,
		type: "image",
		file: "3604.jpg",
		title: "Four",
	},
	{
		id: 5,
		type: "image",
		file: "3605.jpg",
		title: "Five",
	},
	{
		id: 6,
		type: "image",
		file: "3606.jpg",
		title: "Six",
	},
	{
		id: 7,
		type: "image",
		file: "3607.jpg",
		title: "Seven",
	},
	{
		id: 8,
		type: "video",
		file: "360_vr_master_series___free_asset_download____bavarian_alps_wimbachklamm (1080p).mp4",
		title: "Bavarian Alps",
	},
	{
		id: 9,
		type: "video",
		file: "ayutthaya_-_needs_stabilization_and_horizon_correction___360_vr_master_series___free_download (1080p).mp4",
		title: "Ayutthaya",
	},
	{
		id: 10,
		type: "video",
		file: "ayutthaya_-_easy_tripod_paint___360_vr_master_series___free_download (1080p).mp4",
		title: "Ayutthaya Two",
	},
	{
		id: 11,
		type: "video",
		file: "360_vr_master_series___free_download___london_park_ducks_swans (1080p).mp4",
		title: "London Park",
	},
	{
		id: 12,
		type: "video",
		file: "360_vr_master_series___free_download___london_on_tower_bridge (1080p).mp4",
		title: "London Tower Bridge",
	},
	{
		id: 13,
		type: "video",
		file: "360_vr_master_series___free_download___crystal_shower_falls (1080p).mp4",
		title: "Crystal Shower Falls",
	},
];

let promises = [];

const locationsUl = locationsElem.querySelector(".container ul");
contentArray.forEach((item) => {
	item = "<li></li>";
	locationsUl.insertAdjacentHTML("afterbegin", item);
});

let perspective = 75;
// Set up Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	perspective,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
const renderer = new THREE.WebGLRenderer({ alpha: false });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a promise for the first item
let firstPromise = new Promise((resolve) => {
	let isFirst = true;
	if (contentArray[0].type === "video") {
		sceneType = "video";
		extractVideoFrame(contentArray[0].file, function (imageUrl) {
			let activeClass = isFirst ? "active" : "";
			let itemHtml = `<li class="${activeClass}" data-file="${contentArray[0].file}" data-id="${contentArray[0].id}" data-type="${contentArray[0].type}">
                                <span class="icon-video"></span>
                                <div>${contentArray[0].title}</div>
                                <img src="${imageUrl}" alt="" />
                            </li>`;
			isFirst = false; // Set isFirst to false after the first iteration
			resolve(itemHtml);
		});
	} else {
		sceneType = "image";
		let activeClass = isFirst ? "active" : "";
		let itemHtml = `<li class="${activeClass}" data-file="${contentArray[0].file}" data-id="${contentArray[0].id}" data-type="${contentArray[0].type}">
                            <div>${contentArray[0].title}</div>
                            <img src="img/${contentArray[0].file}" alt="" />
                        </li>`;
		isFirst = false; // Set isFirst to false after the first iteration
		resolve(itemHtml);
	}
});

promises.push(firstPromise); // Push the first promise

// Create promises for the remaining items
for (let i = 1; i < contentArray.length; i++) {
	let promise = new Promise((resolve) => {
		if (contentArray[i].type === "video") {
			extractVideoFrame(contentArray[i].file, function (imageUrl) {
				let itemHtml = `<li data-file="${contentArray[i].file}" data-id="${contentArray[i].id}" data-type="${contentArray[i].type}">
                                    <span class="icon-video"></span>
                                    <div>${contentArray[i].title}</div>
                                    <img src="${imageUrl}" alt="" />
                                </li>`;
				resolve(itemHtml);
			});
		} else {
			let itemHtml = `<li data-file="${contentArray[i].file}" data-id="${contentArray[i].id}" data-type="${contentArray[i].type}">
                                <div>${contentArray[i].title}</div>
                                <img src="img/${contentArray[i].file}" alt="" />
                            </li>`;
			resolve(itemHtml);
		}
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
			const fileName = item.getAttribute("data-file");
			const fileType = item.getAttribute("data-type");
			// Call a function to change the 360 content based on the file name and type
			change360Content(fileName, fileType);
		});
	});
});

// Create a video element
const video = document.createElement("video");

// Initialize currentVideoSrc with the URL of the initial video
let currentVideoSrc;
let texture;

function change360Content(fileName, fileType) {
	if (fileType === "video") {
		// Check if the videoId is the same as the current video
		if (currentVideoSrc === fileName) {
			return; // No need to change the video if it's the same
		}
		sceneType = "video";
		// Remove the previous texture
		sphere.material.map = null;
		// Pause and remove the current video
		video.pause();
		video.src = "";
		currentVideoSrc = "";

		// Update the src attribute of the video element
		video.src = "video/" + fileName;
		video.load();
		video.crossOrigin = "anonymous";
		video.loop = true;
		video.playsInline = true;
		video.play();

		// Update the current video source
		currentVideoSrc = "video/" + fileName;

		// Create a texture from the video element
		texture = new THREE.VideoTexture(video);
		texture.encoding = THREE.LinearEncoding;
		texture.needsUpdate = true; // Update the texture
		texture.wrapS = THREE.RepeatWrapping;
		texture.repeat.x = -1; // Flip texture horizontally
		texture.mapping = THREE.UVMapping; // Apply UV mapping
		texture.encoding = THREE.sRGBEncoding; // Set texture encoding to sRGB
		texture.gammaFactor = 2.2; // Adjust gamma correction (e.g., 2.2 for typical images)
		// Update the texture with the new video source
		sphere.material.map = texture;
		sphere.material.needsUpdate = true;
	} else if (fileType === "image") {
		sceneType = "image";

		// Remove the previous texture
		sphere.material.map = null;
		// Create a black texture
		// Pause and remove the current video
		video.pause();
		video.src = "";
		currentVideoSrc = "";

		// Load the new image based on the fileName
		const loader = new THREE.TextureLoader();
		const newTexture = loader.load(`img/${fileName}`, function (texture) {
			texture.wrapS = THREE.RepeatWrapping;
			texture.repeat.x = -1; // Flip texture horizontally
			texture.mapping = THREE.UVMapping; // Apply UV mapping
			texture.encoding = THREE.sRGBEncoding; // Set texture encoding to sRGB
			texture.gammaFactor = 2.2; // Adjust gamma correction (e.g., 2.2 for typical images)
		});

		// Assuming sphere is the mesh representing the 360 image
		// Update the texture of the sphere mesh
		sphere.material.map = newTexture;
		sphere.material.needsUpdate = true;
	} else {
		console.log("Invalid file type");
	}
}

// Create a sphere geometry for the 360 photo
const geometry = new THREE.SphereGeometry(360, 180, 180); // Increase the radius to 10

// Create a black texture
const blackTexture = new THREE.DataTexture(
	new Uint8Array([0, 0, 0]), // RGB values for black
	1, // Width
	1, // Height
	THREE.RGBFormat // Format
);
blackTexture.needsUpdate = true; // Ensure texture is updated

// Create material with the black texture
const material = new THREE.MeshStandardMaterial({
	map: blackTexture,
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

updateLight(3.5);

function handleZoom(event) {
	if (isMouseOverScrollableContent(event)) {
		return; // Exit the function early if mouse is over scrollable content
	}
	// Access the zoom speed from controls.zoomSpeed
	const zoomAmount = event.deltaY * zoomSpeed; // Use controls.zoomSpeed instead of zoomSpeed

	// Calculate the perspective change based on the zoom amount and perspective factor
	const perspectiveChange = zoomAmount * perspectiveFactor;

	// Update the perspective by adding the perspective change
	perspective += perspectiveChange;

	// Clamp the perspective value to ensure it stays within a reasonable range
	perspective = Math.max(minPerspective, Math.min(maxPerspective, perspective));

	// Update the camera's perspective
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.fov = perspective;
	camera.updateProjectionMatrix();
}

function isMouseOverScrollableContent(event) {
	// Get the target element of the mouse event
	const target = event.target;

	// Check if the target element or any of its ancestors is the scrollable content
	return target.closest("#scrollable") !== null;
}

document.addEventListener("wheel", handleZoom);

// Add mouse controls to the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = -1;

// Set camera position
camera.position.set(-30, 0, 0); // Move the camera further from the object
controls.minDistance = 30; // Set a minimum zoom distance that allows zooming in closer
controls.maxDistance = 280; // Set maximum zoom distance
controls.zoomSpeed = 3; // Adjust zoom speed

const zoomSpeed = 0.1;
const perspectiveFactor = 0.1; // Adjust perspective factor as needed
const minPerspective = 10; // Adjust minimum perspective value as needed
const maxPerspective = 90;

// Create a helper object to track the position in front of the camera
const lightHelper = new THREE.Object3D();
camera.add(lightHelper);

// Function to create and update the angle indicator
function createAngleIndicator() {
	angleIndicator.textContent = "↑"; // Add an arrow on top
	viewElem.appendChild(angleIndicator);

	// Add click event listener
	angleIndicator.addEventListener("click", () => {
		// Reset the camera rotation to its initial state
		resetCameraRotation();
	});

	return angleIndicator;
}

createAngleIndicator();

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
		const reversedAzimuthalAngle = -azimuthalAngle; // Reverse the azimuthal angle to match the reversed mapping
		angleIndicator.style.transform = `translate(-50%, -50%) rotate(${reversedAzimuthalAngle}rad)`;

		// If animation is not completed, request the next frame
		if (elapsedTime < duration) {
			requestAnimationFrame(updateCameraRotation);
		}
	}

	// Start the animation
	updateCameraRotation();
}
/*
// Create directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Reduce intensity
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Update the light's position relative to the helper object
const lightDistance = 1; // Distance from camera to light
lightHelper.position.set(0, 0, lightDistance);
directionalLight.position.setFromMatrixPosition(lightHelper.matrixWorld);
*/
function animate() {
	requestAnimationFrame(animate);
	controls.update();
	// directionalLight.position.setFromMatrixPosition(lightHelper.matrixWorld);
	renderer.render(scene, camera);

	// Calculate azimuthal angle
	const azimuthalAngle = Math.atan2(camera.position.x, camera.position.z);

	// Reverse the azimuthal angle to match the reversed mapping
	const reversedAzimuthalAngle = -azimuthalAngle;

	// Update angle indicator rotation with the reversed angle
	angleIndicator.style.transform = `translate(-50%, -50%) rotate(${reversedAzimuthalAngle}rad)`;
}
animate();

// Global

// Function to toggle fullscreen mode
function toggleFullscreen() {
	if (!document.fullscreenElement) {
		// If not in fullscreen mode, request fullscreen
		document.documentElement.requestFullscreen();
		fullscreenButton.classList.add("fullscreen");
	} else {
		// If in fullscreen mode, exit fullscreen
		if (document.exitFullscreen) {
			fullscreenButton.classList.remove("fullscreen");
			document.exitFullscreen();
		}
	}
}

// Add event listener for button click
fullscreenButton.addEventListener("click", toggleFullscreen);

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

settingsVolume.addEventListener("input", () => {
	const volume = settingsVolume.value; // Get the volume value from the range input
	video.volume = volume; // Set the volume of the video
	settingsVolumeNo.textContent = volume; // Update value of the corresponding input
});

settingsAmbient.addEventListener("input", () => {
	const value = settingsAmbient.value; // Get the ambient value from the range input
	updateLight(value);
	settingsAmbientNo.textContent = value; // Update value of the corresponding input
});

settingsBrightness.addEventListener("input", () => {
	const c = document.getElementsByTagName("canvas")[0];
	const currentFilter = c.style.filter || "contrast(1) brightness(1) saturate(1)";
	const contrastRegex = /contrast\((\d+(\.\d+)?)\)/;
	const currentContrast = parseFloat(currentFilter.match(contrastRegex)[1]);
	const saturationRegex = /saturate\((\d+(\.\d+)?)\)/;
	const currentSaturation = parseFloat(currentFilter.match(saturationRegex)[1]);
	const brightness = settingsBrightness.value;

	c.style.filter = `contrast(${currentContrast}) brightness(${brightness}) saturate(${currentSaturation})`;
	settingsBrightnessNo.textContent = brightness; // Update value of the corresponding input
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
	settingsContrastNo.textContent = contrast; // Update value of the corresponding input
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
	settingsSaturateNo.textContent = saturation; // Update value of the corresponding input
});

resetButton.addEventListener("click", () => {
	const c = document.getElementsByTagName("canvas")[0];
	c.style.filter = "contrast(1.23) brightness(1) saturate(1.23)";

	settingsAmbient.value = "3.5";
	settingsAmbientNo.textContent = "3.5";
	updateLight(3.5);

	settingsBrightness.value = "1";
	settingsBrightnessNo.textContent = "1";

	settingsContrast.value = "1.23";
	settingsContrastNo.textContent = "1.23";

	settingsSaturate.value = "1.23";
	settingsSaturateNo.textContent = "1.23";

	settingsVolume.value = "1";
	settingsVolumeNo.textContent = "1";
	video.volume = "1";
});

closeSettingsButton.addEventListener("click", () => {
	settingsButton.style.opacity = "1";
	settingsElem.style.right = "-640px";
});

document.addEventListener("DOMContentLoaded", function () {
	// Get all the <li> elements
	// Function to change the 360 image

	function checkFirstListItem() {
		const firstListItem = document.querySelector("#locations ul li:first-child");
		if (firstListItem) {
			const fileType = contentArray[0].type;
			const fileName = contentArray[0].file;
			console.log("First Type:", fileType);
			change360Content(fileName, fileType);
		} else {
			// Retry after a delay if the first list item is not found
			setTimeout(checkFirstListItem, 1000); // Retry after 1 second
		}
	}

	// Start checking for the first list item
	checkFirstListItem();
});
