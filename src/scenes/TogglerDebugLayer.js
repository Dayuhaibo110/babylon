//debug工具快捷键 shift+alt+d
import "@babylonjs/inspector";

function TogglerDebugLayer(scene) {
  function DebugLayer(scene) {
    // var scene = scenes[0];
    if (scene.debugLayer.isVisible()) {
      scene.debugLayer.hide();
    } else {
      scene.debugLayer.show({
        overlay: true, //覆盖模式打开
      });
    }
  }

  document.addEventListener("keydown", function (event) {

    if (event.altKey && event.shiftKey && event.keyCode === 68) {
      DebugLayer(scene);
    }
  });
}

export default TogglerDebugLayer;
