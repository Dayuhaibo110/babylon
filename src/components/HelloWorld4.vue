<template>
  <div class="sceneContainer">
    <!-- 3D场景 -->
    <canvas class="bjsCanvas" ref="bjsCanvas" />
  </div>
</template>

<script>
// import { createScene } from "../scenes/MyFirstScene";
import TogglerDebugLayer from "../scenes/TogglerDebugLayer";
import * as earcut from "earcut";
window.earcut = earcut;


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
  // CubeTexture,
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
} from "@babylonjs/core";

export default {
  name: "BabylonScene",

  data() {
    return {
      scene: null,
      engine: null,
      interval: null,

      carReady: false,
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

      camera.attachControl(canvas, true);

      const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

      // 音乐
      const bounce = new Sound("bounce", "monika.wav", scene);
      setTimeout(() => bounce.play(), 3000);

      new SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "village.glb");
      // this.createGround();
      this.createCar();

      const walk = function (turn, dist) {
          this.turn = turn;
          this.dist = dist;
      }
      

      this.createPeople();

      engine.runRenderLoop(() => {
        scene.render();
      });
      return { scene, engine };
    },
    createGround() {
      // 地面
      const ground = new MeshBuilder.CreateGround(
        "ground",
        { width: 30, height: 30 },
        this.scene
      );
      const groundMat = new StandardMaterial("groundMat");
      groundMat.diffuseTexture = new Texture("bg.png");
      ground.material = groundMat;
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

    createPeople () {

      const wireMat = new StandardMaterial("wireMat");
      wireMat.alpha = 0;
      const hitBox = new MeshBuilder.CreateBox("carbox", {width: 0.5, height: 0.6, depth: 4.5});
      hitBox.material = wireMat;
      hitBox.position.x = 3.1;
      hitBox.position.y = 0.3;
      hitBox.position.z = -5;

      const walk = function (turn, dist) {
          this.turn = turn;
          this.dist = dist;
      }
      
      const track = [];
      track.push(new walk(180, 2.5));
      track.push(new walk(0, 5));
      new SceneLoader.ImportMeshAsync("him", "https://playground.babylonjs.com/scenes/Dude/", "Dude.babylon").then((result) => {

        var dude = result.meshes[0];
        dude.scaling = new Vector3(0.008, 0.008, 0.008);
            
        dude.position = new Vector3(1.5, 0, -6.9);
        dude.rotate(Axis.Y, Tools.ToRadians(-95), Space.LOCAL);
        console.log(dude.rotationQuaternion);
        const startRotation = dude.rotationQuaternion.clone();    
            
        this.scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

        let distance = 0;
        let step = 0.015;
        let p = 0;

        this.scene.onBeforeRenderObservable.add(() => {
          if(this.carReady) {
            if(!dude.getChildren()[1].intersectsMesh(hitBox) && this.scene.getMeshByName("car").intersectsMesh(hitBox)) {
              return ;
            }
          }
          dude.movePOV(0, 0, step);
          distance += step;
          // 转弯
          if (distance > track[p].dist) {
            // debugger;
            console.log('转弯')
            dude.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL);
            p += 1;
            p %= track.length;
            console.log(232323)
            if (p === 0) {
                distance = 0;
                dude.position = new Vector3(1.5, 0, -6.9);
                dude.rotationQuaternion = startRotation.clone();
            }
          }
			
        })
      });
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
