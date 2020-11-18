<template>
  <div class="warp">
    <div class="login">
      <h3>登录</h3>
      <div class="inp"><el-input v-model="login.username" placeholder="请输入手机号"></el-input></div>
      <div class="inp"><el-input placeholder="请输入密码" v-model="login.password" show-password></el-input></div>
      <el-button type="primary" @click="logins">登录</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {reqLogin} from '../../utils/http'
import { successAlert, errorAlert } from "../../utils/alert";
export default {
  data() {
    return {
      login:{
        username:"",
        password:""
      }
    }
  },
  methods: {
    ...mapActions({
      "changeUser":"changeUser"
    }),
    logins(){
      console.log(this.login);
      
      reqLogin(this.login).then(res=>{
        if(res.data.code === 200){
          successAlert("登录成功")
          this.changeUser(res.data.list)
          this.$router.push("/")
        }
        else{
          errorAlert(res.data.msg)
        }
      })
    }
  },
  computed: {
    ...mapGetters({
      "usersInfo":"usersInfo"
    })
  },
  mounted() {
  }
};
</script>

<style scoped>
.warp {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to right, pink, skyblue, plum);
}
.login {
  position: absolute;
  padding: 0 30px;
  width: 300px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background-color: white;
}
.inp{
    margin-bottom: 35px;
}
</style>