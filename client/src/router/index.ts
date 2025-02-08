// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import CoverLetter from "../views/CoverLetter.vue";
import ContactPage from "../views/Contact.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/cover-letter", component: CoverLetter },
  { path: "/contact", component: ContactPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
