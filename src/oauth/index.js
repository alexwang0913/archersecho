import Vue from "vue";
import GAuth from "vue-google-oauth2";

// Google auth credentials
// clientId: 624082431931-p02aoaospcb4k4btncnpfilvujlidki5.apps.googleusercontent.com
// secret: 2f_bvyj9zRy3n-tUgAKHGRm2

Vue.use(GAuth, {
  clientId:
    "624082431931-p02aoaospcb4k4btncnpfilvujlidki5.apps.googleusercontent.com",
  scope: "https://www.googleapis.com/auth/plus.login"
});
