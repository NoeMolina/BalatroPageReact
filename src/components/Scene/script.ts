import { RefObject } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//Global variables
let currentRef: { clientWidth: number; clientHeight: number; appendChild: (arg0: HTMLCanvasElement) => void; removeChild: (arg0: HTMLCanvasElement) => void; } | null = null;

//Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, 100 / 100, 0.1, 100);
scene.add(camera);
camera.position.set(5, 5, 5);
camera.lookAt(new THREE.Vector3());

const renderer = new THREE.WebGLRenderer();
renderer.setSize(100, 100);

//OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

//Resize canvas
const resize = () => {
  if (currentRef) {
    renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
    camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
  }
  camera.updateProjectionMatrix();
};
window.addEventListener("resize", resize);

//Animate the scene
const animate = () => {
  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();

//cube
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);
scene.add(cube);

//Init and mount the scene
export const initScene = (mountRef: RefObject<{ clientWidth: number; clientHeight: number; appendChild: (arg0: HTMLCanvasElement) => void; removeChild: (arg0: HTMLCanvasElement) => void; } | null>) => {
  currentRef = mountRef.current;
  resize();
  if (currentRef) {
    currentRef.appendChild(renderer.domElement);
  }
};

//Dismount and clena up the buffer from the scene
export const cleanUpScene = () => {
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    }
  });
  if (currentRef) {
    currentRef.removeChild(renderer.domElement);
  }
};