// Create the Babylon.js engine

var canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, alpha: true });


// Create the scene
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);


// Create the camera
const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 20, new BABYLON.Vector3(0, 0, 0), scene);
//camera.attachControl(canvas, true);

// Add a light
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.7;


// Setup the materials
var waterfallShader = new BABYLON.ShaderMaterial("shader", scene, "./assets/shaders/waterfall", {
  attributes: ["position", "normal", "uv", "colour1", "colour2"],
  uniforms: [
      "world", "worldView", "worldViewProjection", "view",
      "projection", "albedoMatrix", "iTime", "lightPos", "alpha", "textureSampler"
  ],
  defines: ["NORMAL"]
});
waterfallShader.alpha =0;
waterfallShader.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
waterfallShader.backFaceCulling = false;

// Setup the materials
var foamShader = new BABYLON.ShaderMaterial("shader", scene, "./assets/shaders/foam", {
  attributes: ["position", "normal", "uv", "colour1", "colour2"],
  uniforms: [
      "world", "worldView", "worldViewProjection", "view",
      "projection", "albedoMatrix", "iTime", "lightPos", "alpha", "textureSampler"
  ],
  defines: ["NORMAL"]
});

var animeWaterShader = new BABYLON.ShaderMaterial("shader", scene, "./assets/shaders/animeWater", {
  attributes: ["position", "normal", "uv", "colour1", "colour2"],
  uniforms: [
      "world", "worldView", "worldViewProjection", "view",
      "projection", "albedoMatrix", "iTime", "lightPos", "alpha", "textureSampler"
  ],
  defines: ["NORMAL"]
});
animeWaterShader.alpha =0;
animeWaterShader.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
animeWaterShader.backFaceCulling = false;

const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1.5 }, scene);
sphere.position.y=4.5;
//sphere.renderingGroupId = 1;
sphere.material = foamShader;
const sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1.5 }, scene);
sphere2.position.y=-.9;
//sphere2.position.z=.7;

//sphere2.renderingGroupId = 1;
sphere2.material = foamShader;

// Create the cube
const cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", { height: 5, diameter: 1 }, scene);
cylinder.position.y = 2;

cylinder.material = waterfallShader;
const water = BABYLON.MeshBuilder.CreateDisc("1", { radius: 3, tessellation: 512}, scene);
water.rotation.x=Math.PI/2;
water.position.y=-1;
water.material = animeWaterShader;
//water.renderingGroupId = 1;


const rotationSpeed = 0.002;
var startTime = Date.now();

scene.registerBeforeRender(function() {
  var currentTime = (Date.now() - startTime) / 1000;
  waterfallShader.setFloat("iTime", currentTime);
  foamShader.setFloat("iTime", currentTime);
  animeWaterShader.setFloat("iTime", currentTime);

  // Update camera rotation
  camera.alpha += rotationSpeed;
});

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener('resize', () => {
  engine.resize();
});
