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
    var htmlBG = document.createElement("PRE");
    htmlBG.style.zIndex = -1;
    htmlBG.style.position = "absolute"
    htmlBG.style.width = "100VW";
    htmlBG.style.height = "100VH";
    htmlBG.style.left = 0;
    htmlBG.style.top = 0;
    htmlBG.style.whiteSpace = "pre";
    htmlBG.style.backgroundImage = "linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet)";
    htmlBG.innerText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Bibendum ut tristique et egestas quis ipsum suspendisse ultrices. Ac turpis egestas integer eget aliquet nibh. Egestas dui id ornare arcu odio ut sem nulla pharetra. Ipsum dolor sit amet consectetur adipiscing elit duis. Enim lobortis scelerisque fermentum dui. Nulla facilisi cras fermentum odio eu feugiat pretium nibh. Lectus nulla at volutpat diam ut venenatis. Cursus sit amet dictum sit amet justo donec enim. Sed risus ultricies tristique nulla aliquet. Blandit cursus risus at ultrices mi. Enim praesent elementum facilisis leo vel fringilla est ullamcorper eget. Lobortis elementum nibh tellus molestie nunc non. Magnis dis parturient montes nascetur ridiculus. Semper auctor neque vitae tempus quam.`;
    document.getElementById("canvasZone").appendChild(htmlBG);



    var scene = new BABYLON.Scene(engine);


    // Make background clear.
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);


    var camera = new BABYLON.ArcRotateCamera("camera1", 2.9, 1.0, 12.0, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
        sphere.position.y = 1;
        sphere.position.x = 0;
    var m = new BABYLON.StandardMaterial('smat', scene);
    sphere.material = m;

    // TRY TO USE THIS SHAPE TO CUT A HOLE TO THE UNDERLYING HTML
    m.alpha = 0.0;
    m.alphaMode = BABYLON.Engine.ALPHA_DISABLE;


  // Demonstrate the hole is working correctly with Z order of other objects.
  var s2 = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
  s2.position.y = 1;
  s2.position.x = -2;
  s2.renderOverlay = true;
  s2.overlayColor.copyFromFloats(1,0,0)

    var s3 = s2.createInstance();
        s3.position.x = 2;



    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

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
