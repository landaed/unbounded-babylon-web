var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
  engine.runRenderLoop(function () {
      if (sceneToRender && sceneToRender.activeCamera) {
          sceneToRender.render();
      }
  });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };

var createScene = function () {
// This creates a basic Babylon Scene object (non-mesh)
var scene = new BABYLON.Scene(engine);

var camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(90), BABYLON.Tools.ToRadians(65), 10, BABYLON.Vector3.Zero(), scene);

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7;

// Our built-in 'ocean' shape.
var ocean = BABYLON.MeshBuilder.CreateGround("ocean", {width: 600, height: 600, subdivisions: 256, updatable: true}, scene);
var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 600, height: 600, subdivisions: 256, updatable: true}, scene);
ground.position.y =10;
var oceanShaderMat = new BABYLON.ShaderMaterial("shader", scene, "./shaders/oceanShader", {
  attributes: ["position", "normal", "uv", "colour1", "colour2"],
  uniforms: [
      "world", "worldView", "worldViewProjection", "view",
      "projection", "albedoMatrix", "cameraDirection", "camPos"
  ],
  defines: ["NORMAL"]
});

var groundShaderMat = new BABYLON.ShaderMaterial("shader", scene, "./shaders/groundShader", {
  attributes: ["position", "normal", "uv", "colour1", "colour2"],
  uniforms: [
      "world", "worldView", "worldViewProjection", "view",
      "projection", "albedoMatrix", "cameraDirection", "camPos"
  ],
  defines: ["NORMAL"]
});

let oceanTexture = new BABYLON.Texture(Assets.textures.checkerboard_basecolor_png.rootUrl, scene);
oceanShaderMat.setTexture("textureSampler", oceanTexture);
oceanShaderMat.alpha = false;
let groundTexture = new BABYLON.Texture(Assets.textures.checkerboard_basecolor_png.rootUrl, scene);
groundShaderMat.setTexture("textureSampler", groundTexture);

oceanShaderMat.setFloat("waveScale", .1);
oceanShaderMat.setFloat("waveSpeed", 1);

groundShaderMat.setFloat("groundScale", .1);
groundShaderMat.setFloat("groundOffset", 10);
groundShaderMat.setFloat("groundHeight", 30);
//
ocean.material = oceanShaderMat;
ground.material = groundShaderMat;
BABYLON.SceneLoader.ImportMesh("", Assets.meshes.Yeti.rootUrl, Assets.meshes.Yeti.filename, scene, function(newMeshes){
  newMeshes[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
});
var time = 0;

scene.onBeforeRenderObservable.add(() => {
  time+=.001;

  oceanShaderMat.setFloat("iTime", time*50);
  oceanShaderMat.setFloat("time", time*50);
  //groundShaderMat.setFloat("groundOffset", time*50);
  oceanShaderMat.setColor3("camPos", new BABYLON.Color3(camera.globalPosition.x,camera.globalPosition.y,camera.globalPosition.z));
  });

  // GUI

  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  var panel = new BABYLON.GUI.StackPanel();
  panel.width = "220px";
  panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  advancedTexture.addControl(panel);

  var header = new BABYLON.GUI.TextBlock();
  header.text = "Wave Scale: 0.1";
  header.height = "30px";
  header.color = "white";
  panel.addControl(header);

  var slider = new BABYLON.GUI.Slider();
  slider.minimum = 0;
  slider.maximum = 1.;
  slider.value = 0;
  slider.isVertical = true;
  slider.height = "200px";
  slider.width = "20px";
  slider.onValueChangedObservable.add(function(value) {
      header.text = "Wave Scale: " + value;
      oceanShaderMat.setFloat("waveScale", value);
  });
  panel.addControl(slider);


  var speedPanel = new BABYLON.GUI.StackPanel();
  speedPanel.width = "220px";
  speedPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  speedPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  advancedTexture.addControl(speedPanel);

  var speedHeader = new BABYLON.GUI.TextBlock();
  speedHeader.text = "Wave Speed: 0.1";
  speedHeader.height = "30px";
  speedHeader.color = "white";
  speedPanel.addControl(speedHeader);

  var speedSlider = new BABYLON.GUI.Slider();
  speedSlider.minimum = 0;
  speedSlider.maximum = 100.;
  speedSlider.value = 0;
  speedSlider.isVertical = true;
  speedSlider.height = "200px";
  speedSlider.width = "20px";
  speedSlider.onValueChangedObservable.add(function(value) {
      speedHeader.text = "Wave Speed: " + value;
      oceanShaderMat.setFloat("waveSpeed", value);
  });
  speedPanel.addControl(speedSlider);

return scene;
};
          window.initFunction = async function() {


              var asyncEngineCreation = async function() {
                  try {
                  return createDefaultEngine();
                  } catch(e) {
                  console.log("the available createEngine function failed. Creating the default engine instead");
                  return createDefaultEngine();
                  }
              }

              window.engine = await asyncEngineCreation();
  if (!engine) throw 'engine should not be null.';
  startRenderLoop(engine, canvas);
  window.scene = createScene();};
  initFunction().then(() => {sceneToRender = scene
  });

  // Resize
  window.addEventListener("resize", function () {
      engine.resize();
  });
