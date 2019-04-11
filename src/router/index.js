/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  Object Strucutre:
  					path => router path
  					name => router name
  					component(lazy loading) => component to load
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Version: 1.1
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Vue from "vue";
import Router from "vue-router";
import authGuard from "./authGuard";

Vue.use(Router);

const router = new Router({
  base: process.env.BASE_URL,
  mode: "history",
  routes: [
    {
      // =============================================================================
      // MAIN LAYOUT ROUTES
      // =============================================================================
      path: "",
      component: () => import("../layouts/main/Main.vue"),
      children: [
        // =============================================================================
        // Theme Routes
        // =============================================================================
        {
          path: "/",
          name: "home",
          component: () => import("../views/home/Index.vue")
        },
        {
          path: "/page2",
          name: "page2",
          component: () => import("../views/Page2.vue")
        },
        {
          path: "/archer-management",
          name: "archer-management",
          component: () => import("../views/archer-management/Index.vue")
        },
        {
          path: "/device-management/:id",
          name: "device-management",
          component: () => import("../views/device-management/Index.vue")
        },
        {
          path: "/device-detail/:id",
          name: "device-detail",
          component: () => import("../views/device-detail/Index.vue")
        },
        {
          path: "/instance-management/:id",
          name: "instance-management",
          component: () => import("../views/instance-management/Index.vue")
        },
        {
          path: "/instance-detail/:database",
          name: "instance-detail",
          component: () => import("../views/instance-detail/Index.vue")
        },
        {
          path: "/configuration-information/:id",
          name: "configuration-information",
          component: () =>
            import("../views/configuration-information/Index.vue")
        },
        {
          path: "/error-logs/:id",
          name: "error-logs",
          component: () => import("../views/error-logs/Index.vue")
        },
        {
          path: "/statistics/:id",
          name: "/statistics",
          component: () => import("../views/statistics/Index.vue")
        },
        {
          path: "/support-ticket/:id",
          name: "support-ticket",
          component: () => import("../views/support-ticket/Index.vue")
        },
        {
          path: "/configuration-report/:id",
          name: "configuration-report",
          component: () => import("../views/configuration-report/Index.vue")
        },
        {
          path: "/team-management",
          name: "team-management",
          component: () => import("../views/team-management/Index.vue")
        },
        {
          path: "/add-team",
          name: "add-team",
          component: () => import("../views/team-management/AddTeam.vue")
        }
      ],
      beforeEnter: authGuard
    },
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
    {
      path: "",
      component: () => import("@/layouts/full-page/FullPage.vue"),
      children: [
        // =============================================================================
        // PAGES
        // =============================================================================
        {
          path: "/login",
          name: "login",
          component: () => import("@/views/auth/Login.vue")
        },
        {
          path: "/register",
          name: "register",
          component: () => import("@/views/auth/Register.vue")
        },
        {
          path: "/pages/error-404",
          name: "pageError404",
          component: () => import("@/views/pages/Error404.vue")
        }
      ]
    },
    // Redirect to 404 page, if no match found
    {
      path: "*",
      redirect: "/pages/error-404"
    }
  ]
});

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

export default router;
