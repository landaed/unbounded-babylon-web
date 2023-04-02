//Boiler plate setup

//------------------------------------------------------
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
//-------------------------------------------------------
var createScene = function () {
  var scene = new BABYLON.Scene(engine);

  //Adding a light
  var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 3, 0), scene);
  light.intensity = 50;
  var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3( -15, 3,0), scene);
  light2.intensity = 50;
  var light3 = new BABYLON.PointLight("light3", new BABYLON.Vector3(15, 3, -0), scene);
  light3.intensity = 50;

  //Adding a light
  var light4 = new BABYLON.PointLight("light4", new BABYLON.Vector3(0, 3, -10), scene);
  light4.intensity = 50;
  var light5 = new BABYLON.PointLight("light5", new BABYLON.Vector3( -15, 3,-10), scene);
  light5.intensity = 50;
  var light6 = new BABYLON.PointLight("light6", new BABYLON.Vector3(15, 3, -10), scene);
  light6.intensity = 50;

  //Adding a light
  var light7 = new BABYLON.PointLight("light7", new BABYLON.Vector3(0, 3, -20), scene);
  light7.intensity = 50;
  var light8 = new BABYLON.PointLight("light8", new BABYLON.Vector3( -15, 3,-20), scene);
  light8.intensity = 50;
  var light9 = new BABYLON.PointLight("light9", new BABYLON.Vector3(15, 3, -20), scene);
  light9.intensity = 50;

  //Adding an Arc Rotate Camera
  var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(1, 1, 4), scene);
  camera.rotation.y = 3.1415;
  //load office
  var office = BABYLON.SceneLoader.ImportMesh("", "./models/", "laboratory.glb", scene, function (newMeshes) {
    newMeshes[0].position.y-=10;
    newMeshes[0].position.z=-15;
  });
  office.renderingGroupId = 1;
  //add floor
  //const ground = BABYLON.MeshBuilder.CreateBox("ground", {width: 30, height: 1, depth: 30});
  //ground.position.y = -3;
  // add researchPanels
   const researchPanel = BABYLON.MeshBuilder.CreatePlane("researchPanel", {height:.3, width: .3});
   const researchPanelMask = BABYLON.MeshBuilder.CreatePlane("panelMask", {height:.3, width: .3});

   researchPanel.position.x = 2;
   researchPanel.position.z = 2;
   researchPanel.position.y = 1;
   var researchRot = 0;
   researchPanel.rotation.y += BABYLON.Tools.ToRadians(180);
   researchPanel.isPickable = false;
   researchPanel.renderingGroupId = 2;
   var maskMat = new BABYLON.StandardMaterial("maskMat", scene);
   researchPanelMask.material = maskMat;
   maskMat.alpha=0.5;
   var researchPanelMat = new BABYLON.ShaderMaterial("shader", scene, "./bunnyShader", {
     attributes: ["position", "normal", "uv", "colour1", "colour2"],
     uniforms: [
         "world", "worldView", "worldViewProjection", "view",
         "projection", "albedoMatrix", "cameraDirection", "camPos"
     ],
     defines: ["NORMAL"]
   });
   researchPanel.material = researchPanelMat;
