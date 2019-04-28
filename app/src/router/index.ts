
import { AsyncComponent } from "vue";
import VueRouter from "vue-router";

const Home: AsyncComponent = function ( ): Promise<any> {
  return import("./home");
}

export const router: VueRouter = new VueRouter({
  mode: "history",
  scrollBehavior ( ): { x: number, y: number } {
    return { x: 0, y: 0 }
  },
  routes: [ {
    path: "/",
    component: Home,
    meta: {
      title: "Home"
    }
  } ]
})
