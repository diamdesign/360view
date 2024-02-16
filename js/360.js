import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

// Array for Map view
var mapArray = [
	{
		file: "map.png",
		links: [
			{
				name: "Bedroom",
				top: 20,
				left: 80,
				link: 2,
			},
			{
				name: "Kitchen",
				top: 70,
				left: 50,
				link: 3,
			},
			{
				name: "Outside",
				top: 50,
				left: 10,
				link: 4,
			},
		],
	},
];

// Array for Locations list
var contentArray = [
	{
		id: 1,
		type: "image",
		file: "360.jpg",
		title: "One",
		likes: 1423524,
		comments: [
			{
				profilename: "Artist84",
				comment: "This is awesome",
				date: "2024-10-10 20:32:42",
			},
			{
				profilename: "ThunderBolt",
				comment: "ROCKING!",
				date: "2024-10-10 20:32:52",
			},
		],
		info: '<h1>One</h1><img src="https://picsum.photos/600/300" alt="" /><hr><p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. <a href="#">Molestiae distinctio</a> optio consequatur eaque eos asperiores quibusdam rem exercitationem maiores aliquid sequi, a, quae aliquam expedita. Blanditiis saepe esse dolorum molestias.</p><ul><li>One</li><li>Two</li></ul><hr><img src="https://picsum.photos/601/301" alt="" /><p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae distinctio optio consequatur eaque eos asperiores quibusdam rem exercitationem maiores aliquid sequi, a, quae aliquam expedita. Blanditiis saepe esse dolorum molestias.</p><a href="#" class="button">Testing</a>',
		markers: [
			{
				name: "Some info here",
				position: { x: 10, y: 0, z: 360 },
				info: '<h1>One</h1><img src="https://picsum.photos/600/300" alt="" /><hr><p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. <a href="#">Molestiae distinctio</a> optio consequatur eaque eos asperiores quibusdam rem exercitationem maiores aliquid sequi, a, quae aliquam expedita. Blanditiis saepe esse dolorum molestias.</p><ul><li>One</li><li>Two</li></ul><hr><img src="https://picsum.photos/601/301" alt="" /><p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae distinctio optio consequatur eaque eos asperiores quibusdam rem exercitationem maiores aliquid sequi, a, quae aliquam expedita. Blanditiis saepe esse dolorum molestias.</p><a href="#" class="button">Testing</a>',
				link: "",
			},
			{
				name: "Link to next scene",
				position: { x: -5, y: 0, z: -360 },
				info: "",
				link: 2,
			},
			{
				name: "DIAM",
				position: { x: 20, y: -10, z: 360 },
				info: "",
				link: "https://diam.se",
			},
		],
	},
	{
		id: 2,
		type: "image",
		file: "3602.jpg",
		title: "Two",
		info: "",
	},
	{
		id: 3,
		type: "image",
		file: "3603.jpg",
		title: "Three",
		info: "",
	},
	{
		id: 4,
		type: "image",
		file: "3604.jpg",
		title: "Four",
		info: "",
	},
	{
		id: 5,
		type: "image",
		file: "3605.jpg",
		title: "Five",
		info: "",
	},
	{
		id: 6,
		type: "image",
		file: "3606.jpg",
		title: "Six",
		info: "",
	},
	{
		id: 7,
		type: "image",
		file: "3607.jpg",
		title: "Seven",
		info: "",
	},
	{
		id: 8,
		type: "video",
		file: "360_vr_master_series___free_asset_download____bavarian_alps_wimbachklamm (1080p).mp4",
		duration: "2:00",
		title: "Bavarian Alps",
		captions: ["Swedish", "English"],
		info: "",
	},
	{
		id: 9,
		type: "video",
		file: "ayutthaya_-_needs_stabilization_and_horizon_correction___360_vr_master_series___free_download (1080p).mp4",
		duration: "0:30",
		title: "Ayutthaya",
		captions: "",
		info: "",
	},
	{
		id: 10,
		type: "video",
		file: "ayutthaya_-_easy_tripod_paint___360_vr_master_series___free_download (1080p).mp4",
		duration: "0:25",
		title: "Ayutthaya Two",
		captions: "",
		info: "",
	},
	{
		id: 11,
		type: "video",
		file: "360_vr_master_series___free_download___london_park_ducks_swans (1080p).mp4",
		duration: "1:05",
		title: "London Park",
		captions: "",
		info: "",
	},
	{
		id: 12,
		type: "video",
		file: "360_vr_master_series___free_download___london_on_tower_bridge (1080p).mp4",
		duration: "0:29",
		title: "London Tower Bridge",
		captions: "",
		info: "",
	},
	{
		id: 13,
		type: "video",
		file: "360_vr_master_series___free_download___crystal_shower_falls (1080p).mp4",
		duration: "2:00",
		title: "Crystal Shower Falls",
		captions: "",
		info: "",
	},
];

// Array for markers/labels update per each image/video
var markerData = [];

// Function to test internet speed
var highSpeed = false;
function testInternetSpeed() {
	return new Promise((resolve, reject) => {
		const imageAddr = "img/360-low.jpg"; // A sample image URL
		const downloadSize = 63633; // Size of the test image in bytes (adjust as needed)
		const startTime = new Date().getTime();

		const image = new Image();
		image.onload = function () {
			const endTime = new Date().getTime();
			const duration = (endTime - startTime) / 1000; // Duration in seconds
			const bitsLoaded = downloadSize * 8;
			const speedBps = (bitsLoaded / duration).toFixed(2);
			const speedKbps = (speedBps / 1024).toFixed(2); // Speed in Kilobits per second
			resolve(speedKbps);
		};
		image.onerror = function (err) {
			reject(err);
		};
		image.src = imageAddr + "?n=" + Math.random(); // Prevent caching
	});
}

