import store from "../store/store";

const authGuard = (to, from, next) => {
  if (store.state.auth.isAuthenticated) {
    next();
  } else {
    next("/login");
  }
};

export default authGuard;
