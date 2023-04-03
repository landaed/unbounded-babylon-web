// Create the Babylon.js engine

var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

// Create the scene
var scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0.2, 0.2, 0.2, 1);
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
for(var i = 0; i < layerAmount; i++){
  const water = BABYLON.MeshBuilder.CreateDisc("1", { radius: 3-(i*.5), tessellation: 512}, scene);
  water.name = "1"// set a name for the mesh
  water.position.x = 0;
  water.position.y = .1;
  water.position.z = 0;
  water.rotation.x=2;
  water.material = waterShader;

  const fire = BABYLON.MeshBuilder.CreateDisc("2", { radius: .5-(i*.1), tessellation: 512}, scene);
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
var camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 5, new BABYLON.Vector3(0, 0, 0), scene);
camera.alpha = Math.PI/2;
camera.beta = Math.PI/2;

var heading1 = new BABYLON.DynamicTexture("text", {width:1024, height:512}, scene);
var ctx = heading1.getContext();
ctx.font = "bold 36px nulshock rg";
ctx.fillStyle = "red";
ctx.fillText("Realtime", 0, 100);
heading1.update();
// Set the texture as the diffuse texture for a mesh
var heading1Mesh = BABYLON.MeshBuilder.CreatePlane("heading1MeshMesh", {width: 5, height: 2}, scene);


heading1Mesh.material = new BABYLON.StandardMaterial("mat", scene);
heading1Mesh.material.diffuseTexture = heading1;
// Enable alpha blending
heading1Mesh.material.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
//researchTexMesh.material.alpha = 0;

// Set up a custom alpha test to only show the opaque pixels in the texture
heading1Mesh.material.diffuseTexture.hasAlpha = true;
heading1Mesh.material.diffuseTexture.getAlphaFromRGB = true;
heading1Mesh.material.diffuseTexture.getAlphaFromRGB = function (rgb) {
    return rgb.r;
};

heading1Mesh.rotation.y=Math.PI;
// Set the position and rotation of the mesh
heading1Mesh.position = new BABYLON.Vector3(-10,0,1);
heading1Mesh.isPickable = false;
heading1Mesh.material.emissiveColor = new BABYLON.Color3(1, 1, 1);

// Create a basic light
var light = new BABYLON.PointLight("yellowPointLight", new BABYLON.Vector3(0, 1.4, 1), scene);
light.diffuse = new BABYLON.Color3(1, .5, 0); // Set the light color to yellow
light.intensity =.1;

var startTime = Date.now();
var currSel = -1;
scene.registerBeforeRender(function() {

   var currentTime = (Date.now() - startTime) / 1000;
   light.intensity =Math.sin(currentTime+Math.random())+4;
    waterShader.setFloat("iTime", currentTime);
    waterShader.setFloat("iTime", currentTime);
    waterShader.setFloat("currSel",currSel);
    fireShader.setFloat("iTime", currentTime);
    fireShader.setFloat("iTime", currentTime);
    fireShader.setFloat("currSel",currSel);
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