// Perform internet speed test on page load
window.addEventListener("load", function () {
	testInternetSpeed()
		.then((speedKbps) => {
			console.log("Internet speed:", speedKbps, "Kbps");
			if (speedKbps >= 1000) {
				console.log("High-speed connection detected. Load high-quality.");
				// Load high-quality video
				highSpeed = true;
			} else {
				console.log("Low-speed connection detected. Load low-quality.");
				// Load low-quality video
				highSpeed = false;
			}
		})
		.catch((err) => {
			console.error("Error testing internet speed:", err);
		});
});

var sceneType = "image";

// Get all elements into variables
const viewElem = document.getElementById("view-container");
const zoomLevel = document.querySelector("#zoombtn");
const zoomLevelInput = document.querySelector("#zoomlevel");
const mapButton = document.querySelector("#mapbtn");
const fullscreenButton = document.querySelector("#fullscreenbtn");
const locationsElem = document.getElementById("locations");
const angleIndicator = document.getElementById("angleIndicator");
const locationsIndicatorElem = document.querySelector("#indicatorbtn");

const closeInfoButton = document.querySelector("#closeinfobtn");
const infoElem = document.querySelector("#info");
const infoButton = document.querySelector("#infobtn");
const infoResizer = document.querySelector("#resizer");

const likeButton = document.querySelector("#likebtn");
const closeCommentsButton = document.querySelector("#closecommentsbtn");
const commentsElem = document.querySelector("#comments");
const commentButton = document.querySelector("#commentbtn");

const videoplayer = document.querySelector("#videoplayer");
const playVideoButton = document.querySelector("#playvideo");
const videoduration = document.querySelector("#videoduration");
const captionHTML = document.querySelector("#caption");
const captionButton = document.querySelector("#captionselect");
const captionList = document.querySelector("#captionselect ul");

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

// Define the minimum and maximum widths for infoElem (Information popup)
const minWidth = 460;
const maxWidth = 1800;

// Define resizing variables for infoElem
let isResizing = false;
let startResizeX;
let startResizeWidth;

// Function to handle resize down event (mouse or touch)
function onResizeDown(event) {
	isResizing = true;
	startResizeX = event.clientX || event.touches[0].clientX; // Use either clientX or touches array
	startResizeWidth = parseInt(document.defaultView.getComputedStyle(infoElem).width, 10);

	// Add event listener for mouse move or touch move event
	document.body.addEventListener("mousemove", onResizeMove);
	document.body.addEventListener("touchmove", onResizeMove);

	// Add event listener for mouse up or touch end event
	document.body.addEventListener("mouseup", onResizeUp);
	document.body.addEventListener("touchstart", onResizeUp);
	document.body.addEventListener("selectend", onResizeUp);
}

// Function to handle resize move event (mouse or touch)
function onResizeMove(event) {
	if (!isResizing) return;

	const clientX = event.clientX || event.touches[0].clientX; // Use either clientX or touches array
	const deltaX = clientX - startResizeX;
	let newWidth = startResizeWidth - deltaX;

	newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

	infoElem.style.width = newWidth + "px";
}

// Function to handle resize up event (mouse or touch)
function onResizeUp() {
	isResizing = false;

	// Remove event listeners for mouse move or touch move and mouse up or touch end events
	document.removeEventListener("mousemove", onResizeMove);
	document.removeEventListener("touchmove", onResizeMove);
	document.removeEventListener("mouseup", onResizeUp);
	document.removeEventListener("touchstart", onResizeUp);
	document.removeEventListener("selectend", onResizeUp);
}

// Add event listeners for both mouse and touch events on infoResizer
infoResizer.addEventListener("mousedown", onResizeDown);
infoResizer.addEventListener("touchstart", onResizeDown);
infoResizer.addEventListener("selectstart", onResizeDown);

// Function to show and hide locations list
function showLocationsContent() {
	const scrollableBottom = parseFloat(locationsElem.style.bottom);
	if (scrollableBottom === 0) {
		let newHeight = locationsElem.getBoundingClientRect().height;
		locationsElem.style.bottom = "-" + newHeight + "px";
		locationsIndicatorElem.classList.remove("rotate180");
	} else {
		locationsIndicatorElem.classList.add("rotate180");
		locationsElem.style.bottom = "0";
	}
}

// Event listener for showing and hiding locations list
locationsIndicatorElem.addEventListener("click", showLocationsContent);
locationsIndicatorElem.addEventListener("touchstart", showLocationsContent);
locationsIndicatorElem.addEventListener("selectend", showLocationsContent);

// Function to show and hide UI
function viewContainerFadeIn() {
	locationsElem.style.opacity = "1";
	angleIndicator.style.opacity = "1";
	settingsButton.style.opacity = "1";
	zoomLevel.style.opacity = "1";
	mapButton.style.opacity = "1";
	fullscreenButton.style.opacity = "1";
	likeButton.style.opacity = "1";
	commentButton.style.opacity = "1";
}

function viewContainerFadeOut() {
	locationsElem.style.opacity = "0";
	angleIndicator.style.opacity = "0";
	settingsButton.style.opacity = "0";
	zoomLevel.style.opacity = "0";
	mapButton.style.opacity = "0";
	fullscreenButton.style.opacity = "0";
	likeButton.style.opacity = "0";
	commentButton.style.opacity = "1";
}

// Start by showing the UI
viewContainerFadeIn();

document.addEventListener("keydown", (e) => {
	if (e.key === "h" || e.key === "H") {
		const one = document.querySelector("#view-container");
		const two = document.querySelector("#outside");
		const commentInput = document.querySelector("#commentinput");

		// Check if the focus is inside the comment input
		const isFocusInsideInput = commentInput.contains(document.activeElement);

		// If the focus is inside the input, don't toggle the UI
		if (isFocusInsideInput) {
			return;
		}

		// Toggle the display of UI elements
		if (one.style.display === "none") {
			one.style.display = "block";
			two.style.display = "block";
		} else {
			one.style.display = "none";
			two.style.display = "none";
		}
	}
});

