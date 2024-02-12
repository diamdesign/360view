import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

var contentArray = [
	{
		id: 1,
		type: "image",
		file: "360.jpg",
		title: "One",
		info: '<h1>One</h1><img src="https://picsum.photos/600/300" alt="" /><hr><p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. <a href="#">Molestiae distinctio</a> optio consequatur eaque eos asperiores quibusdam rem exercitationem maiores aliquid sequi, a, quae aliquam expedita. Blanditiis saepe esse dolorum molestias.</p><ul><li>One</li><li>Two</li></ul><hr><img src="https://picsum.photos/601/301" alt="" /><p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae distinctio optio consequatur eaque eos asperiores quibusdam rem exercitationem maiores aliquid sequi, a, quae aliquam expedita. Blanditiis saepe esse dolorum molestias.</p><a href="#" class="button">Testing</a>',
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

var sceneType = "image";

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

const videoplayer = document.querySelector("#videoplayer");
const playVideoButton = document.querySelector("#playvideo");
const videoduration = document.querySelector("#videoduration");
const captionHTML = document.querySelector("#caption");
const captionButton = document.querySelector("#captionselect");
const captionList = document.querySelector("#captionselect ul");

// Define the minimum and maximum widths for infoElem
const minWidth = 460;
const maxWidth = 1800;

let isResizing = false;
let startResizeX;
let startResizeWidth;

// Function to handle mouse down event
function onResizeDown(event) {
	isResizing = true;
	startResizeX = event.clientX;
	startResizeWidth = parseInt(document.defaultView.getComputedStyle(infoElem).width, 10);

	// Add event listener for mouse move event
	document.body.addEventListener("mousemove", onResizeMove);
	// Add event listener for mouse up event
	document.body.addEventListener("mouseup", onResizeUp);
}

// Function to handle mouse move event
function onResizeMove(event) {
	if (!isResizing) return;

	const deltaX = event.clientX - startResizeX;
	let newWidth = startResizeWidth - deltaX; // Subtract deltaX instead of adding it

	// Ensure new width is within the allowed range
	newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

	// Update infoElem width
	infoElem.style.width = newWidth + "px";
}

// Function to handle mouse up event
function onResizeUp() {
	isResizing = false;

	// Remove event listeners for mouse move and mouse up events
	document.removeEventListener("mousemove", onResizeMove);
	document.removeEventListener("mouseup", onResizeUp);
}

// Add event listener for mouse down event on infoResizer
infoResizer.addEventListener("mousedown", onResizeDown);

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

document.addEventListener("keydown", (e) => {
	if (e.key === "h" || e.key === "H") {
		const one = document.querySelector("#view-container");
		const two = document.querySelector("#outside");
		if (one.style.display === "none") {
			one.style.display = "block";
			two.style.display = "block";
		} else {
			one.style.display = "none";
			two.style.display = "none";
		}
	}
});

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

const locationsUl = document.querySelector("#locationlist");
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
let locationsArray = "";

for (let i = 0; i < contentArray.length; i++) {
	const content = contentArray[i];
	let activeClass = i === 0 && content.type === "video" ? "active" : "";
	let imageUrl = content.file.replace(/\.\w+$/, ".jpg");
	if (content.type === "video") {
		sceneType = "video";
		let itemHtml = `<li class="${activeClass}" data-file="${content.file}" data-id="${content.id}" data-type="${content.type}">
                            <span class="icon-video">${content.duration}</span>
                            <div>${content.title}</div>
                            <img src="video/${imageUrl}" alt="" />
                        </li>`;
		locationsArray += itemHtml;
	} else {
		sceneType = "image";
		let itemHtml = `<li class="${activeClass}" data-file="${content.file}" data-id="${content.id}" data-type="${content.type}">
                            <div>${content.title}</div>
                            <img src="img/${content.file}" alt="" />
                        </li>`;
		locationsArray += itemHtml;
	}
}

const locationUl = document.querySelector("#locationlist");
locationUl.innerHTML = locationsArray;

const listItems = document.querySelectorAll("#locationlist li");
// Add click event listener to each <li> element
listItems.forEach(function (item) {
	item.addEventListener("click", function () {
		listItems.forEach((item) => {
			item.classList.remove("active");
		});

		item.classList.add("active");
		const contentId = item.getAttribute("data-id");
		// Call a function to change the 360 content based on the file name and type
		change360Content(parseInt(contentId));
	});
});

// Create a video element
const video = document.createElement("video");

// Initialize currentVideoSrc with the URL of the initial video
let currentVideoSrc;
let texture;

function change360Content(targetId) {
	infoElem.style.right = "-100%";
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
			allCaptions.forEach((caption) => {
				caption.addEventListener("click", (event) => {
					const targetId = event.target.getAttribute("data-id");
					let targetObj = contentArray.find((obj) => obj.id === parseInt(targetId));
					// Extract the file name without extension

					const fileNameWithoutExtension = targetObj.file
						.split(".")
						.slice(0, -1)
						.join(".");

					const captiontag = event.target.getAttribute("data-caption");

					// Construct the new file name with the desired caption
					const newSRTName = `video/${fileNameWithoutExtension}-${captiontag}.srt`;
					console.log(newSRTName);
					captionHTML.style.display = "block";
					allCaptions.forEach((cap) => {
						cap.classList.remove("active");
					});
					caption.classList.add("active");
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
				});
			});

			const captionOffButton = document.querySelector("#captionoff");

			captionOffButton.addEventListener("click", () => {
				allCaptions.forEach((cap) => {
					cap.classList.remove("active");
				});
				captionOffButton.classList.add("active");
				captionButton.classList.remove("on");
				captionHTML.style.display = "none";
			});
		} else {
			captionButton.style.display = "none";
		}

		playVideoButton.classList.add("playing");

		captionButton.addEventListener("click", () => {
			if (captionList.style.display === "none") {
				captionList.style.display = "block";
			} else {
				captionList.style.display = "none";
			}
		});

		playVideoButton.addEventListener("click", () => {
			if (playVideoButton.classList.contains("playing")) {
				playVideoButton.classList.remove("playing");
				video.pause();
			} else {
				playVideoButton.classList.add("playing");
				video.play();
			}
		});
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
		videoduration.addEventListener("mousedown", () => {
			video.removeEventListener("timeupdate", () => {});
			changeVideoCurrentTime();
		});

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

	if (fileInfo !== "" && fileInfo !== null && fileInfo !== undefined) {
		infoElem.style.display = "block";
		infoButton.style.display = "block";
		infoButton.style.opacity = "1";
		infoElem.querySelector(".container").innerHTML = fileInfo;
	} else {
		infoElem.style.display = "none";
		infoButton.style.opacity = "0";
		infoButton.style.display = "none";
	}

	const vectarget = new THREE.Vector3(10, 10, -10); // Adjust the target position as needed
	// Set the camera to look at the target point
	camera.lookAt(vectarget);
	camera.updateProjectionMatrix();
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

function isMouseOverScrollableContent(event) {
	// Get the target element of the mouse event
	const target = event.target;

	// Check if the target element or any of its ancestors is the scrollable content or #info
	return target.closest("#scrollable") !== null || target.closest("#info") !== null;
}

document.addEventListener("wheel", handleZoom);

// Add mouse controls to the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = -1;

// Set camera position
camera.position.set(0, 0, 0);
camera.rotation.order = "YXZ"; // Move the camera further from the object
// Create a target point to look at, which is slightly ahead of the camera's position
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
});

closeSettingsButton.addEventListener("click", () => {
	settingsButton.style.opacity = "1";
	settingsElem.style.right = "-640px";
});

infoButton.addEventListener("click", () => {
	infoButton.style.opacity = "0";
	infoElem.style.right = "0";
});

closeInfoButton.addEventListener("click", () => {
	infoButton.style.opacity = "1";
	infoElem.style.right = "-100%";
});

document.addEventListener("DOMContentLoaded", function () {
	// Get all the <li> elements
	// Function to change the 360 image

	function checkFirstListItem() {
		const firstListItem = document.querySelector("#locations .container ul li:first-child");
		if (firstListItem) {
			const contentId = contentArray[0].id;
			change360Content(contentId);
		} else {
			// Retry after a delay if the first list item is not found
			setTimeout(checkFirstListItem, 1000); // Retry after 1 second
		}
	}

	// Start checking for the first list item
	checkFirstListItem();
});
