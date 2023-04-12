// Create the Babylon.js engine

var canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, alpha: true });


// Create the scene
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
// Load the custom font file
var fontUrl = "/nulshock/nulshock bd.otf";
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

var fireShader = new BABYLON.ShaderMaterial("shader", scene, "./shaders/fire", {
   attributes: ["position", "normal", "uv", "colour1", "colour2"],
   uniforms: [
       "world", "worldView", "worldViewProjection", "view",
       "projection", "albedoMatrix", "iTime", "lightPos", "alpha","radius","centre"
   ],
   defines: ["NORMAL"]
});
fireShader.alpha =0;
fireShader.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
fireShader.backFaceCulling = false;
fireShader.setFloat("radius", .5);

//lowPlyRocks.fbx
let rocks;
BABYLON.SceneLoader.ImportMesh("","/models/", "lowPlyRocks.glb", scene, function (newMeshes) {
  rocks = newMeshes[0];
  rocks.position.x=0;
  rocks.position.y=0;
  rocks.position.z=0;
  rocks.scaling.x=1;
  rocks.scaling.y=1;
});
BABYLON.SceneLoader.ImportMesh("","/models/", "lowPlyRocks.glb", scene, function (newMeshes) {
  rocks = newMeshes[0];
  rocks.position.x=1;
  rocks.position.y=1;
  rocks.position.z=0;
  rocks.scaling.x=.5;
  rocks.scaling.y=2;
});
BABYLON.SceneLoader.ImportMesh("","/models/", "lowPlyRocks.glb", scene, function (newMeshes) {
  rocks = newMeshes[0];
  rocks.position.x=-1;
  rocks.position.y=1;
  rocks.position.z=-1;
  rocks.scaling.x=1;
  rocks.scaling.y=2;
  rocks.scaling.z=1;
});
var layerAmount = 10;
var fire;
for(var i = 0; i < layerAmount; i++){
  const water = BABYLON.MeshBuilder.CreateDisc("1", { radius: 3-(i*.5), tessellation: 512}, scene);
  water.name = "1"// set a name for the mesh
  water.position.x = 0;
  water.position.y = .1;
  water.position.z = 0;
  water.rotation.x=Math.PI/2;
  water.material = waterShader;

  fire = BABYLON.MeshBuilder.CreateDisc("2", { radius: .5-(i*.1), tessellation: 512}, scene);
  fire.name = "2"// set a name for the mesh
  fire.position.x = 0;
  fire.position.y = 1.3-(i/(layerAmount*8));
  fire.position.z = 0;
  fire.scaling.x =.5;
  fire.scaling.y =.5;
  fire.material = fireShader;
}
for(var i = 0; i < 4; i++){
  var cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", {diameter: .1, height: .6, tessellation: 8}, scene);
  cylinder.position.y=1.05;
  cylinder.rotation.x=Math.PI/2;
  cylinder.rotation.y=i+.5;
}
var camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 5, new BABYLON.Vector3(0, 1, 0), scene);
camera.alpha = Math.PI/2;
camera.beta = Math.PI/2;



// Create a basic light
var light = new BABYLON.PointLight("yellowPointLight", new BABYLON.Vector3(0, 1.4, 1), scene);
light.diffuse = new BABYLON.Color3(1, .5, 0); // Set the light color to yellow
light.intensity =.1;

var startTime = Date.now();
var currSel = -1;
const rotationSpeed = 0.002;

scene.registerBeforeRender(function() {

   var currentTime = (Date.now() - startTime) / 1000;
   light.intensity =Math.sin(currentTime+Math.random())+4;
    waterShader.setFloat("iTime", currentTime);
    waterShader.setFloat("iTime", currentTime);
    waterShader.setFloat("currSel",currSel);
    fireShader.setFloat("iTime", currentTime);
    fireShader.setFloat("iTime", currentTime);
    fireShader.setFloat("currSel",currSel);
    camera.alpha += rotationSpeed;
    fire.rotation.y+=rotationSpeed;
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