// Hide UI after 7 seconds inactivity
let idleTimeout;
idleTimeout = setTimeout(() => {
	// Fade out the view container after 7 seconds of inactivity
	viewContainerFadeOut();
}, 7000);

// Function to show/hide UI
function showHideContent() {
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
}
// Show UI if mousemove/touchmove
document.addEventListener("mousemove", function (event) {
	showHideContent();
});
document.addEventListener("touchmove", function (event) {
	showHideContent();
});

// Function to open settings
function openSettings() {
	settingsElem.style.right = "0px";
	settingsButton.style.opacity = "0";
}

// Add eventlistners to open settings
settingsButton.addEventListener("click", openSettings);
settingsButton.addEventListener("touchstart", openSettings);
settingsButton.addEventListener("selectstart", openSettings);

const locationsUl = document.querySelector("#locationlist");
contentArray.forEach((item) => {
	item = "<li></li>";
	locationsUl.insertAdjacentHTML("afterbegin", item);
});

// Perspective start at 75
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
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

// Setup CSS2DRenderer
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
labelRenderer.domElement.style.pointerEvents = "none";
document.body.appendChild(labelRenderer.domElement);

// Create a video element for video content
const video = document.createElement("video");

// Initialize currentVideoSrc with the URL of the initial video
let currentVideoSrc;

// Initialize texture for the texture to update on the sphere
let texture;

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

// Create a sphere and add it to the scene
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Create a group to add labels/markers into, and add it to the scene
const root = new THREE.Group();
scene.add(root);

// Set and add the ambient light
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

// Set current 3.5 ambient light intensity
updateLight(3.5);

// Function for rendering the scene
function render() {
	// Render the scene
	renderer.render(scene, camera);
	labelRenderer.render(scene, camera);
}

// Function to animate it all
function animate() {
	requestAnimationFrame(animate);
	controls.update();

	// directionalLight.position.setFromMatrixPosition(lightHelper.matrixWorld);
	render();

	// Calculate azimuthal angle
	const azimuthalAngle = Math.atan2(camera.position.x, camera.position.z);

	// Reverse the azimuthal angle to match the reversed mapping
	const reversedAzimuthalAngle = -azimuthalAngle;

	// Update angle indicator rotation with the reversed angle
	angleIndicator.style.transform = `translate(-50%, -50%) rotate(${reversedAzimuthalAngle}rad)`;
}

// Function for VR to animate (Work in progress)
function draw(xrFrame) {
	// Update VR controls (if available)
	if (controls) {
		controls.update();
	}

	// Render the scene for VR
	renderer.render(scene, camera);

	// Calculate azimuthal angle
	const azimuthalAngle = Math.atan2(camera.position.x, camera.position.z);
	const reversedAzimuthalAngle = -azimuthalAngle;

	// Update angle indicator rotation with the reversed angle
	angleIndicator.style.transform = `translate(-50%, -50%) rotate(${reversedAzimuthalAngle}rad)`;

	// Continue rendering in VR
	xrFrame.session.requestAnimationFrame(draw);
}

// Check if VR is supported and start VR session, if no VR then he uses animate()
if ("xr" in navigator) {
	console.log("WebXR is supported in this browser.");

	// Use requestDevice or requestSession based on availability
	if ("requestDevice" in navigator.xr) {
		// Request XR device
		navigator.xr
			.requestDevice()
			.then((device) => {
				console.log("XR device obtained:", device);

				// Request XR session
				device
					.requestSession({ immersive: true })
					.then((session) => {
						console.log("XR session started:", session);

						// Initialize XR WebGL binding
						const gl = renderer.getContext();
						const xrLayer = new XRWebGLLayer(session, gl);

						// Set XR render state
						session.updateRenderState({ baseLayer: xrLayer });

						// Start rendering loop
						session.requestAnimationFrame(onXRFrame);
					})
					.catch((error) => {
						console.error("Failed to start XR session:", error);
						// Fallback to animate function if XR session cannot be started
						animate();
					});
			})
			.catch((error) => {
				console.error("Failed to obtain XR device:", error);
				// Fallback to animate function if XR device cannot be obtained
				animate();
			});
	} else if ("requestSession" in navigator.xr) {
		// Request XR session directly
		navigator.xr
			.requestSession("immersive-vr")
			.then((session) => {
				console.log("XR session started:", session);

				// Initialize XR WebGL binding
				const gl = renderer.getContext();
				const xrLayer = new XRWebGLLayer(session, gl);

				// Set XR render state
				session.updateRenderState({ baseLayer: xrLayer });

				// Start rendering loop
				session.requestAnimationFrame(onXRFrame);
			})
			.catch((error) => {
				console.error("Failed to start XR session:", error);
				// Fallback to animate function if XR session cannot be started
				animate();
			});
	} else {
		console.error(
			"WebXR APIs are present, but neither requestDevice nor requestSession methods are available."
		);
		// Fallback to animate function if neither requestDevice nor requestSession is available
		animate();
	}
} else {
	console.log("WebXR not supported in this browser.");
	// Fallback to animate function if WebXR is not supported
	animate();
}

// Function called on each XR frame
function onXRFrame(time, xrFrame) {
	// Get XR viewer pose
	const viewerPose = xrFrame.getViewerPose();

	if (viewerPose) {
		// Iterate through XR views
		const views = viewerPose.views;
		for (let view of views) {
			// Set viewport and projection matrix for each view
			const viewport = xrLayer.getViewport(view);
			const projectionMatrix = view.projectionMatrix;

			// Render scene for each view
			renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);
			renderer.setProjectionMatrix(projectionMatrix);
			renderer.render(scene, camera);
		}
	}

	// Continue rendering loop
	xrFrame.session.requestAnimationFrame(onXRFrame);
}

// Set the locations html
let locationsHtml = "";

