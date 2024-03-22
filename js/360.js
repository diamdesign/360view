import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { rootHTML, haspassHTML } from "./360template.min.js";
import { buildComments } from "./comments.min.js";

import { testInternetSpeed, xhrSend, getUrlParameter, formatNumber } from "./functions.min.js";

var userInteracted = false;
var dataType = "";
// Array for markers/labels update per each image/video
var markerData = [];

// Function to test internet speed
var highSpeed = false;
var sceneType = "image";

var listItems;
var marker;

// Define the image click handler function
function imageClickHandler(event) {
	const rootElement = document.querySelector("#root");
	const newDiv = document.createElement("div");
	const clonedImage = event.target.cloneNode(true);
	const divId = "zoom-div-" + Date.now(); // Generate unique ID
	newDiv.id = divId; // Assign unique ID to the new div
	newDiv.classList.add("zoomedimage");
	clonedImage.classList.remove("zoom-image");
	newDiv.appendChild(clonedImage);
	rootElement.appendChild(newDiv);

	// Add click event listener to the new div
	newDiv.addEventListener("click", function () {
		rootElement.removeChild(newDiv); // Remove the new div when clicked
	});
}

// Create a group to add labels/markers into, and add it to the scene
const root = new THREE.Group();

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

const embedId = getUrlParameter("i");
const locId = getUrlParameter("loc");

const baseUri = "localhost/360/";
const uri = "i=" + embedId + "&loc=" + locId;

var startLocX = 0;
var startLocY = 0;
var selectStartLocation = locId;
var shareLink =
	baseUri +
	"watch/?=" +
	embedId +
	"&loc=" +
	selectStartLocation +
	"&x=" +
	startLocX +
	"&y=" +
	startLocY;

function updateShareLink() {
	shareLink =
		baseUri +
		"watch/?=" +
		embedId +
		"&loc=" +
		selectStartLocation +
		"&x=" +
		startLocX +
		"&y=" +
		startLocY;
}

const fileCheckData = "../php/checkdata.php";
const fileGetData = "../php/getdata.php";

function buildHtml() {
	const rootElement = document.getElementById("root");
	// Append the iframe to the parent element
	rootElement.innerHTML = rootHTML;
}

function buildPasswordHtml() {
	const rootElement = document.getElementById("root");
	// Append the iframe to the parent element

	rootElement.innerHTML = haspassHTML;
	document.querySelector("#haspass-password").focus();
	document.querySelector("#enter-password").addEventListener("click", (e) => {
		e.preventDefault();
		const formGroup = document.querySelector("#haspass-login form");
		const password = document.querySelector("#haspass-password").value.trim();

		const loaderHTML = '<div class="loader"></div>';
		formGroup.insertAdjacentHTML("beforebegin", loaderHTML);

		const loaderElem = document.querySelector(".loader");
		formGroup.style.display = "none";
		if (password === "") {
			alert("Password can not be empty.");
			formGroup.style.display = "block";
			loaderElem.remove();
			return;
		} else if (password.length < 5) {
			alert("Password must be 5 letters or longer.");
			formGroup.style.display = "block";
			loaderElem.remove();
			return;
		} else {
			const fileCheckPass = "../php/checkpass.php";
			const passuri = "i=" + embedId + "&loc=" + locId + "&pass=" + password;
			xhrSend("POST", fileCheckPass, passuri)
				.then((data) => {
					console.log(data);
					if (data.success) {
						document.querySelector("#haspass-login").remove();

						xhrSend("POST", fileGetData, uri)
							.then((data) => {
								// Handle the response data
								console.log(data); /* Remove this later */
								buildHtml();
								start(data);
							})
							.catch((error) => {
								// Handle any errors
								console.error("XHR request failed:", error);
							});
					} else {
						setTimeout(() => {
							alert("Wrong password.");
							formGroup.style.display = "block";
							loaderElem.remove();
							return;
						}, 3000);
					}
				})
				.catch((error) => {
					// Handle any errors
					console.error("XHR request failed:", error);
				});
		}
	});
}

