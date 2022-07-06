

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
var panelCount = 10;
const panel = BABYLON.MeshBuilder.CreatePlane("panel", {height: 2, width: 2});
for (var i = 0; i < panelCount; i++) {
    var radians = 2 * 3.1415 / panelCount * i;
    var vertical = Math.sin(radians);
    var horizontal = Math.cos(radians);
    let panelClone = panel.clone("panelClone" + i);

    panelArray.push(panelClone);

    panelClone.position.y = 6;
    panelClone.position.x = camera.position.x+vertical*6;
    panelClone.position.z = camera.position.z+horizontal*6;
    panelClone.lookAt(camera.position);
    panelClone.rotation.y += BABYLON.Tools.ToRadians(180);
  }

// This targets the camera to scene origin
camera.inputs.attached.mouse.detachControl();
camera.inputs.attached.keyboard.detachControl();

var curr = 0;
camera.setTarget(panelArray[curr].position);
var canScroll = true;

window.addEventListener('mousemove', function(event){
         if(event.clientX/window.innerWidth > .5 && canScroll){
           time = 0;
           curr++;
           if (curr >= panelCount-1){
             curr = 0;
           }
           console.log("curr++: " +(180/3.14159)*curr*3.14159/panelCount);
           setTimeout(()=>camera.spinTo("rotation.y", -curr*2*3.14159/panelCount, 120), 10);
           canScroll = false;
         }
         if(event.clientX/window.innerWidth < .5 && !canScroll){
           canScroll = true;
         }
    })

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
