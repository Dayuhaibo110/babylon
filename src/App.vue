<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <!-- <HelloWorld4 msg="Welcome to Your Vue.js App"/> -->
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <highBackGround></highBackGround>

</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import HelloWorld2 from './components/HelloWorld2.vue'
import HelloWorld3 from './components/HelloWorld3.vue'
import HelloWorld4 from './components/HelloWorld4.vue'
import highBackGround from './components/background.vue'





export default {
  name: 'App',
  components: {
    // HelloWorld,
    // HelloWorld2,
    // HelloWorld3,
    // HelloWorld4,
    highBackGround
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
*{
  margin: 0;
  padding: 0;
}
</style>
