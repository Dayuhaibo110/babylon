import {
  Engine,
  Scene,
  // ArcRotateCamera,
  Vector3,
  // Color4,
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
} from "@babylonjs/core";
// import "@babylonjs/loaders/glTF";

// debuglayer工具
import TogglerDebugLayer from "./TogglerDebugLayer";
// import MyLoadingScreen from "./MyLoadingScreen";
// import UrlData from "./UrlData";

const createScene = (canvas) => {
  const engine = new Engine(canvas, true, null, true);
  const scene = new Scene(engine);

  // 在引擎里设置画面取代默认的加载画面
  // let loadingScreen = new MyLoadingScreen();
  // engine.loadingScreen = loadingScreen;
  TogglerDebugLayer(scene);

  return { engine, scene };
};

const setPosition = (name, position, scene) => {
  const mesh = scene.getMeshByName(name);
  if (mesh) {
    mesh.position = new Vector3(position.x, position.y, position.z);
  }
};

const getPosition = (name, scene) => {
  const mesh = scene.getMeshByName(name);
  if (mesh) {
    return mesh.position;
  }
};

const getRotation = (name, scene) => {
  const mesh = scene.getMeshByName(name);
  if (mesh) {
    return mesh.rotation;
  }
};

export { createScene, setPosition, getPosition, getRotation };
