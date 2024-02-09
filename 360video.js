import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Function to extract and display the first frame of the video as an image
function extractVideoFrame(videoUrl, callback) {
	var video = document.createElement("video");
	video.crossOrigin = "anonymous"; // Allow cross-origin access to video
	video.src = videoUrl;

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
		image: "360_vr_master_series___free_download___london_park_ducks_swans (1080p).mp4",
		title: "London Park",
	},
	{
		id: 3,
		image: "ayutthaya_-_needs_stabilization_and_horizon_correction___360_vr_master_series___free_download (1080p).mp4",
		title: "Ayutthaya",
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

const labelContainerElem = document.querySelector("#labels");

// Set up Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a video element
const video = document.createElement("video");
video.src = videoArray[0].image;
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
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Reduce intensity
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
	video.src = videoId;
	video.load();
	video.play();

	// Update the current video source
	currentVideoSrc = videoId;

	// Update the texture with the new video source
	texture.needsUpdate = true;
}
