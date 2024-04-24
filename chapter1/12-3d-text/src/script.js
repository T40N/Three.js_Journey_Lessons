import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(2);
axesHelper.visible = false;
scene.add(axesHelper);
gui.add(axesHelper, "visible").name("Axes Helper");

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcaps = [];
for (let i = 1; i <= 8; i++) {
  matcaps.push(textureLoader.load(`/textures/matcaps/${i}.png`));
  matcaps[i - 1].colorSpace = THREE.SRGBColorSpace;
}

// Fonts
const fontLoader = new FontLoader();
let textGeometry;
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  textGeometry = new TextGeometry("Hello Three.js", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  textGeometry.center();
  //   console.log(textGeometry.parameters);
  //   textGeometry.computeBoundingBox();
  //   textGeometry.translate(
  //     -(
  //       textGeometry.boundingBox.max.x - textGeometry.parameters.options.bevelSize
  //     ) * 0.5,
  //     -(
  //       textGeometry.boundingBox.max.y - textGeometry.parameters.options.bevelSize
  //     ) * 0.5,
  //     -(
  //       textGeometry.boundingBox.max.z -
  //       textGeometry.parameters.options.bevelThickness
  //     ) * 0.5
  //   );
  //   textGeometry.computeBoundingBox();
  //   console.log(textGeometry.boundingBox);

  const material = new THREE.MeshMatcapMaterial({ matcap: matcaps[0] });
  scene.add(new THREE.Mesh(textGeometry, material));
});

const donuts = [];
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcaps[0] });

console.time("donuts");
for (let i = 0; i < 100; i++) {
  donuts.push(new THREE.Mesh(donutGeometry, donutMaterial));
  donuts[i].position.x = (Math.random() - 0.5) * 10;
  donuts[i].position.y = (Math.random() - 0.5) * 10;
  donuts[i].position.z = (Math.random() - 0.5) * 10;
  donuts[i].rotation.x = Math.random() * Math.PI;
  donuts[i].rotation.y = Math.random() * Math.PI;
  donuts[i].rotation.z = Math.random() * Math.PI;

  const scale = Math.random();
  donuts[i].scale.set(scale, scale, scale);

  scene.add(donuts[i]);
}
console.timeEnd("donuts");

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

  // Update controls
  controls.update();

  // Update objects
  if (donuts && donuts.length > 0) {
    for (const donut of donuts) {
      donut.rotation.x += 0.01;
      donut.rotation.y += 0.01;
      donut.rotation.z += 0.01;
    }
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
