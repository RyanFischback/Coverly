// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";

// Import your components
import Home from "../views/Home.vue";
import About from "../views/About.vue";

// Define your routes
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
