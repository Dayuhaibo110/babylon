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
  // SceneLoader,
  // CubeTexture,
  Texture,
  Vector4,
  // Mesh,
  // Color3,
  // Animation,
  // TransformNode,
  // ActionManager,
  // ExecuteCodeAction,
  // InterpolateValueAction,
  // CubicEase,
  MeshBuilder,
  Mesh,
} from "@babylonjs/core";

export default {
  name: "BabylonScene",

  data() {
    return {
      scene: null,
      engine: null,
      interval: null,
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

      // this.createHouse(1);

      const detached_house = this.createHouse(1);
      detached_house.rotation.y = -Math.PI / 16;
      detached_house.position.x = -6.8;
      detached_house.position.z = 2.5;

      const semi_house = this.createHouse(2);
      semi_house.rotation.y = -Math.PI / 16;
      semi_house.position.x = -4.5;
      semi_house.position.z = 3;

      const places = []; //each entry is an array [house type, rotation, x, z]
      places.push([2, -Math.PI / 16, -1.5, 4]);
      places.push([2, -Math.PI / 3, 1.5, 6]);
      places.push([1, (15 * Math.PI) / 16, -4.1, -1]);
      places.push([1, (5 * Math.PI) / 4, 0, -1]);

      //Create instances from the first two that were built
      const houses = [];
      for (let i = 0; i < places.length; i++) {
        if (places[i][0] === 1) {
          houses[i] = detached_house.createInstance("house" + i);
        } else {
          houses[i] = semi_house.createInstance("house" + i);
        }
        houses[i].rotation.y = places[i][1];
        houses[i].position.x = places[i][2];
        houses[i].position.z = places[i][3];
      }
      this.createGround();

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
    createRoof() {
      // 房子

      const roof = new MeshBuilder.CreateCylinder("roof", {
        diameter: 2.2,
        height: 2.2,
        tessellation: 3,
      });
      roof.rotation.z = Math.PI / 2;
      // roof.rotation.y = Math.PI / 2;
      roof.position.y = 1.5;

      const roofMat = new StandardMaterial("roofMat");
      roofMat.diffuseTexture = new Texture(
        "https://assets.babylonjs.com/environments/roof.jpg",
        this.scene
      );

      roof.material = roofMat;
      return roof;
    },
    createBox(width) {
      const boxMat = new StandardMaterial("boxMat");
      // boxMat.diffuseTexture = new Texture("https://www.babylonjs-playground.com/textures/floor.png");
      boxMat.diffuseTexture = new Texture(
        "https://assets.babylonjs.com/environments/semihouse.png"
      );

      if (width == 2) {
      } else {
      }

      const boxFaceUV = [];

      if (width == 2) {
        boxMat.diffuseTexture = new Texture(
          "https://assets.babylonjs.com/environments/semihouse.png"
        );

        boxFaceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); // left face
        boxFaceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
        boxFaceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
        boxFaceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
      } else {
        boxMat.diffuseTexture = new Texture(
          "https://assets.babylonjs.com/environments/cubehouse.png"
        );

        boxFaceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
        boxFaceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
        boxFaceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
        boxFaceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
      }

      const box = new MeshBuilder.CreateBox(
        "box",
        { width: 2, faceUV: boxFaceUV, wrap: true },
        this.scene
      );

      box.position.y = 0.5;
      box.material = boxMat;

      return box;
    },
    createHouse(width) {
      const box = this.createBox(width);
      const roof = this.createRoof();

      const house = Mesh.MergeMeshes(
        [box, roof],
        true,
        false,
        null,
        false,
        true
      );
      return house;
    },
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
