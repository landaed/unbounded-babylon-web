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


    var scene = new BABYLON.Scene(engine);


    let logo;
    BABYLON.SceneLoader.ImportMesh("","https://cdn.jsdelivr.net/gh/landaed/unbounded-babylon-web@85860bcfb8bfe8173c4e9efbcf5fc2da880bdcaf/", "models/logo.glb", scene, function (newMeshes) {
      logo = newMeshes[0];
      logo.position.z=-5;
    });

    var maskMat = new BABYLON.StandardMaterial("maskMat", scene);
    maskMat.alpha=.0;

    const mask1 = BABYLON.MeshBuilder.CreatePlane("mask1", {height:1, width: 1});
    mask1.rotation.x=3.1415;
    mask1.position.z = .2;
    mask1.position.x = -1.5;
    mask1.position.y = -1.5;
    mask1.material = maskMat;

    const mask2 = BABYLON.MeshBuilder.CreatePlane("mask2", {height:1, width: 1});
    mask2.rotation.x=3.1415;
    mask2.position.z = .2;
    mask2.position.x = -2.5;
    mask2.position.y = -1.5;
    mask2.material = maskMat;

    const mask3 = BABYLON.MeshBuilder.CreatePlane("mask3", {height:1, width: 1});
    mask3.rotation.x=3.1415;
    mask3.position.z = .2;
    mask3.position.x = -3.5;
    mask3.position.y = -1.5;
    mask3.material = maskMat;

    var pw = .9;
    const plane1 = BABYLON.MeshBuilder.CreatePlane("plane1", {height:pw, width: pw});
    plane1.rotation.x=3.1415;
    plane1.position.x=-1.5;
    plane1.position.y = -1.5;
    var simchopTex = new BABYLON.Texture("https://cdn.jsdelivr.net/gh/landaed/unbounded-babylon-web@4a6f79b942976ec38a0bdda914c7e2b02e6eaeb4/images/SimChopIcon.png", scene);
    var simchopMat = new BABYLON.StandardMaterial("simchopMat", scene);
    simchopMat.diffuseTexture = simchopTex;
    plane1.material = simchopMat;

    BABYLON.SceneLoader.ImportMesh("","https://cdn.jsdelivr.net/gh/landaed/unbounded-babylon-web@1e6104da1c315b09b3e4204cb075692d17b5ae5e/", "models/simChopLogo.glb", scene, function (newMeshes) {
      newMeshes[0].setParent(plane1);
      newMeshes[0].position = new BABYLON.Vector3(pw/2.5,0,-.1);
      var scale = .2;
      newMeshes[0].scaling = new BABYLON.Vector3(scale,scale,scale);
      newMeshes[0].rotation = new BABYLON.Vector3(3.1415,3.1415,0);
    });
    var metaShadersMat = new BABYLON.StandardMaterial("metaShadersMat", scene);
    metaShadersMat.diffuseColor = new BABYLON.Color3(.3, .3, 1);
    const plane2 = BABYLON.MeshBuilder.CreatePlane("plane2", {height:pw, width: pw});
    plane2.rotation.x=3.1415;
    plane2.position.x=-2.5;
    plane2.position.y = -1.5;
    plane2.material = metaShadersMat;
    BABYLON.SceneLoader.ImportMesh("","https://cdn.jsdelivr.net/gh/landaed/unbounded-babylon-web@bd0f1f16f488490ef249de990b992951620c6559/", "models/metaShadersLogo.glb", scene, function (newMeshes) {
      newMeshes[0].setParent(plane2);
      newMeshes[0].position = new BABYLON.Vector3(.8,-.7,-.1);
      var scale = .14;
      newMeshes[0].scaling = new BABYLON.Vector3(scale,scale,scale);
      newMeshes[0].rotation = new BABYLON.Vector3(3.1415,3.1415,0);
    });

    const plane3 = BABYLON.MeshBuilder.CreatePlane("plane3", {height:pw, width: pw});
    plane3.rotation.x=3.1415;
    plane3.position.x=-3.5;
    plane3.position.y = -1.5;
    var wcTex = new BABYLON.Texture("https://cdn.jsdelivr.net/gh/landaed/unbounded-babylon-web@c54aaa50046a2a09e2ef734272de18faba161a3c/images/waveFunctionCollapseBG.png", scene);

    var wcMat = new BABYLON.StandardMaterial("wcMat", scene);
    wcMat.diffuseTexture = wcTex;
    plane3.material = wcMat;
    //c54aaa50046a2a09e2ef734272de18faba161a3c
    BABYLON.SceneLoader.ImportMesh("","https://cdn.jsdelivr.net/gh/landaed/unbounded-babylon-web@c54aaa50046a2a09e2ef734272de18faba161a3c/", "models/waveFunctionCollapse3dText.glb", scene, function (newMeshes) {
      newMeshes[0].setParent(plane3);
      newMeshes[0].position = new BABYLON.Vector3(0,0,-.1);
      var scale = .14;
      newMeshes[0].scaling = new BABYLON.Vector3(scale,scale,scale);
      newMeshes[0].rotation = new BABYLON.Vector3(3.1415,3.1415,0);
    });
    var col = .2;
    scene.clearColor = new BABYLON.Color4(col,col,col, 1);


    var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(-2.5,0,5), scene);
    camera.rotation.y = 3.1415;

    var gl = new BABYLON.GlowLayer("glow", scene, {
        mainTextureSamples: 4
    });
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {});
    var glowMat = new BABYLON.StandardMaterial("glowMat", scene);
    glowMat.emissiveColor = BABYLON.Color3.Teal();
    sphere.material = glowMat;

    let iTime = 0;
    var hemLight = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    hemLight.intensity =2;
    var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.diffuse = new BABYLON.Color3(.2,.2,1);
    light.specular = new BABYLON.Color3(0, .4, 1);
    light.intensity = 10;

    scene.onBeforeRenderObservable.add(() => {

      iTime+=.01;
      if (logo) {
      //  logo.position.y = camera.posi;
      }
      if(sphere){
        sphere.position.y = Math.sin(iTime);
        sphere.position.z = Math.cos(iTime)-5;
        sphere.position.x = Math.cos(iTime)*2 -2.;
        light.position = sphere.position;
      }
    });

    window.addEventListener('mousemove', function(event){
        let ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), null);
        let hit = scene.pickWithRay(ray);
        let pickedPoint = hit.pickedPoint;

        if(hit && hit.pickedMesh){
          plane1.rotation.x=3.1415;
          plane1.rotation.y=0;
          plane1.rotation.z=0;

          plane2.rotation.x=3.1415;
          plane2.rotation.y=0;
          plane2.rotation.z=0;

          plane3.rotation.x=3.1415;
          plane3.rotation.y=0;
          plane3.rotation.z=0;
          const matrix = hit.pickedMesh.computeWorldMatrix(true);
          const global_position = BABYLON.Vector3.TransformCoordinates(pickedPoint, matrix);
          var finalPos = new BABYLON.Vector3(global_position.x/1,global_position.y/1,global_position.z/1);
          if(hit.pickedMesh == mask1){
            finalPos.x+=3;
          //  finalPos.y+=hit.pickedMesh.position.y;
            plane1.rotation.x = 3.1415+finalPos.y;
            plane1.rotation.y =finalPos.x;
            console.log(finalPos);
          }
          if(hit.pickedMesh == mask2){
            finalPos.x+=5;
          //  finalPos.y+=hit.pickedMesh.position.y;
            plane2.rotation.x = 3.1415+finalPos.y;
            plane2.rotation.y =finalPos.x;
            console.log(finalPos);
          }
          if(hit.pickedMesh == mask3){
            finalPos.x+=7;
          //  finalPos.y+=hit.pickedMesh.position.y;
            plane3.rotation.x = 3.1415+finalPos.y;
            plane3.rotation.y =finalPos.x;
            console.log(finalPos);
          }

        }
        else{
          plane1.rotation.x=3.1415;
          plane1.rotation.y=0;
          plane1.rotation.z=0;

          plane2.rotation.x=3.1415;
          plane2.rotation.y=0;
          plane2.rotation.z=0;

          plane3.rotation.x=3.1415;
          plane3.rotation.y=0;
          plane3.rotation.z=0;
        }
     });


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
