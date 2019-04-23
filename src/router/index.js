import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

function route(path, file, name, children) {
  return {
    exact: true,
    path,
    name,
    children,
    component: () => import('../pages' + file)
  }
}

export default new Router({
  routes: [
    route("/login", '/Login', "Login"),
    route("/register", '/Register', "Register"),
    route("/loginStudent", '/LoginStudent', "LoginStudent"),
    {
      path: "/",
      component: () => import('../pages/Layout'),
      redirect: "/index/dashboard",
      children: [
        route("/index/dashboard", "/Dashboard", "Dashboard"),
        route("/asset/apartment", '/asset/Apartment', "Apartment"),
        route("/asset/room", '/asset/Room', "Room"),

        route("/check/sanitation", '/check/Sanitation', "Sanitation"),
        route("/check/sleep", '/check/Sleep', "Sleep"),

        route("/others/notice", '/others/Announcement', "Announcement"),
        route("/others/water", '/others/Waterstock', "Waterstock")
      ]
    }
  ]
})