xhrSend("POST", fileCheckData, uri)
	.then((data) => {
		// Handle the response data
		console.log(data); /* Remove this later */

		if (!data.haspass && data.ispublic) {
			xhrSend("POST", fileGetData, uri)
				.then((data) => {
					// Handle the response data
					console.log(data); /* Remove this later */
					buildHtml();
					start(data);
				})
				.catch((error) => {
					// Handle any errors
					console.error("XHR request failed:", error);
				});
		} else if (data.haspass && data.ispublic) {
			console.log("This has password ON.");
			buildPasswordHtml();
			return;
		} else if (!data.haspass && !data.ispublic) {
			console.log("This is private.");
			return;
		} else if (data.haspass && !data.ispublic) {
			console.log("This is private and has password.");
			return;
		}
	})
	.catch((error) => {
		// Handle any errors
		console.error("XHR request failed:", error);
	});

function start(data) {
	if (data.hasOwnProperty("project")) {
		dataType = "project";
	} else {
		dataType = "location";
	}
	console.log("Data Type:", dataType);

	const baseUrl = "http://localhost/360/";

	const rootElement = document.querySelector("#root");

	// Get all elements into variables
	const viewElem = document.getElementById("view-container");
	const zoomLevel = document.querySelector("#zoombtn");
	const zoomLevelInput = document.querySelector("#zoomlevel");
	const mapButton = document.querySelector("#mapbtn");

	const rightButtons = document.querySelector(".rightbuttons");
	const fullscreenButton = document.querySelector("#fullscreenbtn");
	const locationsElem = document.getElementById("locations");
	const angleIndicator = document.getElementById("angleIndicator");
	const locationsIndicatorElem = document.querySelector("#indicatorbtn");

	const closeShareButton = document.querySelector("#closesharebtn");
	const shareElem = document.querySelector("#share");
	const shareButton = document.querySelector("#sharebtn");

	const closeInfoButton = document.querySelector("#closeinfobtn");
	const infoElem = document.querySelector("#info");
	const infoButton = document.querySelector("#infobtn");
	const infoResizer = document.querySelector("#resizer");

	const likeButton = document.querySelector("#likebtn");
	const commentButton = document.querySelector("#commentbtn");
	const commentsElem = document.querySelector("#comments");

	const btnPlayVideo = document.querySelector("#btn-playvideo");
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

	const infoLocationButton = document.querySelector(".show-loc");
	const infoDetailsButton = document.querySelector(".show-info");
	const infoLocationContainer = document.querySelector("#info-location");
	const infoDetailsContainer = document.querySelector("#info-details");

	infoLocationButton.addEventListener("click", () => {
		infoLocationContainer.style.display = "block";
		document.querySelector("#info-location").scrollTop = 0;
		infoDetailsContainer.style.display = "none";
		infoLocationButton.classList.add("showactive");
		infoDetailsButton.classList.remove("showactive");
	});

	infoDetailsButton.addEventListener("click", () => {
		infoDetailsContainer.style.display = "block";
		document.querySelector("#info-details").scrollTop = 0;
		infoLocationContainer.style.display = "none";
		infoLocationButton.classList.remove("showactive");
		infoDetailsButton.classList.add("showactive");
	});

	const ShareLinkButton = document.querySelector(".show-link");
	const ShareEmbedButton = document.querySelector(".show-embed");
	const ShareLinkContainer = document.querySelector("#share-link");
	const ShareEmbedContainer = document.querySelector("#share-embed");

	ShareLinkButton.addEventListener("click", () => {
		ShareLinkContainer.style.display = "block";
		ShareEmbedContainer.style.display = "none";
		ShareLinkButton.classList.add("showactive");
		ShareEmbedButton.classList.remove("showactive");
	});

	ShareEmbedButton.addEventListener("click", () => {
		ShareEmbedContainer.style.display = "block";
		ShareLinkContainer.style.display = "none";
		ShareLinkButton.classList.remove("showactive");
		ShareEmbedButton.classList.add("showactive");
	});

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
		rightButtons.style.opacity = "1";
	}

	function viewContainerFadeOut() {
		locationsElem.style.opacity = "0";
		angleIndicator.style.opacity = "0";
		settingsButton.style.opacity = "0";
		zoomLevel.style.opacity = "0";
		mapButton.style.opacity = "0";
		rightButtons.style.opacity = "0";
	}

	// Start by showing the UI
	viewContainerFadeIn();

	document.addEventListener("keydown", (e) => {
		if (e.key === "h" || e.key === "H") {
			const one = document.querySelector("#view-container");
			const two = document.querySelector("#outside");
			const commentInput = document.querySelector("#commentInputField");

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
	data.locations.forEach((item) => {
		item = "<li></li>";
		locationsUl.insertAdjacentHTML("afterbegin", item);
	});

	if (dataType === "project" && data.project && data.project.showlocations === true) {
		// Do nothing
	} else {
		document.querySelector("#indicatorbtn").remove();
	}

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
	rootElement.appendChild(renderer.domElement);

	// Setup CSS2DRenderer
	const labelRenderer = new CSS2DRenderer();
	labelRenderer.setSize(window.innerWidth, window.innerHeight);
	labelRenderer.domElement.style.position = "absolute";
	labelRenderer.domElement.style.top = "0px";
	labelRenderer.domElement.style.pointerEvents = "none";
	rootElement.appendChild(labelRenderer.domElement);

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

	// Create a video element for video content
	const video = document.createElement("video");

	// Initialize currentVideoSrc with the URL of the initial video
	let currentVideoSrc;
	let currentImageSrc;

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

	console.log("Render locations list for project...");

	// For loop the locations list with data information
	for (let i = 0; i < data.locations.length; i++) {
		const content = data.locations[i];
		let activeClass = i === 0 && content.file_type === "video" ? "active" : "";
		let imageUrl = content.file_name.replace(/\.\w+$/, ".jpg");
		if (content.file_type === "video") {
			sceneType = "video";
			const fileNameWithoutExtension = imageUrl.split(".").slice(0, -1).join(".");
			let itemHtml = `<li class="${activeClass}" data-file="${content.file_name}" data-id="${content.id}" data-order_index="${content.order_index}" data-type="${content.file_type}">
                            <span class="icon-video">${content.duration}</span>
                            <div>${content.location_title}</div>
                            <img src="${baseUrl}video/${fileNameWithoutExtension}-low.jpg" alt="" />
                        </li>`;
			locationsHtml += itemHtml;
		} else {
			sceneType = "image";
			const fileNameWithoutExtension = content.file_name.split(".").slice(0, -1).join(".");
			let itemHtml = `<li class="${activeClass}" data-file="${content.file_name}" data-id="${content.id}" data-order_index="${content.order_index}" data-type="${content.file_type}">
                            <div>${content.location_title}</div>
                            <img src="${baseUrl}img/${fileNameWithoutExtension}-low.jpg" alt="" />
                        </li>`;
			locationsHtml += itemHtml;
		}
	}

	// Insert the locations list to HTML
	const locationUl = document.querySelector("#locationlist");
	locationUl.innerHTML = locationsHtml;

	listItems = document.querySelectorAll("#locationlist li");

	// Function to set active in list and update scene
	function activateItem(item) {
		listItems.forEach((listItem) => {
			listItem.classList.remove("active");
		});

		item.classList.add("active");
		const orderId = item.getAttribute("data-order_index");
		// Call a function to change the 360 content based on the file name and type
		change360Content(parseInt(orderId));
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

	// Init, when all is added to the DOM
	checkFirstListItem();

	const startlocationsContainer = document.querySelectorAll(".startlocations");

	startlocationsContainer.forEach((container) => {
		var html = ``;

		data.locations.map((location) => {
			let imageUrl = location.file_name.replace(/\.\w+$/, ".jpg");
			const fileNameWithoutExtension = imageUrl.split(".").slice(0, -1).join(".");
			const mediaType = location.file_type === "video" ? "video" : "img";
			html += `<div class="start-location" data-id="${location.id}" data-order_index="${location.order_index}">
					<h5 class="title">${location.location_title}</h5>
					<div class="locimage">
						<img src="${baseUrl}${mediaType}/${fileNameWithoutExtension}-low.jpg" alt="" />
					</div>
				</div>`;
		});
		container.innerHTML = html;
	});

	const linkToShare = document.querySelector("#linktoshare");
	const allSelectStartLocation = document.querySelectorAll(".start-location");

	if (data.locations.length < locId) {
		selectStartLocation = 1;
	}

	allSelectStartLocation.forEach((item) => {
		item.addEventListener("click", () => {
			allSelectStartLocation.forEach((link) => {
				link.classList.remove("active");
			});

			const order = item.getAttribute("data-order_index");
			var filteredStartLocations = Array.from(allSelectStartLocation).filter(function (
				element
			) {
				return element.getAttribute("data-order_index") === order;
			});
			filteredStartLocations.forEach((loc) => {
				loc.classList.add("active");
			});
			selectStartLocation = order;
			updateShareLink();
			linkToShare.querySelector("span").textContent = shareLink;
		});
	});

	var startLocationsWithOrder = document.querySelectorAll(
		'.start-location[data-order_index="' + selectStartLocation + '"]'
	);

	startLocationsWithOrder.forEach((loc) => {
		loc.classList.add("active");
	});

	updateShareLink();
	linkToShare.querySelector("span").textContent = shareLink;

	document.querySelector("#lookatx").addEventListener("change", (e) => {
		startLocX = e.target.value;
		updateShareLink();
		updateCameraRotation();
		linkToShare.querySelector("span").textContent = shareLink;
	});

	document.querySelector("#lookaty").addEventListener("change", (e) => {
		startLocY = e.target.value;
		updateShareLink();
		updateCameraRotation();
		linkToShare.querySelector("span").textContent = shareLink;
	});

	// Function to update camera's rotation based on input values
	function updateCameraRotation() {
		const pitch = THREE.MathUtils.degToRad(document.querySelector("#lookaty").value);
		const yaw = THREE.MathUtils.degToRad(document.querySelector("#lookatx").value);

		// Set camera's rotation based on pitch and yaw
		camera.rotation.set(yaw, pitch, 0);
		camera.position.set(yaw, pitch, 0);
		camera.lookAt(scene.position);
		camera.updateProjectionMatrix();
	}

	// Create a custom event dispatcher for the camera
	const dispatcher = new THREE.EventDispatcher();

	// Function to update input values based on camera rotation
	function updateInputValues() {
		// Get the camera's rotation angles
		const pitch = THREE.MathUtils.radToDeg(camera.rotation.x);
		const yaw = THREE.MathUtils.radToDeg(camera.rotation.y);

		// Update the input values
		document.querySelector("#lookatx").value = pitch;
		document.querySelector("#lookaty").value = yaw;
		updateShareLink();
		linkToShare.querySelector("span").textContent = shareLink;
	}

	// Listen for changes in camera's rotation
	dispatcher.addEventListener("cameraChange", updateInputValues);

	// Function to dispatch camera change event when camera rotation changes
	function onCameraChange() {
		dispatcher.dispatchEvent({ type: "cameraChange" });
	}

	// Register the event handler to be called when the camera's rotation changes
	camera.addEventListener("update", onCameraChange);

	// Define event listener functions
	function markerInternalLinksClickHandler(e) {
		e.preventDefault();
		let link = e.target;
		const orderId = link.getAttribute("data-order_index");
		change360Content(parseInt(orderId));
	}

	// Open Marker Container
	function markerInfoLabelsClickHandler(e) {
		if (!e.target.closest(".marker-container")) {
			e.preventDefault();

			let link = e.target;
			let hint = link.querySelector(".hint");
			let content = link.querySelector(".marker-container");
			let computedStyle = getComputedStyle(content);

			if (computedStyle.display === "none") {
				content.style.display = "block";
				if (content) {
					content.querySelector(".marker-content").scrollTop = 0;
					let soundContainer = content.querySelector(".soundplay");
					if (soundContainer) {
						let autoplayValue = soundContainer.getAttribute("data-autoplay");
						if (autoplayValue === "true") {
							let audioElement = soundContainer.querySelector("audio");
							if (audioElement) {
								if (audioElement.paused) {
									audioElement.play();
								} else {
									audioElement.pause();
									audioElement.currentTime = 0;
									audioElement.play();
								}
							}
						}
					}
				}
				hint.style.display = "none";
			} else {
				content.style.display = "none";
				hint.style.display = "block";
			}
		}
	}

	if (!userInteracted) {
		btnPlayVideo.addEventListener("click", () => {
			userInteracted = true;
			videoplayer.style.display = "flex";
			video.play();
			btnPlayVideo.style.display = "none";
		});
	}

	// Function to update scene with image or video
	function change360Content(orderId) {
		btnPlayVideo.style.display = "none";
		videoplayer.style.display = "none";
		// Once marker elements are available, add event listeners
		let markerInternalLinks = document.querySelectorAll(".intlink");
		let markerInfoLabels = document.querySelectorAll(".infodot");

		// Remove existing event listeners from markerInternalLinks
		markerInternalLinks.forEach((link) => {
			link.removeEventListener("click", markerInternalLinksClickHandler);
		});

		// Remove existing event listeners from markerInfoLabels
		markerInfoLabels.forEach((link) => {
			link.removeEventListener("click", markerInfoLabelsClickHandler);
		});

		let zoomImages = document.querySelectorAll(".zoom-image");
		zoomImages.forEach((image) => {
			image.removeEventListener("click", imageClickHandler);
		});

		labelContainerElem.innerHTML = "";
		infoElem.classList.remove("infoshow");
		let targetObject = data.locations.find((obj) => obj.order_index === orderId);
		let fileName = targetObject.file_name;
		let fileType = targetObject.file_type;
		let fileInfo = targetObject.info;

		markerData = targetObject.markers;

		// Remove all markers/labels
		root.clear();

		if (markerData !== "" && markerData !== null && markerData !== undefined) {
			// Call createMarkers function asynchronously
			console.log("Creating markers...");
			createMarkers(markerData).then(() => {
				setTimeout(() => {
					// Add click event listeners to zoom images
					zoomImages = document.querySelectorAll(".zoom-image");
					zoomImages.forEach((image) => {
						image.addEventListener("click", imageClickHandler);
						console.log(image);
					});
					console.log("Added eventlistener to images...", zoomImages);
					console.log("Markers created.");
				}, 100);
			});
		}

		if (fileType === "video") {
			// Check if the videoId is the same as the current video
			if (currentVideoSrc === fileName) {
				return; // No need to change the video if it's the same
			}

			sceneType = "video";
			let videoFile = fileName;
			currentImageSrc = "";

			// Remove the previous texture
			sphere.material.map = null;
			// Pause and remove the current video
			video.pause();
			video.src = "";
			currentVideoSrc = "";

			// Define the preloadHighQualityVideo function outside the condition
			function preloadHighQualityVideo(video, highQualitySrc) {
				const highQualityVideo = document.createElement("video");
				highQualityVideo.src = baseUrl + "video/" + highQualitySrc;
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
			const fileNameWithoutExtension = targetObject.file_name
				.split(".")
				.slice(0, -1)
				.join(".");
			if (!highSpeed) {
				videoFile = fileNameWithoutExtension + "-low.mp4";
				// Function to preload high-quality video

				preloadHighQualityVideo(video, fileName);
			}
			// Update the src attribute of the video element
			video.src = baseUrl + "video/" + videoFile;
			video.load();
			video.crossOrigin = "anonymous";
			video.loop = true;
			video.playsInline = true;

			// Update the current video source
			currentVideoSrc = fileName;

			// Check for captions
			if (targetObject.captions !== "") {
				captionButton.style.display = "block";
				const captionInputHTML = document.querySelector("#captionselect ul");
				let html = "";
				targetObject.captions.forEach((caption) => {
					html += `<li data-caption="${caption.caption_language}" data-id="${targetObject.id}">${caption.caption_language}</li>`;
				});
				html += '<li id="captionoff" class="active">Captions off</li>';
				captionInputHTML.innerHTML = html;

				const allCaptions = document.querySelectorAll("#captionselect ul li");

				function handleCaptionClick(event) {
					const targetId = event.target.getAttribute("data-id");
					let targetObj = data.locations.find((obj) => obj.id === parseInt(targetId));

					const captiontag = event.target.getAttribute("data-caption");
					const fileNameWithoutExtension = targetObj.file_name
						.split(".")
						.slice(0, -1)
						.join(".");

					// Construct the new file name with the desired caption
					const newSRTName = `${baseUrl}video/${fileNameWithoutExtension}-${captiontag}.srt`;
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

			if (!userInteracted) {
				btnPlayVideo.style.display = "block";
			} else {
				videoplayer.style.display = "flex";
				video.play();
			}

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
			// Check if the videoId is the same as the current video
			if (currentImageSrc === fileName) {
				return; // No need to change the video if it's the same
			}
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
			const fileNameWithoutExtension = targetObject.file_name
				.split(".")
				.slice(0, -1)
				.join(".");
			let imageFile = baseUrl + "img/" + fileName;
			if (!highSpeed) {
				imageFile = baseUrl + "img/" + fileNameWithoutExtension + "-low.jpg";
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
				let highQualityFileName = baseUrl + "img/" + fileName;
				preloadHighQualityImage(highQualityFileName, function (highQualityTexture) {
					// Once the high-quality image is loaded and processed, here you can do additional operations
					// For example, update the texture of a sphere mesh with the high-quality texture
					sphere.material.map = highQualityTexture;
					sphere.material.needsUpdate = true;
				});
			}

			currentImageSrc = fileName;
		} else {
			console.log("Invalid file type");
		}

		const showLocBtn = document.querySelector(".show-loc");
		const showInfoBtn = document.querySelector(".show-info");

		// Show/hide buttons if info
		if (fileInfo !== "" && fileInfo !== null && fileInfo !== undefined) {
			infoLocationContainer.style.display = "block";
			infoLocationContainer.innerHTML = fileInfo;

			showLocBtn.style.display = "block";
			showLocBtn.classList.add("showactive");
			showInfoBtn.classList.remove("showactive");
		} else {
			infoLocationContainer.style.display = "none";
			showLocBtn.style.display = "none";
			showInfoBtn.classList.add("showactive");
		}

		// Build comments section and add Emoji
		buildComments(targetObject, data.creator, data.user);

		const closeCommentsButton = document.querySelector("#closecommentsbtn");

		// Function to close comments
		function closeComments() {
			let commentButton = document.querySelector("#commentbtn");
			commentButton.style.opacity = "1";
			commentsElem.classList.remove("commentshow");
		}

		// Eventlistener for close comment button
		closeCommentsButton.addEventListener("click", closeComments);
		closeCommentsButton.addEventListener("touchstart", closeComments);
		closeCommentsButton.addEventListener("selectstart", closeComments);

		// Insert the total likes for location
		likeButton.querySelector(".amount").textContent = formatNumber(targetObject.likes_count);

		// Details username & thumbnail
		const userAnchor = document.querySelector(".user-details .userinfo a");
		userAnchor.textContent = data.user.username;
		userAnchor.href = "https://yourwebsite.com/profile/" + data.user.username;

		const userThumb = document.querySelector(".user-details .thumbnail");
		userThumb.href = "https://yourwebsite.com/profile/" + data.user.username;
		const userThumbImg = userThumb.querySelector("img");
		userThumbImg.src = data.user.thumbnail;

		document.querySelector("#info-details .title").textContent = targetObject.location_title;
		document.querySelector("#info-details .description").textContent =
			targetObject.location_description;
		document.querySelector(".details-likes span").textContent = formatNumber(
			targetObject.likes_count
		);
		document.querySelector(".details-views span").textContent = formatNumber(
			targetObject.views_count
		);
		document.querySelector(".details-created span").textContent = targetObject.registered;
		document.querySelector(".details-comments span").textContent = formatNumber(
			targetObject.total_comments
		);
		document.querySelector("#commentbtn .amount").textContent = formatNumber(
			targetObject.total_comments
		);

		camera.updateProjectionMatrix();
	}
	// End change360Content

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
			rootElement.classList.add("rootfullscreen");
		} else {
			// If in fullscreen mode, exit fullscreen
			if (document.exitFullscreen) {
				fullscreenButton.classList.remove("fullscreen");
				document.exitFullscreen();
				rootElement.classList.remove("rootfullscreen");
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
		let audioElements = document.querySelectorAll("audio");
		audioElements.forEach((audio) => {
			audio.volume = volume;
		});
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
		document.querySelector("#info-location").scrollTop = 0;
	}

	infoButton.addEventListener("click", openInfo);
	infoButton.addEventListener("touchstart", openInfo);
	infoButton.addEventListener("selectstart", openInfo);

	function closeInfo() {
		infoButton.style.opacity = "1";
		infoElem.classList.remove("infoshow");
	}

	closeInfoButton.addEventListener("click", closeInfo);
	closeInfoButton.addEventListener("touchstart", closeInfo);
	closeInfoButton.addEventListener("selectstart", closeInfo);

	function openShare() {
		shareButton.style.opacity = "0";
		shareElem.classList.add("infoshow");
	}

	shareButton.addEventListener("click", openShare);
	shareButton.addEventListener("touchstart", openShare);
	shareButton.addEventListener("selectstart", openShare);

	function closeShare() {
		shareButton.style.opacity = "1";
		shareElem.classList.remove("infoshow");
	}

	closeShareButton.addEventListener("click", closeShare);
	closeShareButton.addEventListener("touchstart", closeShare);
	closeShareButton.addEventListener("selectstart", closeShare);

	function openComments() {
		commentButton.style.opacity = "0";
		commentsElem.classList.add("commentshow");
	}

	commentButton.addEventListener("click", openComments);
	commentButton.addEventListener("touchstart", openComments);
	commentButton.addEventListener("selectstart", openComments);

	function checkFirstListItem() {
		const firstListItem = document.querySelector("#locations .container ul li:first-child");
		if (firstListItem) {
			if (locId > data.locations.length) {
				const orderId = data.locations[0].order_index;
				change360Content(parseInt(orderId));
				firstListItem.classList.add("active");
			} else {
				change360Content(parseInt(locId));
			}
		} else {
			// Retry after a delay if the first list item is not found
			setTimeout(checkFirstListItem, 1000); // Retry after 1 second
		}
	}

	document.addEventListener("DOMContentLoaded", function () {
		// What to do here?
	});

	const map = document.getElementById("map");
	const mapImage = document.getElementById("mapimage");
	const mapImg = document.getElementById("mapimg");

	mapImg.src = "https://snallapojkar.se/360/img/" + data.project.map_filename; // Set the source attribute for the image

	data.project.map_links.forEach((maplink) => {
		// Adjust to access the first element of mapArray
		let textrightClass = maplink.pos_left > 50 ? " linktextleft" : ""; // Conditionally add 'textright' class
		let html = `<div class="maplink ${textrightClass}" data-id="${maplink.link_location_id}" data-order_index="${maplink.link_order_index}" style="top: ${maplink.pos_top}%; left: ${maplink.pos_left}%">
            <span class="hint">${maplink.link_title}</span>
        </div>`;
		mapImage.insertAdjacentHTML("beforeend", html); // Adjust to add HTML at the end of mapImage
	});

	const mapLinks = document.querySelectorAll(".maplink");
	mapLinks.forEach((link) => {
		link.addEventListener("click", (event) => {
			const orderId = parseInt(event.target.getAttribute("data-order_index"));
			map.style.display = "none";
			listItems.forEach((listItem) => {
				listItem.classList.remove("active");
			});

			const activeListItem = document.querySelector(`#locations [data-id="${orderId}"]`);
			activeListItem.classList.add("active");
			change360Content(parseInt(orderId));
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
		if (map.style.display === "none" || map.style.display === "") {
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
		return new Promise((resolve) => {
			if (markerData.length === 0) {
				resolve(); // Resolve immediately if no marker data is provided
				return; // Exit the function
			}

			let markersCreated = 0; // Variable to track the number of markers created

			const checkMarkers = () => {
				let markerInternalLinks = document.querySelectorAll(".intlink");
				let markerInfoLabels = document.querySelectorAll(".infodot");

				if (markerInternalLinks.length > 0 && markerInfoLabels.length > 0) {
					clearInterval(interval); // Stop the interval

					// Add event listeners
					markerInternalLinks.forEach((link) => {
						link.addEventListener("click", markerInternalLinksClickHandler);
					});

					markerInfoLabels.forEach((link) => {
						link.addEventListener("click", markerInfoLabelsClickHandler);
					});

					// Resolve the promise once all markers are created
					if (markersCreated === markerData.length) {
						resolve();
					}
				}
			};

			// Check markers initially
			checkMarkers();

			// Check markers periodically
			const interval = setInterval(checkMarkers, 50);

			markerData.forEach((data, index) => {
				const {
					marker_title,
					pos_x,
					pos_y,
					pos_z,
					info,
					link,
					sound,
					autoplay,
					customcss,
				} = data;

				// Create a THREE.Vector3 instance from the position object
				const positionVector = new THREE.Vector3(pos_x, pos_y, pos_z);

				// Create marker element

				if (typeof link === "string" && link !== "" && !isNaN(link)) {
					// If the string represents a number
					marker = document.createElement("div");
					marker.dataset.order_index = parseInt(link); // Convert the string to a number
					marker.classList.add("intlink");
				} else if (typeof link === "string" && link !== "") {
					// If it's a regular string
					marker = document.createElement("a");
					marker.href = link;
					marker.target = "_blank";
					marker.classList.add("extlink");
				} else {
					// If it's neither a string nor a number
					marker = document.createElement("div");
					marker.classList.add("infodot");
				}

				let markerindex = index;
				marker.id = "marker" + markerindex;

				if (customcss !== "" && customcss !== null) {
					var cssArray = JSON.parse(customcss);

					// Define your CSS rules as a string
					var tag = "";

					cssArray.forEach((rule, index) => {
						// Add marker index and CSS rule to the tag string
						tag += "#marker" + markerindex + rule;
						// Add a space if it's not the last rule
						if (index !== cssArray.length - 1) {
							tag += " ";
						}
					});

					// Check if a <style> tag already exists
					var existingStyle = document.querySelector("style[data-customcss]");

					// If a <style> tag exists, append the CSS rules to its textContent
					if (existingStyle) {
						existingStyle.textContent += tag;
					} else {
						// Otherwise, create a new style element
						var style = document.createElement("style");

						style.textContent = tag;
						// Add a custom attribute to identify this style tag
						style.setAttribute("data-customcss", "");
						// Append the style element to the <head> of the document
						document.head.appendChild(style);
					}
				}

				let soundhtml = "";
				if (sound !== null && sound !== "") {
					soundhtml += `<div class="soundplay"`;

					if (autoplay) {
						soundhtml += ` data-autoplay="${autoplay}">`;
					} else {
						soundhtml += `>`;
					}

					soundhtml += `<audio controls id="audio${index}">
									<source src="../sound/${sound}" type="audio/mpeg">
								</audio>
							</div>`;
				}

				marker.classList.add("marker");

				let html = `<span class="hint">${marker_title}</span><div class="marker-container"><div class="marker-content"></div>`;
				marker.innerHTML = html;
				let markerContent = marker.querySelector(".marker-content");
				markerContent.insertAdjacentHTML("afterbegin", info);

				if (sound !== null && sound !== "") {
					let markerContainer = marker.querySelector(".marker-container");
					markerContainer.insertAdjacentHTML("afterbegin", soundhtml);
				}

				// Create CSS2DObject for marker/label
				const cssObject = new CSS2DObject(marker);
				cssObject.position.copy(positionVector);

				// Add CSS2DObject to the label renderer's scene (Root is a group)
				root.add(cssObject);
				markersCreated++;
			});

			camera.position.set(360, 0, 0);
			camera.rotation.set(360, 0, 0);
			camera.lookAt(scene.position);
			camera.updateProjectionMatrix();

			camera.position.x = -360;
			camera.rotation.x = -360;
			camera.lookAt(scene.position);
			camera.updateProjectionMatrix();
			render();

			console.log("Markers added to root.");
		});
	}

	if (
		navigator.userAgent
			.toLowerCase()
			.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)
	) {
		// It's a mobile device!
		console.log("You are using a mobile device.");
		window.addEventListener("deviceorientation", handleOrientation);
	}

	function handleOrientation(event) {
		// Use device orientation data to update camera rotation
		camera.rotation.x = (event.beta * Math.PI) / 180; // beta is the front-to-back tilt in degrees
		camera.rotation.y = (event.gamma * Math.PI) / 180; // gamma is the left-to-right tilt in degrees
		camera.rotation.z = (event.alpha * Math.PI) / 180; // alpha is the compass direction the device is facing in degrees
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
}
