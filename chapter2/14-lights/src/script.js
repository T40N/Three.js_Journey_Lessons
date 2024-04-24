import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// add group to gui
const ambientFolder = gui.addFolder("Ambient Light");
scene.add(ambientLight);
ambientFolder.add(ambientLight, "visible");
ambientFolder.add(ambientLight, "intensity").min(0).max(3).step(0.01);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 1);
const directionalFolder = gui.addFolder("Directional Light");
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);
directionalFolder.add(directionalLight, "visible");
directionalFolder.add(directionalLight, "intensity").min(0).max(3).step(0.01);
directionalFolder.add(directionalLight.position, "x").min(-5).max(5).step(0.01);
directionalFolder.add(directionalLight.position, "y").min(-5).max(5).step(0.01);
directionalFolder.add(directionalLight.position, "z").min(-5).max(5).step(0.01);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 2);
const hemisphereFolder = gui.addFolder("Hemisphere Light");
scene.add(hemisphereLight);
hemisphereFolder.add(hemisphereLight, "visible");
hemisphereFolder.add(hemisphereLight, "intensity").min(0).max(3).step(0.01);

const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
const pointFolder = gui.addFolder("Point Light");
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);
pointFolder.add(pointLight, "visible");
pointFolder.add(pointLight, "intensity").min(0).max(3).step(0.01);
pointFolder.add(pointLight.position, "x").min(-5).max(5).step(0.01);
pointFolder.add(pointLight.position, "y").min(-5).max(5).step(0.01);
pointFolder.add(pointLight.position, "z").min(-5).max(5).step(0.01);

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1);
const rectFolder = gui.addFolder("Rect Area Light");
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);
rectFolder.add(rectAreaLight, "visible");
rectFolder.add(rectAreaLight, "intensity").min(0).max(3).step(0.01);
rectFolder.add(rectAreaLight.position, "x").min(-5).max(5).step(0.01);
rectFolder.add(rectAreaLight.position, "y").min(-5).max(5).step(0.01);
rectFolder.add(rectAreaLight.position, "z").min(-5).max(5).step(0.01);

const spotLight = new THREE.SpotLight(
  0x78ff00,
  4.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
const spotFolder = gui.addFolder("Spot Light");
spotLight.position.set(0, 2, 3);
scene.add(spotLight);
spotFolder.add(spotLight, "visible");
spotFolder.add(spotLight, "intensity").min(0).max(3).step(0.01);
spotFolder.add(spotLight.position, "x").min(-5).max(5).step(0.01);
spotFolder.add(spotLight.position, "y").min(-5).max(5).step(0.01);
spotFolder.add(spotLight.position, "z").min(-5).max(5).step(0.01);
spotFolder.add(spotLight, "angle").min(0).max(Math.PI).step(0.01);
spotFolder.add(spotLight, "penumbra").min(0).max(1).step(0.01);
spotFolder.add(spotLight, "decay").min(0).max(2).step(0.01);

// Helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