// For loop the locations list with contentArray information
for (let i = 0; i < contentArray.length; i++) {
	const content = contentArray[i];
	let activeClass = i === 0 && content.type === "video" ? "active" : "";
	let imageUrl = content.file.replace(/\.\w+$/, ".jpg");
	if (content.type === "video") {
		sceneType = "video";
		const fileNameWithoutExtension = imageUrl.split(".").slice(0, -1).join(".");
		let itemHtml = `<li class="${activeClass}" data-file="${content.file}" data-id="${content.id}" data-type="${content.type}">
                            <span class="icon-video">${content.duration}</span>
                            <div>${content.title}</div>
                            <img src="video/${fileNameWithoutExtension}.jpg" alt="" />
                        </li>`;
		locationsHtml += itemHtml;
	} else {
		sceneType = "image";
		const fileNameWithoutExtension = content.file.split(".").slice(0, -1).join(".");
		let itemHtml = `<li class="${activeClass}" data-file="${content.file}" data-id="${content.id}" data-type="${content.type}">
                            <div>${content.title}</div>
                            <img src="img/${fileNameWithoutExtension}-low.jpg" alt="" />
                        </li>`;
		locationsHtml += itemHtml;
	}
}

// Insert the locations list to HTML
const locationUl = document.querySelector("#locationlist");
locationUl.innerHTML = locationsHtml;

const listItems = document.querySelectorAll("#locationlist li");

// Function to set active in list and update scene
function activateItem(item) {
	listItems.forEach((listItem) => {
		listItem.classList.remove("active");
	});

	item.classList.add("active");
	const contentId = item.getAttribute("data-id");
	// Call a function to change the 360 content based on the file name and type
	change360Content(parseInt(contentId));
}

// Add click event listener to each <li> element
listItems.forEach((item) => {
	item.addEventListener("click", function () {
		activateItem(item);
	});
	item.addEventListener("touchstart", function () {
		activateItem(item);
	});
	item.addEventListener("selectend", function () {
		activateItem(item);
	});
});

