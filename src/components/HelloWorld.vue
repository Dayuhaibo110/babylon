<template>
  <div class="sceneContainer">
    <!-- 3D场景 -->
    <canvas class="bjsCanvas" ref="bjsCanvas" />
  </div>
</template>

<script>
// import { createScene } from "../scenes/MyFirstScene";
import TogglerDebugLayer from "../scenes/TogglerDebugLayer";

import {Engine, Scene, 
  ArcRotateCamera,
  // FreeCamera,
  Vector3,
  HemisphericLight,
  Color4,
  Color3,
  StandardMaterial,
  // HemisphericLight,
  // SceneLoader,
  // CubeTexture,
  // Texture,
  // Mesh,
  // Color3,
  // Animation,
  // TransformNode,
  // ActionManager,
  // ExecuteCodeAction,
  // InterpolateValueAction,
  // CubicEase,
  MeshBuilder
  } from '@babylonjs/core';
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
    initScene () {
      window.addEventListener('DOMContentLoaded', () => {
        const canvas = this.$refs.bjsCanvas
        const engine = new Engine(canvas, true );

        let scene = this.createScene(canvas, engine)
        engine.runRenderLoop(() => {
          scene.render()
        })
      })
    },

    createScene(canvas) {
      const engine = new Engine(canvas, true);

      let scene = new Scene(engine)
      scene.clearColor = new Color4(0, 0, 0, 0);

      
      TogglerDebugLayer(scene)
      let camera = new ArcRotateCamera('camera1',
      1.594,
      1.098,
      10,
      new Vector3(0.01, 0, 0), scene);

    // const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

    // camera.setTarget(new Vector3.Zero());

    // camera.attachControl(canvas, true);


      // new Vector3(0, 5, -10),
      
      
      camera.attachControl(canvas, true);
      
      let light = new HemisphericLight('light1', new Vector3(0,1,0), scene);
      light.intensity = 0.5

      // const sphere =  new MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene)
      // sphere.position.y = 1;

       // 添加一个球体到场景中
      var sphere = new MeshBuilder.CreateSphere(
        "sphere",
        { diameter: 2 },
        scene
      );
      sphere.position.y = 1;

      var myMaterial = new StandardMaterial("myMaterial", scene);//创建一个材质

      myMaterial.diffuseColor = new Color3(1, 0, 1);//漫反射颜色
      myMaterial.specularColor = new Color3(0.5, 0.6, 0.87);//镜面颜色
      myMaterial.emissiveColor = new Color3(1, 1, 1);//自发光颜色
      myMaterial.ambientColor = new Color3(0.23, 0.98, 0.53);//环境光颜色

      sphere.material = myMaterial;
      new MeshBuilder.CreateGround("myGround", {width: 6, height: 4, subdivisions: 8}, scene);
      engine.runRenderLoop(() => {
        scene.render();
      });
      return { scene, engine }
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
