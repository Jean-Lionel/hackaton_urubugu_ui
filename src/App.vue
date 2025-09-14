
<template>
  <Jeux v-if="!!$store.state.user"/>
  <Login v-else />
</template>
<script>
import Jeux from './views/Jeux.vue';
import Login from './views/Login.vue';
export default {
  name: 'App',
  components: {
    Jeux,
    Login
  }
}
</script>
<style src="./main.css"></style>
