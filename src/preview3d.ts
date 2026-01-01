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
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  const resizeRenderer = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  // Camera
  const aspect = window.innerWidth / window.innerHeight || 960 / 540;
  const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
  camera.position.set(3, 2, 4);
  camera.lookAt(0, 0, 0);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0.8, 0); // Target the character's upper body
  controls.minDistance = 2;
  controls.maxDistance = 15;
  controls.maxPolarAngle = Math.PI * 0.45;

  // Lights
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
  dirLight.position.set(3, 10, 10);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

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

  const status = document.createElement("div");
  status.style.position = "fixed";
  status.style.left = "16px";
  status.style.bottom = "16px";
  status.style.padding = "10px 14px";
  status.style.background = "rgba(0, 0, 0, 0.6)";
  status.style.color = "#f5f5f5";
  status.style.fontFamily = "sans-serif";
  status.style.fontSize = "14px";
  status.style.borderRadius = "8px";
  status.style.boxShadow = "0 4px 12px rgba(0,0,0,0.35)";
  status.textContent = `Loading models… 0/${models.length}`;
  document.body.appendChild(status);

  let loadedCount = 0;
  let failedCount = 0;
  for (const model of models) {
    try {
      const gltf = await loader.loadAsync(model.path);
      const object = gltf.scene;
      object.scale.set(model.scale, model.scale, model.scale);
      object.position.set(model.position[0], model.position[1], model.position[2]);
      scene.add(object);
      loadedCount++;
      status.textContent = `Loading models… ${loadedCount}/${models.length}`;
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
      failedCount++;
    }
  }

  console.log(`Loaded ${loadedCount}/${models.length} models successfully.`);
  status.textContent = failedCount
      ? `Finished with ${failedCount} issue(s). Loaded ${loadedCount}/${models.length}.`
      : "All models loaded successfully.";
  setTimeout(() => status.remove(), 2500);

  resizeRenderer();
  window.addEventListener("resize", resizeRenderer);

  // Animation Loop
  function tick() {
    requestAnimationFrame(tick);
    controls.update(); // only required if controls.enableDamping = true
    renderer.render(scene, camera);
  }
  tick();
}
