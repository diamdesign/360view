import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";

// Set up Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a texture loader with linear encoding for correct color mapping
const loader = new THREE.TextureLoader();
const texture = loader.load("360.jpg", function (texture) {
	texture.wrapS = THREE.RepeatWrapping;
	texture.repeat.x = -1; // Flip texture horizontally
	texture.mapping = THREE.UVMapping; // Apply UV mapping
	texture.encoding = THREE.sRGBEncoding; // Set texture encoding to sRGB
	texture.gammaFactor = 2.2; // Adjust gamma correction (e.g., 2.2 for typical images)
});

// Create a sphere geometry for the 360 photo
const geometry = new THREE.SphereGeometry(60, 80, 80); // Increase the radius to 10

const material = new THREE.MeshStandardMaterial({
	map: texture,
	side: THREE.DoubleSide,
}); // Set side to DoubleSide
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Create ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Reduce intensity
scene.add(ambientLight);

// Create directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 4); // Reduce intensity
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

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
controls.maxDistance = 30; // Set maximum zoom distance
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
			const imageId = item.getAttribute("data-image");

			// Call a function to change the 360 image based on the imageId
			change360Image(imageId);
		});
	});

	// Function to change the 360 image
	function change360Image(imageId) {
		// Load the new image based on the imageId
		const textureLoader = new THREE.TextureLoader();

		const texture = loader.load(`${imageId}.jpg`, function (texture) {
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
