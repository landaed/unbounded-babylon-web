

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


BABYLON.UniversalCamera.prototype.spinTo = function (whichprop, targetval, speed) {
    const targetPropertyPath = whichprop.split(".");
    let value = this[targetPropertyPath[0]];
    for (var index = 1; index < targetPropertyPath.length; index++) {
        value = value[targetPropertyPath[index]];
    }

    var ease = new BABYLON.CubicEase();
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
	BABYLON.Animation.CreateAndStartAnimation('at4', this, whichprop, speed, 120, value, targetval, 0, ease);
}
var createScene = function () {
// This creates a basic Babylon Scene object (non-mesh)
var scene = new BABYLON.Scene(engine);

// This creates and positions a free camera (non-mesh)
var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);



// This attaches the camera to the canvas
camera.attachControl(canvas, true);
// The first parameter can be used to specify which mesh to import. Here we import all meshes
BABYLON.SceneLoader.ImportMesh("", "./models", "officeModel.glb", scene, function (newMeshes) {
    // Set the target of the camera to the first imported mesh
    console.log(newMeshes);
});


// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
var light = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(1, 10, -10), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.5;

// Our built-in 'sphere' shape.
const wallF = BABYLON.MeshBuilder.CreatePlane("wallF", {height:100, width: 500});

// Move the sphere upward 1/2 its height
wallF.position.y = 1;
wallF.position.z = 10;


// Our built-in 'sphere' shape.
const wallB = BABYLON.MeshBuilder.CreatePlane("wallB", {height:100, width: 500});

// Move the sphere upward 1/2 its height
wallB.rotation.y=3.1415;
wallB.position.y = 1;
wallB.position.z = -30;

// Our built-in 'sphere' shape.
const wallR = BABYLON.MeshBuilder.CreatePlane("wallR", {height:100, width: 100});

// Move the sphere upward 1/2 its height
wallR.rotation.y=1;
wallR.position.y = 1;
wallR.position.x = 10;

// Our built-in 'sphere' shape.
const wallL = BABYLON.MeshBuilder.CreatePlane("wallL", {height:100, width: 100});

// Move the sphere upward 1/2 its height
wallL.rotation.y=-1;
wallL.position.y = 1;
wallL.position.x = -10;
var panelArray = [];
var panelRot = 0;
var panelCount = 3;
const panel = BABYLON.MeshBuilder.CreatePlane("panel", {height: 2, width: 2});
var bunnyMat = new BABYLON.ShaderMaterial("shader", scene, "./bunnyShader", {
  attributes: ["position", "normal", "uv", "colour1", "colour2"],
  uniforms: [
      "world", "worldView", "worldViewProjection", "view",
      "projection", "albedoMatrix", "cameraDirection", "camPos"
  ],
  defines: ["NORMAL"]
});

var maskMat = new BABYLON.StandardMaterial("maskMat", scene);
var logoMat = new BABYLON.StandardMaterial("logoMat", scene);
var logovidTex = new BABYLON.VideoTexture("logovidTex","./videos/logoAnim.mp4", scene);
logoMat.diffuseTexture = logovidTex;
logoMat.roughness = 1;
logoMat.emissiveColor = new BABYLON.Color3.White();
var logoIndex = 1;
let bunnyTex = new BABYLON.Texture(Assets.textures.checkerboard_basecolor_png.rootUrl, scene);
bunnyMat.setTexture("textureSampler", bunnyTex);
bunnyMat.alpha = false;