// Function to update scene with image or video
function change360Content(targetId) {
	labelContainerElem.innerHTML = "";
	infoElem.classList.remove("infoshow");
	let targetObject = contentArray.find((obj) => obj.id === targetId);
	let fileName = targetObject.file;
	let fileType = targetObject.type;
	let fileInfo = targetObject.info;

	if (fileType === "video") {
		// Check if the videoId is the same as the current video
		if (currentVideoSrc === fileName) {
			return; // No need to change the video if it's the same
		}

		sceneType = "video";
		let videoFile = fileName;

		// Remove the previous texture
		sphere.material.map = null;
		// Pause and remove the current video
		video.pause();
		video.src = "";
		currentVideoSrc = "";

		// Define the preloadHighQualityVideo function outside the condition
		function preloadHighQualityVideo(video, highQualitySrc) {
			const highQualityVideo = document.createElement("video");
			highQualityVideo.src = "video/" + highQualitySrc;
			highQualityVideo.addEventListener("canplay", function () {
				const intervalId = setInterval(function () {
					if (highQualityVideo.readyState === 4) {
						// Video is fully buffered, stop the interval and execute the callback
						clearInterval(intervalId);

						video.pause();
						let currTime = video.currentTime;
						video.src = "";
						video.src = highQualityVideo.src;
						video.currentTime = currTime;
						video.play();
						console.log("High-quality video loaded and switched.");
					}
				}, 100);
			});
		}

		// Extract the file name without extension
		const fileNameWithoutExtension = targetObject.file.split(".").slice(0, -1).join(".");
		if (!highSpeed) {
			videoFile = fileNameWithoutExtension + "-low.mp4";
			// Function to preload high-quality video
			preloadHighQualityVideo(video, fileName);
		}
		// Update the src attribute of the video element
		video.src = "video/" + videoFile;
		video.load();
		video.crossOrigin = "anonymous";
		video.loop = true;
		video.playsInline = true;
		video.play();

		// Update the current video source
		currentVideoSrc = fileName;

		// Check for captions
		if (targetObject.captions !== "") {
			captionButton.style.display = "block";
			const captionInputHTML = document.querySelector("#captionselect ul");
			let html = "";
			targetObject.captions.forEach((caption) => {
				html += `<li data-caption="${caption}" data-id="${targetObject.id}">${caption}</li>`;
			});
			html += '<li id="captionoff" class="active">Captions off</li>';
			captionInputHTML.innerHTML = html;

			const allCaptions = document.querySelectorAll("#captionselect ul li");

			function handleCaptionClick(event) {
				const targetId = event.target.getAttribute("data-id");
				let targetObj = contentArray.find((obj) => obj.id === parseInt(targetId));

				const captiontag = event.target.getAttribute("data-caption");
				const fileNameWithoutExtension = targetObj.file.split(".").slice(0, -1).join(".");

				// Construct the new file name with the desired caption
				const newSRTName = `video/${fileNameWithoutExtension}-${captiontag}.srt`;
				console.log(newSRTName);
				captionHTML.style.display = "block";
				allCaptions.forEach((cap) => {
					cap.classList.remove("active");
				});
				event.target.classList.add("active");
				captionButton.classList.add("on");

				// Fetch the SRT file and convert it to a blob
				fetch(newSRTName)
					.then((response) => response.blob())
					.then((blob) => {
						// Pass the blob to the readSRTFile function
						readSRTFile(blob);
					})
					.catch((error) => {
						console.error("Error fetching or converting SRT file:", error);
					});
			}

			allCaptions.forEach((caption) => {
				caption.addEventListener("click", handleCaptionClick);
				caption.addEventListener("touchstart", handleCaptionClick);
				caption.addEventListener("selectstart", handleCaptionClick);
			});

			const captionOffButton = document.querySelector("#captionoff");

			function captionToggle() {
				allCaptions.forEach((cap) => {
					cap.classList.remove("active");
				});
				captionOffButton.classList.add("active");
				captionButton.classList.remove("on");
				captionHTML.style.display = "none";
			}
			captionOffButton.addEventListener("click", captionToggle);
			captionOffButton.addEventListener("touchstart", captionToggle);
			captionOffButton.addEventListener("selectstart", captionToggle);
		} else {
			captionButton.style.display = "none";
		}

		playVideoButton.classList.add("playing");

		function showCaptionList() {
			if (captionList.style.display === "none") {
				captionList.style.display = "block";
			} else {
				captionList.style.display = "none";
			}
		}
		captionButton.addEventListener("click", showCaptionList);
		captionButton.addEventListener("touchstart", showCaptionList);
		captionButton.addEventListener("selectstart", showCaptionList);

		function playPauseVideo() {
			if (playVideoButton.classList.contains("playing")) {
				playVideoButton.classList.remove("playing");
				video.pause();
			} else {
				playVideoButton.classList.add("playing");
				video.play();
			}
		}

		playVideoButton.addEventListener("click", playPauseVideo);
		playVideoButton.addEventListener("touchstart", playPauseVideo);
		playVideoButton.addEventListener("selectstart", playPauseVideo);

		const currentTimeHTML = document.querySelector("#currenttime");
		// Update the range input according to the current time of the video

		video.addEventListener("timeupdate", () => {
			const currentTimePercentage = video.currentTime / video.duration;
			videoduration.value = currentTimePercentage.toFixed(2);
			const currentTime = video.currentTime;
			const formattedTime = formatTime(currentTime);
			currentTimeHTML.textContent = formattedTime;
		});

		// Function to handle changing the current time of the video when the range input is changed
		function changeVideoCurrentTime() {
			const currentTimePercentage = parseFloat(videoduration.value);
			video.currentTime = currentTimePercentage * video.duration;
			const currentTime = video.currentTime;
			const formattedTime = formatTime(currentTime);
			currentTimeHTML.textContent = formattedTime;
		}

		// Add an event listener to the range input to update the video current time when changed
		videoduration.addEventListener("input", changeVideoCurrentTime);

		// Add an event listener to handle seeking when the user clicks or drags on the range input
		function changeVideoTime() {
			video.removeEventListener("timeupdate", () => {});
			changeVideoCurrentTime();
		}
		videoduration.addEventListener("mousedown", changeVideoTime);
		videoduration.addEventListener("touchstart", changeVideoTime);
		videoduration.addEventListener("selectstart", changeVideoTime);

		// Format time for video
		function formatTime(seconds) {
			const hours = Math.floor(seconds / 3600);
			const minutes = Math.floor((seconds % 3600) / 60);
			const remainingSeconds = Math.floor(seconds % 60);

			const formattedHours = hours.toString().padStart(2, "0");
			const formattedMinutes = minutes.toString().padStart(2, "0");
			const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

			return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
		}

		videoplayer.style.display = "flex";
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
		videoplayer.style.display = "none";
		// Remove the previous texture
		sphere.material.map = null;
		// Create a black texture
		// Pause and remove the current video
		video.pause();
		video.src = "";
		currentVideoSrc = "";

		// Define a function to preload high-quality image
		function preloadHighQualityImage(highQualityFileName, callback) {
			// Create an image element
			const img = new Image();

			// Set the source of the image to the high-quality file
			img.src = highQualityFileName;

			// Set up event listener for when the image is fully loaded
			img.onload = function () {
				// Once the high-quality image is fully loaded, execute the callback function
				// Create a THREE texture using the loaded image
				const texture = new THREE.Texture(img);
				texture.needsUpdate = true; // Ensure the texture is marked as updated

				// Configure texture properties if needed
				texture.wrapS = THREE.RepeatWrapping;
				texture.repeat.x = -1; // Flip texture horizontally
				texture.mapping = THREE.UVMapping; // Apply UV mapping
				texture.encoding = THREE.sRGBEncoding; // Set texture encoding to sRGB
				texture.gammaFactor = 2.2; // Adjust gamma correction (e.g., 2.2 for typical images)

				// Execute the callback function with the loaded texture
				callback(texture);
			};
		}

		// Extract the file name without extension
		const fileNameWithoutExtension = targetObject.file.split(".").slice(0, -1).join(".");
		let imageFile = "img/" + fileName;
		if (!highSpeed) {
			imageFile = "img/" + fileNameWithoutExtension + "-low.jpg";
		}

		// Load the low-quality image
		const loader = new THREE.TextureLoader();
		const newTexture = loader.load(`${imageFile}`, function (texture) {
			texture.wrapS = THREE.RepeatWrapping;
			texture.repeat.x = -1; // Flip texture horizontally
			texture.mapping = THREE.UVMapping; // Apply UV mapping
			texture.encoding = THREE.sRGBEncoding; // Set texture encoding to sRGB
			texture.gammaFactor = 2.2; // Adjust gamma correction (e.g., 2.2 for typical images)
		});
		// Once the low-quality image is loaded and processed, here you can do additional operations
		// For example, update the texture of a sphere mesh with the low-quality texture
		sphere.material.map = newTexture;
		sphere.material.needsUpdate = true;

		// Preload high-quality image if necessary
		if (!highSpeed) {
			let highQualityFileName = "img/" + fileName;
			preloadHighQualityImage(highQualityFileName, function (highQualityTexture) {
				// Once the high-quality image is loaded and processed, here you can do additional operations
				// For example, update the texture of a sphere mesh with the high-quality texture
				sphere.material.map = highQualityTexture;
				sphere.material.needsUpdate = true;
			});
		}
	} else {
		console.log("Invalid file type");
	}

	if (fileInfo !== "" && fileInfo !== null && fileInfo !== undefined) {
		infoElem.querySelector(".container").innerHTML = fileInfo;
		infoElem.style.display = "block";
		infoButton.style.display = "block";
		infoButton.style.opacity = "1";
	} else {
		infoElem.style.display = "none";
		infoButton.style.opacity = "0";
		infoButton.style.display = "none";
	}

	camera.updateProjectionMatrix();
	markerData = targetObject.markers;

	// Remove all markers/labels
	root.clear();

	if (markerData !== "" && markerData !== null && markerData !== undefined) {
		// Call createMarkers function asynchronously
		createMarkers(markerData).then(() => {
			console.log("Markers created and event listeners added.");
		});
	}
}

