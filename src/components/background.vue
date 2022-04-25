<template>
  <div class="sceneContainer">
    <!-- 3D场景 -->
    <canvas class="bjsCanvas" ref="bjsCanvas" />
  </div>
</template>

<script>
// import { createScene } from "../scenes/MyFirstScene";
import TogglerDebugLayer from "../scenes/TogglerDebugLayer";


import {
  Engine,
  Scene,
  ArcRotateCamera,
  // FreeCamera,
  Vector3,
  HemisphericLight,
  Sound,
  Color4,
  Color3,
  StandardMaterial,
  // HemisphericLight,
  SceneLoader,
  CubeTexture,
  Texture,
  Vector4,
  // Mesh,
  // Color3,
  Animation,
  Tools,
  Axis,
  // TransformNode,
  // ActionManager,
  // ExecuteCodeAction,
  // InterpolateValueAction,
  // CubicEase,
  MeshBuilder,
  Space,
  Mesh,
  Sprite,
  SpriteManager,
  ParticleSystem,
  PointerEventTypes,
  SpotLight,
} from "@babylonjs/core";
import GUI from '@babylonjs/gui'

export default {
  name: "BabylonScene",

  data() {
    return {
      scene: null,
      engine: null,
      interval: null,

      carReady: false,

      fountain: null,
      particleSystem: null
    };
  },

  methods: {
    initScene() {
      window.addEventListener("DOMContentLoaded", () => {
        const canvas = this.$refs.bjsCanvas;
        const engine = new Engine(canvas, true);

        let scene = this.createScene(canvas, engine);
        engine.runRenderLoop(() => {
          scene.render();
        });
      });
    },

    createScene(canvas) {
      const engine = new Engine(canvas);
      const scene = new Scene(engine);
      this.scene = scene;
      TogglerDebugLayer(scene);
      // const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 5, new Vector3(0, 0, 0), scene)
      const camera = new ArcRotateCamera(
        "camera",
        -1.631,
        1.203,
        19.23,
        new Vector3(0, 0, 0),
        scene
      );

      camera.upperBetaLimit = Math.PI / 2.2;
      camera.attachControl(canvas, true);

      const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
      light.intensity = 0.3;

      // 音乐
      const bounce = new Sound("bounce", "monika.wav", scene);
      setTimeout(() => bounce.play(), 3000);

      new SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "valleyvillage.glb");
      this.createCar();
      this.creatSky();
      this.createTree();
      this.createUfo();
      this.createFoutain();
      this.createParticleSystem();
      this.switchParticle();
      this.createLight();
      this.createGui()
      // this.createGround();

      engine.runRenderLoop(() => {
        scene.render();
      });
      return { scene, engine };
    },
    createGround() {

      //Create Village ground
      const smallgroundMat = new StandardMaterial("groundMat");
      smallgroundMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/villagegreen.png");
      smallgroundMat.diffuseTexture.hasAlpha = true;

      const smallground = new MeshBuilder.CreateGround("ground", {width:24, height:24});
      smallground.material = smallgroundMat;
      // 地面
      const ground = new MeshBuilder.CreateGroundFromHeightMap(
        "ground",
        "https://assets.babylonjs.com/environments/villageheightmap.png",
        {width:150, height:150, subdivisions: 20, minHeight:0, maxHeight: 10},
        this.scene
      );;
      const groundMat = new StandardMaterial("groundMat");
      groundMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/valleygrass.png");
      ground.material = groundMat;

      ground.position.y = -0.01;
    },

    createCar() {

      SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "car.babylon").then(() =>  {
      //car animatiion
      const car = this.scene.getMeshByName("car");
      car.rotation = new Vector3(-Math.PI / 2, Math.PI , -Math.PI / 2);

      car.position.y = 0.2;
      car.position.x = 2.8;
      car.position.z = 8;
      
      const animCar = new Animation("carAnimation", "position.z", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

      this.carReady = true;
      const carKeys = []; 

        carKeys.push({
            frame: 0,
            value: 8
        });

        carKeys.push({
            frame: 150,
            value: -7
        });

        carKeys.push({
            frame: 200,
            value: -7
        });

        animCar.setKeys(carKeys);

        car.animations = [];
        car.animations.push(animCar);

        this.scene.beginAnimation(car, 0, 200, true);
      
      //wheel animation
      const wheelRB = this.scene.getMeshByName("wheelRB");
      const wheelRF = this.scene.getMeshByName("wheelRF");
      const wheelLB = this.scene.getMeshByName("wheelLB");
      const wheelLF = this.scene.getMeshByName("wheelLF");
      
      this.scene.beginAnimation(wheelRB, 0, 30, true);
      this.scene.beginAnimation(wheelRF, 0, 30, true);
      this.scene.beginAnimation(wheelLB, 0, 30, true);
      this.scene.beginAnimation(wheelLF, 0, 30, true);
    });
    },

    creatSky () {
      //Skybox
      const skybox = new MeshBuilder.CreateBox("skyBox", {size:150}, this.scene);
      const skyboxMaterial = new StandardMaterial("skyBox", this.scene);
      skyboxMaterial.backFaceCulling = false;
      skyboxMaterial.reflectionTexture = new CubeTexture("https://playground.babylonjs.com/textures/skybox", this.scene);
      skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
      skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
      skyboxMaterial.specularColor = new Color3(0, 0, 0);
      skybox.material = skyboxMaterial;
    },

    createTree () {
      const spriteManagerTrees = new SpriteManager("treesManager", "/palm.png", 2000, {width: 512, height: 1024}, this.scene)
      //We create trees at random positions
      for (let i = 0; i < 500; i++) {
          const tree = new Sprite("tree", spriteManagerTrees);
          tree.position.x = Math.random() * (-30);
          tree.position.z = Math.random() * 20 + 8;
          tree.position.y = 0.5;
      }

      for (let i = 0; i < 500; i++) {
          const tree = new Sprite("tree", spriteManagerTrees);
          tree.position.x = Math.random() * (25) + 7;
          tree.position.z = Math.random() * -35  + 8;
          tree.position.y = 0.5;
      }
    },
    createUfo () {
      const spriteManagerUfo  = new SpriteManager("ufoMananger", "https://assets.babylonjs.com/environments/ufo.png", 1 , {width: 128, height: 76})

      const ufo = new Sprite("ufo", spriteManagerUfo);
      ufo.playAnimation(0, 16, true, 125);
      ufo.position.y = 5;
      ufo.position.z = 0;

      ufo.width = 2;
      ufo.height = 1;
    },
    createFoutain () {
      const fountainOutline = [
        new Vector3(0, 0, 0),
        new Vector3(0.5, 0, 0),
        new Vector3(0.5, 0.2, 0),
        new Vector3(0.4, 0.2, 0),
        new Vector3(0.4, 0.05, 0),
        new Vector3(0.05, 0.1, 0),
        new Vector3(0.05, 0.8, 0),
        new Vector3(0.15, 0.9, 0)
      ];
      
      //Create lathed fountain
      const fountain = new MeshBuilder.CreateLathe("fountain", {shape: fountainOutline, sideOrientation: Mesh.DOUBLESIDE});
      fountain.position.x = -4;
      fountain.position.z = -6;
      fountain.position.y = 0.01;
      
      this.fountain = fountain;
    },

    createParticleSystem () {
      const particleSystem = new ParticleSystem("particles", 5000, this.scene);
      //Texture of each particle
      particleSystem.particleTexture = new Texture("https://playground.babylonjs.com/textures/flare.png");

      // Where the particles come from
      particleSystem.emitter = new Vector3(-4, 0.8, -6); // emitted from the top of the fountain
      particleSystem.minEmitBox = new Vector3(-0.01, 0, -0.01); // Starting all from
      particleSystem.maxEmitBox = new Vector3(0.01, 0, 0.01); // To...

      // Colors of all particles
      particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
      particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);

      // Size of each particle (random between...
      particleSystem.minSize = 0.01;
      particleSystem.maxSize = 0.05;

      // Life time of each particle (random between...
      particleSystem.minLifeTime = 0.3;
      particleSystem.maxLifeTime = 1.5;

      // Emission rate
      particleSystem.emitRate = 1500;

      // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
      particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

      // Set the gravity of all particles
      particleSystem.gravity = new Vector3(0, -9.81, 0);

      // Direction of each particle after it has been emitted
      particleSystem.direction1 = new Vector3(-1, 8, 1);
      particleSystem.direction2 = new Vector3(1, 8, -1);

      // Power and speed
      particleSystem.minEmitPower = 0.2;
      particleSystem.maxEmitPower = 0.6;
      particleSystem.updateSpeed = 0.01;

      // Start the particle system
      // particleSystem.start();

      this.particleSystem = particleSystem;
    },

    switchParticle () {
      //Switch fountain on and off
      let switched = false;
      const pointerDown = (mesh) => {
        // console.log(mesh);
        if (mesh.name === "fountain") {
          switched = !switched;
          console.log(switched);
          if(switched) {
              // Start the particle system
              this.particleSystem.start();
          }
          else {
              // Stop the particle system
              this.particleSystem.stop();
          }
        }
      }

      this.scene.onPointerObservable.add((pointerInfo) => {      		
          switch (pointerInfo.type) {
            case PointerEventTypes.POINTERDOWN:
            if(pointerInfo.pickInfo.hit) {
                pointerDown(pointerInfo.pickInfo.pickedMesh)
            }
            break;
          }
      });
    },

    createLight () {
      SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "lamp.babylon").then(() =>{
        const lampLight = new SpotLight("lampLight", Vector3.Zero(), new Vector3(0, -1, 0), 0.8 * Math.PI, 0.5, this.scene);
        lampLight.diffuse = Color3.Yellow();
        lampLight.parent = this.scene.getMeshByName("bulb")

        const lamp = this.scene.getMeshByName("lamp");
        lamp.position = new Vector3(2, 0, 2); 
        lamp.rotation = Vector3.Zero();
        lamp.rotation.y = -Math.PI / 4;

        const lamp3 = lamp.clone("lamp3");
        lamp3.position.z = -8;

        const lamp1 = lamp.clone("lamp1");
        lamp1.position.x = -8;
        lamp1.position.z = 1.2;
        lamp1.rotation.y = Math.PI / 2;

        const lamp2 = lamp1.clone("lamp2");
        lamp2.position.x = -2.7;
        lamp2.position.z = 0.8;
        lamp2.rotation.y = -Math.PI / 2;

      })
    },

    createGui () {
      const adt = new GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

      const panel = new GUI.StackPanel();
      panel.width = "220px";
      panel.top = "-25px";
      panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
      panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
      adt.addControl(panel);

      const header = new GUI.TextBlock();
      header.text = "Night to Day";
      header.height = "30px";
      header.color = "white";
      panel.addControl(header); 

      const slider = new GUI.Slider();
      slider.minimum = 0;
      slider.maximum = 1;
      slider.borderColor = "black";
      slider.color = "gray";
      slider.background = "white";
      slider.value = 1;
      slider.height = "20px";
      slider.width = "200px";
      slider.onValueChangedObservable.add((value) => {
          if (light) {
              light.intensity = value;
          }
      });
      panel.addControl(slider);
    }
  },

  mounted() {
    const bjsCanvas = this.$refs.bjsCanvas;
    if (bjsCanvas) {
      const { engine, scene } = this.createScene(bjsCanvas);
      this.engine = engine;
      this.scene = scene;
    }
  },
};
</script>

<style>
.bjsCanvas {
  width: 100%;
  height: 100%;
  /* background-image: linear-gradient(to top, #d9d9d9 0%, #ffffff 100%); */
  background-color: #000;
  outline: none;
}
.sceneContainer {
  width: 100%;
  height: 100%;
}
#loadingScreen_Container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  /* background-color: #f8f8f8; */
  visibility: visible;
  opacity: 100;
  transition: all 0.5s ease-out;
}

.loadingLogo {
  position: absolute;
  left: 50%;
  top: 45%;
  width: 300px;
  -webkit-transform: translate(-50%, -50%);
}

.loadingLogo img {
  width: 200px;
}

@keyframes progress {
  0% {
    width: 0;
  }
  25% {
    width: 25%;
  }
  50% {
    width: 50%;
  }
  100% {
    width: 100%;
  }
}

.progressBar {
  animation-duration: 2s;
  animation-name: progress;
  margin: 20px auto 0 0;
  height: 2px;
  width: 100%;
  background-color: #1bafd4;
  text-align: center;
}

.progressBar-container {
  /*position: absolute;*/
  margin: 20px auto 0 auto;
  height: 2px;
  width: 100%;
  background-color: #1d292c;
  text-align: center;
}
</style>
