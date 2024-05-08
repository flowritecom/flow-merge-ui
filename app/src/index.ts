import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { createVfm } from "vue-final-modal";

const app = createApp(App);
const modalPlugin = createVfm();
const pinia = createPinia();
app.use(router);
app.use(modalPlugin);
app.use(pinia);
app.mount("#app");
