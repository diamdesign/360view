import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scrollableContent = document.getElementById("scrollable");
const labelContainerElem = document.querySelector("#labels");

var imageArray = [
	{
		id: 1,
		image: "360.jpg",
		title: "One",
	},
	{
		id: 2,
		image: "3602.jpg",
		title: "Two",
	},
	{
		id: 3,
		image: "3603.jpg",
		title: "Three",
	},
	{
		id: 4,
		image: "3604.jpg",
		title: "Four",
	},
	{
		id: 5,
		image: "3605.jpg",
		title: "Five",
	},
	{
		id: 6,
		image: "3606.jpg",
		title: "Six",
	},
	{
		id: 7,
		image: "3607.jpg",
		title: "Seven",
	},
];

let locationhtml = ``;
imageArray.forEach((image, index) => {
	// Determine if this is the first item and set the appropriate class
	let activeClass = index === 0 ? "active" : "";

	locationhtml += `<li class="${activeClass}" data-image="${image.image}" data-id="${image.id}">
                    <div>${image.title}</div>
                    <img src="img/${image.image}" alt="" />
                </li>`;
});

const locationElem = document.querySelector("#locations ul");
locationElem.innerHTML = locationhtml;

const listItems = document.querySelectorAll("li");
// Add click event listener to each <li> element
listItems.forEach(function (item) {
	item.addEventListener("click", function () {
		// Get the value of the data-image attribute

		listItems.forEach((item) => {
			item.classList.remove("active");
		});

		item.classList.add("active");
		const imageId = item.getAttribute("data-image");

		// Call a function to change the 360 image based on the imageId
		change360Image(imageId);
	});
});

// Set up Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a texture loader with linear encoding for correct color mapping
const loader = new THREE.TextureLoader();
const texture = loader.load("img/" + imageArray[0].image, function (texture) {
	texture.wrapS = THREE.RepeatWrapping;
	texture.repeat.x = -1; // Flip texture horizontally
	texture.mapping = THREE.UVMapping; // Apply UV mapping
	texture.encoding = THREE.sRGBEncoding; // Set texture encoding to sRGB
	texture.gammaFactor = 2.2; // Adjust gamma correction (e.g., 2.2 for typical images)
});

// Create a sphere geometry for the 360 photo
const geometry = new THREE.SphereGeometry(100, 80, 80); // Increase the radius to 10

const material = new THREE.MeshStandardMaterial({
	map: texture,
	side: THREE.DoubleSide,
}); // Set side to DoubleSide
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Create ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 4); // Reduce intensity
scene.add(ambientLight);
/*
// Create directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 4); // Reduce intensity
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);
*/
// Add mouse controls to the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = -1;

/* Add point
// Create a point geometry and material
const pointGeometry = new THREE.BufferGeometry();
const vertices = []; // Array to store point coordinates

vertices.push(40, -0.8, 30); // Add another point at (50, -0.8, 30), for example
pointGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3)); // Set point positions

// Custom shader material for the points
const pointMaterial = new THREE.ShaderMaterial({
	uniforms: {
		color: { value: new THREE.Color(0x000000) }, // Black color
		size: { value: 20 }, // Point size
	},
	vertexShader: `
    uniform float size;
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / length(mvPosition.xyz));
      gl_Position = projectionMatrix * mvPosition;
    }`,
	fragmentShader: `
    uniform vec3 color;
    void main() {
      if (length(gl_PointCoord - vec2(0.5)) > 0.5) discard;
      gl_FragColor = vec4(color, 1.0);
    }`,
	transparent: true, // Make the material transparent
});

// Create points mesh
const points = new THREE.Points(pointGeometry, pointMaterial);
scene.add(points);
*/

// Set camera position
camera.position.set(0, 0, 1); // Move the camera further from the object
controls.minDistance = 0.1; // Set a minimum zoom distance that allows zooming in closer
controls.maxDistance = 50; // Set maximum zoom distance
controls.zoomSpeed = 10; // Adjust zoom speed

/*
// Create a helper object to track the position in front of the camera
const lightHelper = new THREE.Object3D();
camera.add(lightHelper);

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

function change360Image(imageId) {
	// Load the new image based on the imageId
	const textureLoader = new THREE.TextureLoader();

	const texture = loader.load(`img/${imageId}`, function (texture) {
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