//--------------------------------------------------------
// camera logic
  var angleX;
  var angleY;

  window.addEventListener('mousemove', function(event){
     mousemovef();
     angleX = 3.1415+(event.clientX/window.innerWidth-.5)*2;
     angleY = (event.clientY/window.innerHeight-.5)*2.;
   });

   // desiredFps that is greater than screen's refresh rate will have no effect
  // eg 120 fps still looks like 60fps on a 60hz monitor
  var desiredFps = 60;
  var interval = 1000/desiredFps;
  var lastTime = performance.now();
  var incrementX =0;
  var incrementY = 0;
  function gameLogic() {
      //console.log("angleX " + angleX + "cam.y" + camera.rotation.y);
      // game logic or physics, etc
      if (camera.rotation.y < angleX -.1 && camera.rotation.y < 3.5) {
          incrementX = 0.001
      }else if (camera.rotation.y > angleX +.1&& camera.rotation.y > 2.9) {
          incrementX = -0.001
      }
      else{
        incrementX=0;
      }
      if (camera.rotation.x < angleY -.1 && camera.rotation.x < .1) {
          incrementY = 0.001
      }else if (camera.rotation.x > angleY +.1&& camera.rotation.x > -.1) {
          incrementY = -0.001
      }
      else{
        incrementY=0;
      }
      camera.rotation.y += incrementX;
      camera.rotation.x += incrementY;
      researchRot = new BABYLON.Vector3(camera.rotation.x,camera.rotation.y,camera.rotation.z);
  }
  scene.onBeforeRenderObservable.add(() => {
  //  time+=.001;
  //  console.log(camera.getDirection(BABYLON.Vector3.Forward()));
    var forward = camera.getDirection(BABYLON.Vector3.Forward());
    var left = camera.getDirection(BABYLON.Vector3.Left());
    var up = camera.getDirection(BABYLON.Vector3.Up());
    var dist = 2;
    var leftOff = .3;
    var upOff = -0.7;
    //forward=2;
  //  researchPanel.position = camera.position.x;
    researchPanel.position.x = camera.position.x + dist*forward.x + leftOff*left.x + upOff*up.x;
    researchPanel.position.y = camera.position.y + dist*forward.y + leftOff*left.y + upOff*up.y;
    researchPanel.position.z = camera.position.z + dist*forward.z + leftOff*left.z + upOff*up.z;
    dist = 1.9;
    upOff = -0.66;
    leftOff = .29;
    researchPanelMask.position.x = camera.position.x + dist*forward.x + leftOff*left.x + upOff*up.x;
    researchPanelMask.position.y = camera.position.y + dist*forward.y + leftOff*left.y + upOff*up.y;
    researchPanelMask.position.z = camera.position.z + dist*forward.z + leftOff*left.z + upOff*up.z;


  researchPanelMask.rotation=camera.rotation;

    if(pickResult){

        if(pickResult.pickedMesh){
        //  console.log(pickResult.pickedMesh.name);
          var c = pickResult.getTextureCoordinates();
          if(c && pickResult.pickedMesh.name == "panelMask"){
            c.x -=.5;
            c.y -=.5;
            var rotBounds = .4;
            var yOff = 0;

            if (researchPanel.rotation.y - researchRot.y < 1 && c.x <0) {
            //    researchPanel.rotation.y += Math.abs(c.x)*.1;
            }
            if (researchPanel.rotation.y - researchRot.y > -1 && c.x >0) {
            //    researchPanel.rotation.y -= Math.abs(c.x)*.1;
            }
            if (researchPanel.rotation.x - researchRot.x < 1 && c.y > 0) {
            //    researchPanel.rotation.x += Math.abs(c.y)*.1;
            }
            if (researchPanel.rotation.x - researchRot.x > -1 && c.y < 0) {
            //    researchPanel.rotation.x -= Math.abs(c.y)*.1;
            }
          }
        }
      }
      else{
        researchPanel.rotation=camera.rotation;
      }

  });

  // see this discussion: https://gist.github.com/addyosmani/5434533
  // this will sync your game logic updates with the render updates
  function loop() {
      window.requestAnimationFrame(loop)

      let currentTime = performance.now();
      const deltaTime = currentTime - lastTime;

      if (deltaTime > interval) {
          lastTime = currentTime - (deltaTime % interval);
          gameLogic();
      }
  }
  loop();
//----------------------------------------------------------
var pickResult;
function mousemovef(){
  pickResult = scene.pick(scene.pointerX, scene.pointerY);

  if (pickResult.hit) {
    const conToB = BABYLON.Matrix.Identity();
    var mPos = pickResult.pickedPoint;

  }
}
  return scene;
}
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
