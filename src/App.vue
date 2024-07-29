<!-- src/App.vue -->
<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <div>
    <!-- Navigation Links (Optional) -->
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>

    <!-- Routed Content -->
    <router-view></router-view>
  </div>
</template>

<style scoped>
/* Add or adjust styles as needed */
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
nav {
  margin: 1em 0;
}
nav a {
  margin: 0 0.5em;
}
</style>
