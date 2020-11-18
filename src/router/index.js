import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
// 普通的vue文件使用store是可以直接this.$store,js文件想使用，则是直接引用
import store from "../store"

export let routes = [
  {
    path: "menu",
    component: () => import("../pages/menu/menu"),
    name: "菜单管理",
    // 路由独享守卫，没有权限就不能访问
    beforeEnter(TO, from, next) {
      checkedEnter("/menu", next);
    }
  },
  {
    path: "role",
    component: () => import("../pages/role/role"),
    name: "角色管理",
    beforeEnter(TO, from, next) {
      checkedEnter("/role", next);
    }
  },
  {
    path: "manage",
    component: () => import("../pages/manage/manage"),
    name: "管理员管理",
    beforeEnter(TO, from, next) {
      checkedEnter("/manage", next);
    }
  },
  {
    path: "home",
    component: () => import("../pages/home/home"),
    name: "首页"
  },
  {
    path: "member",
    component: () => import("../pages/member/member"),
    name: "会员列表"
  },
  {
    path: "cate",
    component: () => import("../pages/cate/cate"),
    name: "商品分类列表"
  },
  {
    path: "spec",
    component: () => import("../pages/spec/spec"),
    name: "规格列表"
  },
  {
    path: "goods",
    component: () => import("../pages/goods/goods"),
    name: "商品列表"
  }
]

let router = new Router({
  routes: [
    {
      path: "/login",
      component: () => import("../pages/login/login")
    },
    {
      path: "/",
      component: () => import("../pages/index/index"),
      children: [
        {
          path: "",
          component: () => import("../pages/home/home")
        },
        ...routes
      ]
    }
  ]
})

// 登录拦截
router.beforeEach((to, from, next) => {
  if (to.path == "/login") {
    next();
    return;
  }
  //前往的不是登录，查看是否登录，因为在store里面，如果有本地存储userInfo是返回的list值
  // 如果没有的话，userInfo是一个空的对象，所以userInfo始终都存在
  // 要想判断是否登录过，可以用checkedEnter里面随便一个属性，这里用token来举例说明
  if (store.state.userInfo.token) {
    next()
    return;
  }

  // 如果没有登录过，跳转到登录
  next("/login")
})

// 路由独享守卫的函数
function checkedEnter(path, next) {
  // 如果router里面的userInfo里面含有这个当前访问的路径，咋代表可以访问当前路径，否则不可以
  if (store.state.userInfo.menus_url.includes(path)) {
    // console.log(router.state.userInfo.menus_url.includes(path));
    
    next();
    return;
  }
  else {
    next("/login")
  }
}

export default router;