// Define initialZoomLevel with the initial value of your input range
const initialZoomLevel = parseFloat(zoomLevelInput.value);

// Function to handle zoom, with fov and range handler
function handleZoom(event) {
	if (isMouseOverScrollableContent(event)) {
		return; // Exit the function early if mouse is over scrollable content
	}
	// Access the zoom speed from controls.zoomSpeed
	const zoomAmount = event.deltaY * zoomSpeed; // Use controls.zoomSpeed instead of zoomSpeed

	const distanceToTarget = -controls.object.position.length();

	// Adjust the rotation speed based on the distance to the target
	controls.rotateSpeed = distanceToTarget * 0.005;

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

	// Update the input range value to reflect the new zoom level if needed

	zoomLevelInput.value = (perspective - 10) / (90 - 10); // Map perspective value to range 0 to 1
}

// Check so that the zoom doesnt work when mouse is over certain elements
function isMouseOverScrollableContent(event) {
	// Check if event is defined and not null
	if (event && event.target) {
		// Get the target element of the mouse event
		const target = event.target;

		// Check if the target element or any of its ancestors is the scrollable content or #info
		return (
			target.closest("#scrollable") !== null ||
			target.closest("#info") !== null ||
			target.closest(".marker-container") !== null ||
			target.closest("#comments") !== null
		);
	} else {
		// If event is undefined or null, return false
		return false;
	}
}

// Add eventlistener for mouse wheel to handle zoom
document.addEventListener("wheel", handleZoom);

// Add event listener to the input range
zoomLevelInput.addEventListener("input", function () {
	// Get the zoom level from the input range value (between 0 and 1)
	const zoomLevel = parseFloat(zoomLevelInput.value);

	// Calculate the new perspective value (camera.fov) based on the zoom level
	const newFov = 10 + zoomLevel * 80; // Interpolating between 10 (zoomed in) and 90 (zoomed out)

	// Get maxDistance and minDistance from controls
	const maxDistance = controls.maxDistance;
	const minDistance = controls.minDistance;

	// Calculate the new maxDistance based on the zoom level
	const newMaxDistance = minDistance + zoomLevel * (maxDistance - minDistance);

	// Update the camera's parameters
	camera.fov = newFov;
	camera.maxDistance = newMaxDistance;
	camera.updateProjectionMatrix();
});

// Add mouse controls to the camera
const controls = new OrbitControls(camera, renderer.domElement);

// Other controls settings
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = -1;
controls.autoRotate = false;
controls.autoRotateSpeed *= 0.25;

// Set camera position
camera.position.set(0, 0, 0);
camera.rotation.order = "YXZ";
// Function to reset the camera rotation and position to its initial state
const newPos = new THREE.Vector3(0, 0, 0); // Default position
const newRot = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 150, 0)); // Default rotation

resetCameraRotation(newPos, newRot);

controls.minDistance = 30; // Set a minimum zoom distance that allows zooming in closer
controls.maxDistance = 280; // Set maximum zoom distance
controls.zoomSpeed = 3; // Adjust zoom speed

const zoomSpeed = 0.1;
const perspectiveFactor = 0.1; // Adjust perspective factor as needed
const minPerspective = 10; // Adjust minimum perspective value as needed
const maxPerspective = 90;

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
const defaultPosition = new THREE.Vector3(0, 0, 0); // Default position
const defaultRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)); // Default rotation

