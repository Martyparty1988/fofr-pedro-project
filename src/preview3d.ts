import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export async function boot() {
  const canvas = document.getElementById("viewport") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error("Could not find canvas element with id 'viewport'");
  }

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
  renderer.setSize(960, 540);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  // Camera
  const camera = new THREE.PerspectiveCamera(60, 960 / 540, 0.1, 100);
  camera.position.set(3, 2, 4);
  camera.lookAt(0, 0, 0);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0.8, 0); // Target the character's upper body

  // Lights
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
  dirLight.position.set(3, 10, 10);
  dirLight.castShadow = true;
  scene.add(dirLight);

  // Grid
  const grid = new THREE.GridHelper(10, 10);
  scene.add(grid);

  // GLTF Loader
  const loader = new GLTFLoader();
  
  // Load multiple models
  const models = [
    { path: "/assets/3d/characters/kenney3d_char_pedro.glb", position: [0, 0, 0], scale: 1, name: "Pedro" },
    { path: "/assets/3d/props/kenney3d_prop_scooter.glb", position: [2, 0, 0], scale: 1, name: "Scooter" },
    { path: "/assets/3d/props/kenney3d_prop_car01.glb", position: [-2, 0, 1], scale: 1, name: "Car 1" },
    { path: "/assets/3d/props/kenney3d_prop_car02.glb", position: [-2, 0, -1], scale: 1, name: "Car 2" },
    { path: "/assets/3d/env/kenney3d_env_house01.glb", position: [4, 0, 2], scale: 1, name: "House 1" },
    { path: "/assets/3d/env/kenney3d_env_house02.glb", position: [4, 0, -2], scale: 1, name: "House 2" },
    { path: "/assets/3d/env/kenney3d_env_tree01.glb", position: [-4, 0, 2], scale: 1, name: "Tree" },
    { path: "/assets/3d/env/kenney3d_env_bush01.glb", position: [-4, 0, -2], scale: 1, name: "Bush" },
    { path: "/assets/3d/env/kenney3d_env_sign01.glb", position: [0, 0, 3], scale: 1, name: "Sign" },
  ];

  let loadedCount = 0;
  for (const model of models) {
    try {
      const gltf = await loader.loadAsync(model.path);
      const object = gltf.scene;
      object.scale.set(model.scale, model.scale, model.scale);
      object.position.set(model.position[0], model.position[1], model.position[2]);
      scene.add(object);
      loadedCount++;
      console.log(`Successfully loaded ${model.name} model.`);
    } catch (error) {
      console.error(`Failed to load ${model.name} model from ${model.path}:`, error);
      // Add a placeholder
      const placeholder = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.5, 0.5),
          new THREE.MeshStandardMaterial({ color: 0xff0000 })
      );
      placeholder.position.set(model.position[0], model.position[1] + 0.25, model.position[2]);
      scene.add(placeholder);
    }
  }
  
  console.log(`Loaded ${loadedCount}/${models.length} models successfully.`);
  
  // Animation Loop
  function tick() {
    requestAnimationFrame(tick);
    controls.update(); // only required if controls.enableDamping = true
    renderer.render(scene, camera);
  }
  tick();
}
