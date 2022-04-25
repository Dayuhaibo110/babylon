export default function MyLoadingScreen() {}

MyLoadingScreen.prototype.displayLoadingUI = function () {};

MyLoadingScreen.prototype.hideLoadingUI = function () {
  document.getElementById("loadingScreen_Container").style.opacity = "0";
  document.getElementById("loadingScreen_Container").style.display = "none";
};
