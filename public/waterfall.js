// Create the Babylon.js engine

var canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, alpha: true });


// Create the scene
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);


// Create the camera
const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 5, new BABYLON.Vector3(0, 0, 0), scene);
camera.attachControl(canvas, true);

// Add a light
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.7;


// Setup the materials
var waterfallShader = new BABYLON.ShaderMaterial("shader", scene, "./shaders/waterfall", {
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


// Create the cube
const cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", { height: 2, diameter: 1 }, scene);
cylinder.position.y = 0;

cylinder.material = waterfallShader;

var startTime = Date.now()
scene.registerBeforeRender(function() {
 var currentTime = (Date.now() - startTime) / 1000;
 waterfallShader.setFloat("iTime", currentTime);
});

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener('resize', () => {
  engine.resize();
});
