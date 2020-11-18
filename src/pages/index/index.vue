<template>
  <div class="warp">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- 侧边栏导航 
        background-color 背景色
        text-color 字体颜色
        active-text-color 激活的文字的颜色
        unique-opened 只有一个子菜单展开
        router 路由模式，会以index作为路由进行跳转
        -->
        <el-menu
          class="el-menu-vertical-demo"
          background-color="rgb(32, 34, 42)"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
        >
          <!-- 侧边栏 -->
          <el-menu-item index="/home">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>

          <!-- 动态侧边栏 -->
          <div v-for="item in userInfo.menus" :key="item.id">
            <!-- 目录 -->
            <el-submenu :index="item.id+''" v-if="item.children">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.title}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="i in item.children" :key="i.id" :index="i.url">{{i.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- 菜单 -->
            <el-menu-item v-else :index="item.url">{{item.title}}</el-menu-item>
          </div>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <template>
            <span>Header</span>
            <el-button type="primary" @click="exit">退出登录</el-button>
          </template>
        </el-header>
        <!-- main -->
        <el-main>
          <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{$route.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <!-- 二级路由出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { routes } from "../../router/index";
export default {
  data() {
    return {
      routes: routes
    };
  },
  methods: {
    ...mapActions({
      changeUser:"changeUser"
    }),
    exit(){
      //清掉vuex +本地存储
      this.changeUser({})
      // 跳转页面
      this.$router.push("/login")
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo"
    })
  },
  mounted() {
    console.log(this.$store);
  }
};
</script>

<style scoped>
.warp,
.el-container {
  width: 100vw;
  height: 100vh;
}
.el-aside {
  background-color: rgb(32, 34, 42);
}
.el-header {
  background-color: rgb(179, 192, 209);
}
</style>