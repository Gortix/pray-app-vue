import { useAuth } from "./../store/auth";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
    children: [
      {
        path: "",
        name: "prayers",
        component: () => import("@/components/Content/PrayList.vue"),
      },
      {
        path: "/users",
        name: "users",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import("@/components/Content/UserList.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("@/views/LoginPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuth();
  if (
    // make sure the user is authenticated
    !auth.loggedIn &&
    // ❗️ Avoid an infinite redirect
    to.name !== "login"
  ) {
    // redirect the user to the login page
    return { name: "login", query: { redirect: to.name?.toString() } };
  }
});

export default router;
