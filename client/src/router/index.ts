// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
// import About from "../views/About.vue";
// import Services from "../views/Services.vue";
// import Contact from "../views/Contact.vue";
import DemoPage from "../views/Demo.vue"; // Import the DemoPage component

const routes = [
  { path: "/", component: Home },
  // { path: "/about", component: About },
  // { path: "/services", component: Services },
  // { path: "/contact", component: Contact },
  { path: "/demo", component: DemoPage }, // Add route for DemoPage
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