for (var i = 0; i < panelCount; i++) {
    var radians = 2 * 3.1415 / panelCount * i;
    var vertical = Math.sin(radians);
    var horizontal = Math.cos(radians);
    let panelClone = panel.clone("panelClone" + i);
    let panelMask= panel.clone("panelMask" + i);

    panelArray.push(panelClone);

    panelClone.position.y = 6;
    panelClone.position.x = camera.position.x+vertical*6;
    panelClone.position.z = camera.position.z+horizontal*6;
    panelClone.lookAt(camera.position);
    panelClone.rotation.y += BABYLON.Tools.ToRadians(180);

    panelMask.position.y = 6;
    panelMask.position.x = camera.position.x+vertical*5;
    panelMask.position.z = camera.position.z+horizontal*5;
    panelMask.lookAt(camera.position);
    panelMask.rotation.y += BABYLON.Tools.ToRadians(180);
    panelMask.material = maskMat;
    maskMat.alpha = .0
}
panelArray[0].material = logoMat;
panelRot = new BABYLON.Vector3(panelArray[0].rotation.x,panelArray[0].rotation.y,panelArray[0].rotation.z);
//panelRot = panelArray[0].rotation;
// This targets the camera to scene origin
camera.inputs.attached.mouse.detachControl();
camera.inputs.attached.keyboard.detachControl();

var curr = 0;
camera.setTarget(panelArray[curr].position);
var canScroll = true;

window.addEventListener('mousemove', function(event){
         if(event.clientX/window.innerWidth > .8 && canScroll){
           time = 0;
           panelArray[curr].rotation = panelRot;
           curr--;
           if (curr < 0){
             curr = panelCount-1;
           }
           setTimeout(()=>camera.spinTo("rotation.y", curr*2*3.14159/panelCount, 120), 10);
           canScroll = false;
           panelRot = new BABYLON.Vector3(panelArray[curr].rotation.x,panelArray[curr].rotation.y,panelArray[curr].rotation.z);
         }
         else if(event.clientX/window.innerWidth < .2 && canScroll){
           time = 0;
           panelArray[curr].rotation = panelRot;
           curr++;
           if (curr >= panelCount){
             curr = 0;
           }
           panelRot = new BABYLON.Vector3(panelArray[curr].rotation.x,panelArray[curr].rotation.y,panelArray[curr].rotation.z);
           setTimeout(()=>camera.spinTo("rotation.y", curr*2*3.14159/panelCount, 120), 10);
           canScroll = false;
         }
         else if (event.clientX/window.innerWidth <= .8 && event.clientX/window.innerWidth >= .2 && !canScroll){
           canScroll = true;
         }

    })
  var time = 0;
  var updateFrame = false;
  scene.onBeforeRenderObservable.add(() => {
    time+=.001;
    bunnyMat.setFloat("iTime", time*50);
      if(pickResult){
        var c = pickResult.getTextureCoordinates();
        c.x -=.5;
        c.y -=.5;
        var rotBounds = .4;
        console.log(pickResult.pickedMesh.name);
        if(pickResult.pickedMesh.name == "panelMask" + curr){
          if(panelArray[curr].rotation.y - panelRot.y < rotBounds && c.x <0){
            panelArray[curr].rotation.y += Math.abs(c.x)*.1;
          }
          if(panelArray[curr].rotation.y - panelRot.y > -rotBounds && c.x >0){
            panelArray[curr].rotation.y -= Math.abs(c.x)*.1;
          }
          if(panelArray[curr].rotation.x - panelRot.x < rotBounds && c.y >0){
            panelArray[curr].rotation.x += Math.abs(c.y)*.1;
          }
          if(panelArray[curr].rotation.x - panelRot.x > -rotBounds && c.y <0){
            panelArray[curr].rotation.x -= Math.abs(c.y)*.1;
          }
        }
        else{
          console.log("panelRot "+panelRot);
          panelArray[curr].lookAt(camera.position);
          panelArray[curr].rotation.y += BABYLON.Tools.ToRadians(180);
        }
      }
    });
  var pickResult;
  function mousemovef(){
  pickResult = scene.pick(scene.pointerX, scene.pointerY);

  if (pickResult.hit) {
    const conToB = BABYLON.Matrix.Identity();
    var mPos = pickResult.pickedPoint;

	}
}
scene.onPointerMove = function () {
  mousemovef();
};

// Our built-in 'ground' shape.
var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 500, height: 600}, scene);

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
