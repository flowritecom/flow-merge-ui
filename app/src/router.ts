import { createRouter, createWebHashHistory } from 'vue-router'

import MyMerges from "./views/MyMerges.vue";
import CreateMerge from "./views/CreateMerge.vue";

const routes = [
  { path: '/', component: MyMerges },
  { path: '/new', component: CreateMerge },
]

export default createRouter({
  history: createWebHashHistory("/"),
  routes,
})
