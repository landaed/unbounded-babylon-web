// Create the Babylon.js engine

var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

// Create the scene
var scene = new BABYLON.Scene(engine);
// Load the custom font file
var fontUrl = "path/to/Game Of Squids.ttf";
var font = new FontFace("Custom Font", "url(" + fontUrl + ")");

// Register the custom font with the document
font.load().then(function() {
 document.fonts.add(font);
});

// Setup the materials
var waterShader = new BABYLON.ShaderMaterial("shader", scene, "./shaders/water", {
  attributes: ["position", "normal", "uv", "colour1", "colour2"],
  uniforms: [
      "world", "worldView", "worldViewProjection", "view",
      "projection", "albedoMatrix", "iTime", "lightPos", "alpha"
  ],
  defines: ["NORMAL"]
});
waterShader.alpha =0;
waterShader.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
waterShader.backFaceCulling = false;
//lowPlyRocks.fbx
let rocks;
BABYLON.SceneLoader.ImportMesh("","https://cdn.jsdelivr.net/gh/landaed/unbounded-babylon-web@85860bcfb8bfe8173c4e9efbcf5fc2da880bdcaf/", "models/lowPlyRocks.fbx", scene, function (newMeshes) {
  rocks = newMeshes[0];
  rocks.position.z=-5;
});
var layerAmount = 10;
for(var i = 0; i < layerAmount; i++){
  const water = BABYLON.MeshBuilder.CreateDisc("1", { radius: 3-(i*.5), tessellation: 512}, scene);
  water.name = "1"// set a name for the mesh
  water.position.x = 0;
  water.position.y = .1;
  water.position.z = 0;
  water.rotation.x=2;
  water.material = waterShader;
}

var camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 5, new BABYLON.Vector3(0, 0, 0), scene);
camera.alpha = Math.PI/2;
camera.beta = Math.PI/2;

// Create a basic light
var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.diffuse = new BABYLON.Color3(.2,.2,1);
light.specular = new BABYLON.Color3(0, .4, 1);
light.intensity = 10;

var startTime = Date.now();
var currSel = -1;
scene.registerBeforeRender(function() {

   var currentTime = (Date.now() - startTime) / 1000;
    waterShader.setFloat("iTime", currentTime);
    waterShader.setFloat("iTime", currentTime);
    waterShader.setFloat("currSel",currSel);
});
scene.onPointerMove = function castRay() {
  var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);
  var hit = scene.pickWithRay(ray);
  if (hit.pickedMesh) {
      currSel = parseFloat(hit.pickedMesh.name);
  }
  else {
    currSel=-1;
  }
}

// Run the render loop
engine.runRenderLoop(function () {
    scene.render();
});

// Resize the canvas when the window is resized
window.addEventListener("resize", function () {
    engine.resize();
    engine.resize();
});
