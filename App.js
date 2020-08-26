window.addEventListener("DOMContentLoaded", function() {
  const materials = [];
  let plane;
  const canvas = document.querySelector("#canvas");
  const engine = new BABYLON.Engine(canvas, true);

  let createScene = () => {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.FromInts(39, 46, 50);

    let camera = new BABYLON.ArcRotateCamera("Camera", BABYLON.Tools.ToRadians(45), BABYLON.Tools.ToRadians(45), 5, new BABYLON.Vector3(0, 0, 0), scene);
    camera.lowerRadiusLimit = 1;
    camera.upperRadiusLimit = 10;
    camera.attachControl(canvas, true);
    camera.setPosition(new BABYLON.Vector3(0, 0, 5));
        
    let rot_state = {beta: camera.beta, alpha: camera.alpha};

    for (let i = 1; i <= 1; i++) {
      let mat = new BABYLON.StandardMaterial("mat", scene);
      mat.emissiveTexture = new BABYLON.Texture("./image-plan-3d/" + i.toString() + ".png", scene);
      mat.opacityTexture = new BABYLON.Texture("./image-plan-3d/" + i.toString() + ".png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
      materials.push(mat);
    }
    
    
    let sourcePlane = new BABYLON.Plane(0, 0, 1, 0);
    sourcePlane.normalize();

    plane = BABYLON.MeshBuilder.CreatePlane("plane", {height:2, width: 2, sourcePlane: sourcePlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
    plane.material = materials[0];

    scene.registerBeforeRender(function(){
      camera.alpha = rot_state.alpha;
      camera.beta = rot_state.beta;
    });

    return scene;
  };

  let scene = createScene();

  engine.runRenderLoop(function() {
    scene.render();
  });
  
  window.addEventListener('resize', function(){
    engine.resize();
  });
  let viewIndex = 0;
  let hideEvents = (cond) => {
    let events = document.getElementsByClassName("events");
    for (let i = 0; i < events.length; i++) {
      if (cond) {
        events.item(i).style.display = "none";
        continue ;
      }
      if (events.item(i).style.display === "none") {
        events.item(i).style.display = "block";
      } else {
        events.item(i).style.display = "none";
      }
    }
  }
  document.getElementById("events-container-id").addEventListener("click", function(e){
    if (e.target && e.target.nodeName == "LI" && e.target.id == "eventsManager") {
      hideEvents();
    }
    else if (e.target && e.target.nodeName == "LI" && e.target.id == "full-screen") {
      engine.switchFullscreen(true);
      //renderScenes(DEMO, null);
    }
    else if (e.target && e.target.nodeName == "LI" && e.target.id == "right") {
      plane.material = materials[viewIndex + 1 < 30 ? ++viewIndex : (viewIndex = 0)];
      //scene.getCameraByName("Camera").alpha += 0.1;
    }
    else if (e.target && e.target.nodeName == "LI" && e.target.id == "left") {
      plane.material = materials[viewIndex - 1 >= 0 ? --viewIndex : (viewIndex = 29)];
      //scene.getCameraByName("Camera").alpha -= 0.1;
    }
    else if (e.target && e.target.nodeName == "LI" && e.target.id == "plus") {
      scene.getCameraByName("Camera").radius -= 1;
    }
    else if (e.target && e.target.nodeName == "LI" && e.target.id == "minus") {
      scene.getCameraByName("Camera").radius += 1;
      //DEMO.activeScene.getCameraByName("Camera" + document.getElementsByClassName("active")[0].id).radius += 3;
      //console.log("rot y: " + DEMO.activeScene.getCameraByName("Camera" + document.getElementsByClassName("active")[0].id).rotation.y);
    }
    // else if (e.target && e.target.nodeName == "LI" && e.target.id == "hand-pointer") {
    //   DEMO.dragBehavior = !DEMO.dragBehavior;
    //   DEMO.pointerDragBehavior.enabled = DEMO.dragBehavior;
    // }
  });
  let loadAssets = async () => {
    for (let i = 2; i <= 30; i++) {
      let mat = new BABYLON.StandardMaterial("mat", scene);
      mat.emissiveTexture = new BABYLON.Texture("./image-plan-3d/"+ i.toString() +".png", scene);
      mat.opacityTexture = new BABYLON.Texture("./image-plan-3d/"+ i.toString() +".png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
      materials.push(mat);
    }
  }
  loadAssets();

});