function resetCameraRotation(position = defaultPosition, rotation = defaultRotation) {
	const initialRotation = new THREE.Quaternion().setFromEuler(camera.rotation.clone());
	const targetRotation = new THREE.Quaternion().setFromEuler(rotation);

	// Interpolate between the current position and the initial position
	const initialPos = camera.position.clone();
	const targetPos = position.clone();

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

// Create a helper object to track the position in front of the camera
const lightHelper = new THREE.Object3D();
camera.add(lightHelper);

// Update the light's position relative to the helper object
const lightDistance = 1; // Distance from camera to light
lightHelper.position.set(0, 0, lightDistance);
directionalLight.position.setFromMatrixPosition(lightHelper.matrixWorld);
*/

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
fullscreenButton.addEventListener("touchstart", toggleFullscreen);
fullscreenButton.addEventListener("selectstart", toggleFullscreen);

// Refresh the canvas on window resize
window.addEventListener("resize", function (event) {
	// Update camera aspect ratio
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	// Update renderer size
	renderer.setSize(window.innerWidth, window.innerHeight);
	labelRenderer.setSize(window.innerWidth, window.innerHeight);

	renderer.setPixelRatio(window.devicePixelRatio);

	render();

	if (locationsElem.style.bottom !== 0) {
		let newHeight = locationsElem.getBoundingClientRect().height;
		locationsElem.style.bottom = "-" + newHeight + "px";
	}
	updateMapLinkPosition();
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
scrollableContent.addEventListener("touchstart", function (event) {
	// Prevent default click behavior when starting drag
	event.preventDefault();

	isDragging = true;
	startX = event.pageX - scrollableContent.offsetLeft;
	scrollLeft = scrollableContent.scrollLeft;
	scrollableContent.style.cursor = "grabbing"; // Change cursor style
});

function restoreCursor() {
	isDragging = false;
	scrollableContent.style.cursor = "grab"; // Restore cursor style
}
scrollableContent.addEventListener("mouseup", restoreCursor);
scrollableContent.addEventListener("touchstart", restoreCursor);
scrollableContent.addEventListener("mouseleave", restoreCursor);

function scrollLocation(event) {
	if (!isDragging) return;
	const x = event.pageX - scrollableContent.offsetLeft;
	const walk = (x - startX) * 3; // Adjust scroll speed
	scrollableContent.scrollLeft = scrollLeft - walk;
}

scrollableContent.addEventListener("mousemove", (event) => {
	scrollLocation(event);
});

scrollableContent.addEventListener("touchmove", (event) => {
	scrollLocation(event);
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

function resetSettings() {
	const c = document.getElementsByTagName("canvas")[0];
	c.style.filter = "contrast(1) brightness(1) saturate(1)";

	settingsAmbient.value = "3.5";
	settingsAmbientNo.textContent = "3.5";
	updateLight(3.5);

	settingsBrightness.value = "1";
	settingsBrightnessNo.textContent = "1";

	settingsContrast.value = "1";
	settingsContrastNo.textContent = "1";

	settingsSaturate.value = "1";
	settingsSaturateNo.textContent = "1";

	settingsVolume.value = "1";
	settingsVolumeNo.textContent = "1";
	video.volume = "1";
}
resetButton.addEventListener("click", resetSettings);
resetButton.addEventListener("touchstart", resetSettings);
resetButton.addEventListener("selectstart", resetSettings);

function closeSettings() {
	settingsButton.style.opacity = "1";
	settingsElem.style.right = "-640px";
}
closeSettingsButton.addEventListener("click", closeSettings);
closeSettingsButton.addEventListener("touchstart", closeSettings);
closeSettingsButton.addEventListener("selectstart", closeSettings);

function openInfo() {
	infoButton.style.opacity = "0";
	infoElem.classList.add("infoshow");
}

function openComments() {
	commentButton.style.opacity = "0";
	commentsElem.classList.add("commentshow");
}

infoButton.addEventListener("click", openInfo);
infoButton.addEventListener("touchstart", openInfo);
infoButton.addEventListener("selectstart", openInfo);

commentButton.addEventListener("click", openComments);
commentButton.addEventListener("touchstart", openComments);
commentButton.addEventListener("selectstart", openComments);

function closeInfo() {
	infoButton.style.opacity = "1";
	infoElem.classList.remove("infoshow");
	infoElem.style.width = "460px";
}

function closeComments() {
	commentButton.style.opacity = "1";
	commentsElem.classList.remove("commentshow");
	commentsElem.style.width = "460px";
}

closeInfoButton.addEventListener("click", closeInfo);
closeInfoButton.addEventListener("touchstart", closeInfo);
closeInfoButton.addEventListener("selectstart", closeInfo);

closeCommentsButton.addEventListener("click", closeComments);
closeCommentsButton.addEventListener("touchstart", closeComments);
closeCommentsButton.addEventListener("selectstart", closeComments);

document.addEventListener("DOMContentLoaded", function () {
	// Get all the <li> elements
	// Function to change the 360 image

	function checkFirstListItem() {
		const firstListItem = document.querySelector("#locations .container ul li:first-child");
		if (firstListItem) {
			const contentId = contentArray[0].id;
			change360Content(parseInt(contentId));
			firstListItem.classList.add("active");
		} else {
			// Retry after a delay if the first list item is not found
			setTimeout(checkFirstListItem, 1000); // Retry after 1 second
		}
	}

	// Start checking for the first list item
	checkFirstListItem();
});

// SRT Stuff
function readSRTFile(file) {
	const reader = new FileReader();
	reader.onload = function (event) {
		const captions = parseSRT(event.target.result);
		// Assuming captions is an array of objects with 'start', 'end', and 'text' properties
		console.log(captions);
		// You can store the captions array or use it directly
		displayCaption(captions);
	};
	reader.readAsText(file);
}
function parseSRT(data) {
	const lines = data.trim().split(/\r?\n/); // Split the data into lines
	const captions = [];
	let caption = {};

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		if (!line) {
			// Skip empty lines
			continue;
		}

		if (!caption.id) {
			// If caption ID is not set, expect the ID line
			caption.id = parseInt(line);
		} else if (!caption.start) {
			// If start time is not set, expect the time range line
			const timeParts = line.split(" --> ");
			if (timeParts.length === 2) {
				caption.start = srtTimeToSeconds(timeParts[0]);
				caption.end = srtTimeToSeconds(timeParts[1]);
			} else {
				// If time range line does not contain start and end times, skip caption
				caption = {};
				continue;
			}
		} else if (!caption.text) {
			// If text is not set, expect the caption text line
			caption.text = line;
		} else {
			// If all properties are set, push the current caption object to captions array and reset caption object
			captions.push(caption);
			caption = {};
		}
	}

	console.log(captions);
	return captions;
}
function srtTimeToSeconds(timeString) {
	console.log(timeString);
	const [hh, mm, ssAndMs] = timeString.split(":").map(parseFloat);
	let [ss, ms] = [0, 0]; // Initialize seconds and milliseconds

	if (typeof ssAndMs === "string" && ssAndMs.includes(",")) {
		// Check if the timeString contains milliseconds
		const splitTime = ssAndMs.split(",");
		ss = parseFloat(splitTime[0]); // Extract seconds
		ms = parseFloat(splitTime[1]); // Extract milliseconds
	} else {
		ss = parseFloat(ssAndMs); // If no milliseconds or not a string, directly assign seconds
	}

	return hh * 3600 + mm * 60 + ss + ms / 1000; // Convert milliseconds to seconds
}
function displayCaption(captions) {
	video.addEventListener("timeupdate", function () {
		const currentTime = video.currentTime;
		const captionElement = document.getElementById("caption");
		for (const caption of captions) {
			if (currentTime >= caption.start && currentTime <= caption.end) {
				captionElement.innerHTML = `<p>${caption.text}</p>`;
				return;
			}
		}
		captionElement.innerHTML = "";
	});
}
const map = document.getElementById("map");
const mapImage = document.getElementById("mapimage");
const mapImg = document.getElementById("mapimg");

mapImg.src = "img/" + mapArray[0].file; // Set the source attribute for the image

mapArray[0].links.forEach((maplink) => {
	// Adjust to access the first element of mapArray
	let textrightClass = maplink.left > 50 ? " linktextleft" : ""; // Conditionally add 'textright' class
	let html = `<div class="maplink ${textrightClass}" data-id="${maplink.link}" style="top: ${maplink.top}%; left: ${maplink.left}%">
            <span class="hint">${maplink.name}</span>
        </div>`;
	mapImage.insertAdjacentHTML("beforeend", html); // Adjust to add HTML at the end of mapImage
});

const mapLinks = document.querySelectorAll(".maplink");
mapLinks.forEach((link) => {
	link.addEventListener("click", (event) => {
		const contentId = parseInt(event.target.getAttribute("data-id"));
		map.style.display = "none";
		listItems.forEach((listItem) => {
			listItem.classList.remove("active");
		});

		const activeListItem = document.querySelector(`#locations [data-id="${contentId}"]`);
		activeListItem.classList.add("active");

		change360Content(parseInt(contentId));
	});
});

// Function to update the map link positions depending on the image size
function updateMapLinkPosition() {
	mapImage.style.width = "100%";
	mapImage.style.height = "100%";
	const containerWidth = mapImage.clientWidth;
	const containerHeight = mapImage.clientHeight;

	const imgWidth = mapImg.naturalWidth;
	const imgHeight = mapImg.naturalHeight;

	let displayWidth, displayHeight;

	// Calculate the displayed size of the image
	if (containerWidth / containerHeight < imgWidth / imgHeight) {
		displayWidth = containerWidth;
		displayHeight = (containerWidth / imgWidth) * imgHeight;
	} else {
		displayHeight = containerHeight;
		displayWidth = (containerHeight / imgHeight) * imgWidth;
	}

	// Set the width and height of #mapimage to match the image dimensions
	mapImage.style.width = displayWidth + "px";
	mapImage.style.height = displayHeight + "px";
}

// Function to toggle map
function toggleMap() {
	if (map.style.display === "none") {
		map.style.display = "flex";
		updateMapLinkPosition();
	} else {
		map.style.display = "none";
	}
}

// Add eventlistener for toggle map
mapButton.addEventListener("click", toggleMap);
mapButton.addEventListener("touchstart", toggleMap);
mapButton.addEventListener("selectstart", toggleMap);

updateMapLinkPosition();

// Function to create labels/markers
async function createMarkers(markerData) {
	markerData.forEach((data) => {
		const { name, position, info, link } = data;

		// Create a THREE.Vector3 instance from the position object
		const positionVector = new THREE.Vector3(position.x, position.y, position.z);

		// Create marker element
		const marker = document.createElement("a");
		marker.className = "marker";

		if (typeof link === "string" && link !== "") {
			marker.href = link;
			marker.target = "_blank";
			marker.classList.add("extlink");
		} else if (typeof link === "number") {
			marker.href = "#location-" + link;
			marker.dataset.id = link;
			marker.classList.add("intlink");
		} else {
			marker.href = "#info";
			marker.classList.add("infodot");
		}

		let html = `<span class="hint">${name}</span><div class="marker-container"></div>`;
		marker.innerHTML = html;
		let markerContainer = marker.querySelector(".marker-container");
		markerContainer.insertAdjacentHTML("afterbegin", info);

		// Create CSS2DObject for marker/label
		const cssObject = new CSS2DObject(marker);
		cssObject.position.copy(positionVector);

		// Add CSS2DObject to the label renderer's scene (Root is a group)
		root.add(cssObject);
	});

	// Define a function to wait for marker elements
	const waitForMarkerElements = () => {
		return new Promise((resolve) => {
			const interval = setInterval(() => {
				const markerInternalLinks = document.querySelectorAll(".intlink");
				const markerInfoLabels = document.querySelectorAll(".infodot");
				if (markerInternalLinks.length > 0 && markerInfoLabels.length > 0) {
					clearInterval(interval); // Stop the interval
					resolve(); // Resolve the promise
				}
			}, 25);
		});
	};

	// Wait for marker elements
	await waitForMarkerElements();

	// Once marker elements are available, add event listeners
	const markerInternalLinks = document.querySelectorAll(".intlink");
	const markerInfoLabels = document.querySelectorAll(".infodot");

	markerInternalLinks.forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			const contentId = link.getAttribute("data-id");
			change360Content(parseInt(contentId));
		});
	});

	markerInfoLabels.forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			let hint = link.querySelector(".hint");
			let content = link.querySelector(".marker-container");
			let computedStyle = getComputedStyle(content);

			if (computedStyle.display === "none") {
				content.style.display = "block";
				hint.style.display = "none";
			} else {
				content.style.display = "none";
				hint.style.display = "block";
			}
		});
	});

	console.log("Event listeners added to markers.");
}

/*
// Function to update marker positions based on camera movements
function updateMarkerPositions(camera) {
	// Iterate through all CSS2DObjects in the labelRenderer's scene
	labelRenderer.scene.children.forEach((object) => {
		// Check if the object is an instance of CSS2DObject
		if (object instanceof CSS2DObject) {
			// Retrieve the marker's position from its associated CSS2DObject
			const position = object.position;

			// Calculate the position relative to the camera
			const markerPosition = position.clone().sub(camera.position);

			// Project marker position onto screen coordinates
			const vector = markerPosition.project(camera);

			// Calculate screen coordinates
			const xScreen = ((vector.x + 1) / 2) * window.innerWidth;
			const yScreen = (-(vector.y - 1) / 2) * window.innerHeight;

			// Update the position of the CSS2DObject in the DOM
			object.element.style.left = xScreen + "px";
			object.element.style.top = yScreen + "px";
		}
	});
}
*/