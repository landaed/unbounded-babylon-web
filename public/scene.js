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

     // Setup the materials
     var airShader = new BABYLON.ShaderMaterial("shader", scene, "./shaders/air", {
        attributes: ["position", "normal", "uv", "colour1", "colour2"],
        uniforms: [
            "world", "worldView", "worldViewProjection", "view",
            "projection", "albedoMatrix", "iTime", "lightPos", "alpha"
        ],
        defines: ["NORMAL"]
    });
    airShader.alpha =0;
    airShader.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
    airShader.backFaceCulling = false;

    var groundShader = new BABYLON.ShaderMaterial("shader", scene, "./shaders/reactiveGround", {
       attributes: ["position", "normal", "uv", "colour1", "colour2"],
       uniforms: [
           "world", "worldView", "worldViewProjection", "view",
           "projection", "albedoMatrix", "iTime", "lightPos", "alpha"
       ],
       defines: ["NORMAL"]
   });
   groundShader.alpha =0;
   groundShader.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
   groundShader.backFaceCulling = false;

       // Create a 2D circle in the middle of the screen
       var layerAmount = 5;
       for(var i = 0; i < layerAmount; i++){
         const researchBtn = BABYLON.MeshBuilder.CreateDisc("1", { radius: .5-(i*.1), tessellation: 512}, scene);
         researchBtn.name = "1"// set a name for the mesh
         researchBtn.position.x = 0;
         researchBtn.position.y = 1;
         researchBtn.position.z = 0;
         researchBtn.material = waterShader;

         const aboutBtn = BABYLON.MeshBuilder.CreateDisc("2", { radius: .5-(i*.1), tessellation: 512}, scene);
         aboutBtn.name = "2"// set a name for the mesh
         aboutBtn.position.x = 0;
         aboutBtn.position.y = -.5-(i/(layerAmount*2));
         aboutBtn.position.z = 0;
         aboutBtn.material = fireShader;

         const contactBtn = BABYLON.MeshBuilder.CreateDisc("3", { radius: .5-(i*.1), tessellation: 512}, scene);
         contactBtn.name = "3"// set a name for the mesh
         contactBtn.position.x = 0;
         contactBtn.position.y = -1.7;
         contactBtn.position.z = 0;
         contactBtn.material = airShader;
       }
       fireShader.setFloat("centre", new BABYLON.Color3(0,-.5,0));

       var researcbTextMat = new BABYLON.DynamicTexture("text", {width:512, height:256}, scene);
       var ctx = researcbTextMat.getContext();
       ctx.font = "bold 36px Game Of Squids";
       ctx.fillStyle = "white";
       ctx.fillText("Research", 0, 100);
       researcbTextMat.update();
       // Set the texture as the diffuse texture for a mesh
       var researcbText = BABYLON.MeshBuilder.CreatePlane("researcbTextMesh", {width: 2, height: 1}, scene);


       researcbText.material = new BABYLON.StandardMaterial("mat", scene);
       researcbText.material.diffuseTexture = researcbTextMat;
       // Enable alpha blending
       researcbText.material.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
       //researchTexMesh.material.alpha = 0;

       // Set up a custom alpha test to only show the opaque pixels in the texture
       researcbText.material.diffuseTexture.hasAlpha = true;
       researcbText.material.diffuseTexture.getAlphaFromRGB = true;
       researcbText.material.diffuseTexture.getAlphaFromRGB = function (rgb) {
           return rgb.r;
       };

       researcbText.rotation.y=Math.PI;
       // Set the position and rotation of the mesh
       researcbText.position = new BABYLON.Vector3(-.8,1,.2);
       researcbText.isPickable = false;
       researcbText.material.emissiveColor = new BABYLON.Color3(1, 1, 1);

       //----------------------
       var aboutTextMat = new BABYLON.DynamicTexture("text", {width:512, height:256}, scene);
       ctx = aboutTextMat.getContext();
       ctx.font = "bold 36px Game Of Squids";
       ctx.fillStyle = "white";
       ctx.fillText("About Us", 0, 100);
       aboutTextMat.update();
       // Set the texture as the diffuse texture for a mesh
       var aboutText = BABYLON.MeshBuilder.CreatePlane("aboutText", {width: 2, height: 1}, scene);


       aboutText.material = new BABYLON.StandardMaterial("mat", scene);
       aboutText.material.diffuseTexture = aboutTextMat;
       // Enable alpha blending
       aboutText.material.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
       //researchTexMesh.material.alpha = 0;

       // Set up a custom alpha test to only show the opaque pixels in the texture
       aboutText.material.diffuseTexture.hasAlpha = true;
       aboutText.material.diffuseTexture.getAlphaFromRGB = true;
       aboutText.material.diffuseTexture.getAlphaFromRGB = function (rgb) {
           return rgb.r;
       };

       aboutText.rotation.y=Math.PI;
       // Set the position and rotation of the mesh
       aboutText.position = new BABYLON.Vector3(-.8,-.4,.2);
       aboutText.isPickable = false;
       aboutText.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
       //-------------------
       var contactTextMat = new BABYLON.DynamicTexture("text", {width:500, height:100}, scene);
       ctx = contactTextMat.getContext();
       ctx.font = "bold 64px Game Of Squids";
       ctx.fillStyle = "white";
       var text = "Contact Us";
       var textWidth = ctx.measureText(text).width;
       ctx.fillText(text, 256 - textWidth / 2, 60);
       contactTextMat.update();
       // Set the texture as the diffuse texture for a mesh
       var contactText = BABYLON.MeshBuilder.CreatePlane("aboutText", {width: 1, height: .2}, scene);


       contactText.material = new BABYLON.StandardMaterial("mat", scene);
       contactText.material.diffuseTexture = contactTextMat;
       // Enable alpha blending
       contactText.material.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
       //researchTexMesh.material.alpha = 0;

       // Set up a custom alpha test to only show the opaque pixels in the texture
       contactText.material.diffuseTexture.hasAlpha = true;
       contactText.material.diffuseTexture.getAlphaFromRGB = true;
       contactText.material.diffuseTexture.getAlphaFromRGB = function (rgb) {
           return rgb.r;
       };

       contactText.rotation.y=Math.PI;
       contactText.material.alpha=.5;
       // Set the position and rotation of the mesh
       contactText.position = new BABYLON.Vector3(0,-1.6,.2);
       contactText.isPickable = false;
       contactText.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
       //--------------
       //-------------------
       var logoTextMat = new BABYLON.DynamicTexture("text", {width:500, height:100}, scene);
       ctx = logoTextMat.getContext();
       ctx.font = "bold 64px Game Of Squids";
       ctx.fillStyle = "white";
       var text = "Un Bounded";
       var textWidth = ctx.measureText(text).width;
       ctx.fillText(text, 256 - textWidth / 2, 60);
       logoTextMat.update();
       // Set the texture as the diffuse texture for a mesh
       var logoText = BABYLON.MeshBuilder.CreatePlane("aboutText", {width: 1, height: .2}, scene);

       logoText.material = new BABYLON.StandardMaterial("mat", scene);
       logoText.material.diffuseTexture = logoTextMat;
       // Enable alpha blending
       logoText.material.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
       //researchTexMesh.material.alpha = 0;

       // Set up a custom alpha test to only show the opaque pixels in the texture
       logoText.material.diffuseTexture.hasAlpha = true;
       logoText.material.diffuseTexture.getAlphaFromRGB = true;
       logoText.material.diffuseTexture.getAlphaFromRGB = function (rgb) {
           return rgb.r;
       };

       logoText.rotation.y=Math.PI;
       logoText.material.alpha=1;
       // Set the position and rotation of the mesh
       logoText.position = new BABYLON.Vector3(0,1.5,.2);
       logoText.isPickable = false;
       logoText.material.emissiveColor = new BABYLON.Color3(1, 1, 1);



       // Create the camera
       var camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 5, new BABYLON.Vector3(0, 0, 0), scene);
       camera.attachControl(canvas, true);
       camera.alpha = 8;
       camera.beta = 1.5;

       //camera.rotation.y=Math.PI/2;
       //camera.rotation.z=Math.PI/2;
       // Create a basic light
       var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 1, 0), scene);
       light.diffuse = new BABYLON.Color3(.2,.2,1);
       light.specular = new BABYLON.Color3(0, .4, 1);
       light.intensity = 10;

       var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(.1, 1, 1.5), scene);
       light2.diffuse = new BABYLON.Color3(.2,.2,1);
       light2.specular = new BABYLON.Color3(0, .4, 1);
       light2.intensity = 50;
       const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.1});

       var glowMat = new BABYLON.StandardMaterial("glowMat", scene);
       glowMat.emissiveColor = BABYLON.Color3.Yellow();

       var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 600, height: 600, subdivisions: 256, updatable: true}, scene);
       ground.position.y=-10;
       ground.material = groundShader;
       sphere.material = glowMat;

       var startTime = Date.now();
       var currSel = -1;
       const mesh = BABYLON.MeshBuilder.CreateBox("mesh", {});
       mesh.parent = camera;
       mesh.position =new BABYLON.Vector3(-.5,0,5);
       mesh.scaling = new BABYLON.Vector3(.1,.1,.1);
       const material = new BABYLON.StandardMaterial("material", scene);
       material.alpha = 0.; // Set alpha value less than 1 for transparency
       mesh.material = material;

       logoText.parent=camera;
       logoText.position =new BABYLON.Vector3(1,2,5);
       logoText.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL);
       var stop = false;
       scene.registerBeforeRender(function() {

          if(camera && mesh){
            if (camera.isInFrustum(mesh)&&!stop) {
                //  mesh.position.addInPlace(new BABYLON.Vector3(-.001,0,0));
                mesh.position.x-= .05;
                logoText.position.x-=.05;

            }
            else{
              stop=true;
              console.log("stopping");
            }
          }

          var currentTime = (Date.now() - startTime) / 1000;
           if(sphere){
             sphere.position.z = Math.cos(currentTime*.5)*2;
             sphere.position.y = Math.cos(currentTime*.5)*3;
             sphere.position.x =Math.cos(currentTime*.5);
             light.position = sphere.position;
           }

           waterShader.setFloat("iTime", currentTime);
           waterShader.setFloat("iTime", currentTime);
           waterShader.setFloat("currSel",currSel);
           waterShader.setColor3("lightPos", new BABYLON.Color3(sphere.position.x,sphere.position.y,sphere.position.z));

           fireShader.setFloat("iTime", currentTime);
           fireShader.setFloat("iTime", currentTime);
           fireShader.setFloat("currSel",currSel);
           fireShader.setColor3("lightPos", new BABYLON.Color3(sphere.position.x,sphere.position.y,sphere.position.z));

           airShader.setFloat("iTime", currentTime);
           airShader.setFloat("iTime", currentTime);
           airShader.setFloat("currSel",currSel);
           airShader.setColor3("lightPos", new BABYLON.Color3(sphere.position.x,sphere.position.y,sphere.position.z));

           groundShader.setFloat("iTime", currentTime);
           groundShader.setFloat("iTime", currentTime);
           groundShader.setFloat("currSel",currSel);
           groundShader.setColor3("lightPos", new BABYLON.Color3(sphere.position.x,sphere.position.y,sphere.position.z));

       });
       canvas.addEventListener("pointermove", function (event) {
         if(camera.alpha + (event.movementX / 1000) > 7.3 && camera.alpha + (event.movementX / 1000) < 8.5){
           camera.alpha += event.movementX / 1000;
         }

      //   if(camera.beta + (event.movementY / 100) > 1.4 && camera.beta + (event.movementY / 100) < 2){
      //     camera.beta += event.movementY / 100;
      //   }


      //    console.log("alpha: " + camera.alpha + ", beta: " + camera.beta);
       });

       scene.onPointerMove = function castRay() {
         //logoText.lookAt(camera.position);
        // mesh.lookAt(camera.position);

         var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);
         var hit = scene.pickWithRay(ray);
         if (hit.pickedMesh) {
             currSel = parseFloat(hit.pickedMesh.name);
             console.log(hit.pickedMesh.name);
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
           mesh.position =new BABYLON.Vector3(-.5,0,5);
           logoText.position =new BABYLON.Vector3(1,2,5);
           stop=false;
           engine.resize();
           engine.resize();
        //   logo.position.x = engine.getAspectRatio(scene.activeCamera);
        //   console.log(logo.position);
       });
