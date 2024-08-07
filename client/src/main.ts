import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import router from "./router"; // Import the router

createApp(App)
  .use(router) // Use the router
  .mount("#app");
