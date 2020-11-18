<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="member">
        <el-form-item label="手机号" label-width="120px">
          <el-input v-model="member.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" label-width="120px">
          <el-input v-model="member.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px">
          <template>
            <el-input v-model="member.password" autocomplete="off"></el-input>
            <p>留空则不修改</p>
          </template>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="member.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update(member)">修 改</el-button>
      </div>
      {{member}}
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// 引入routes,为了方便放在上级菜单的下拉选项中，routes在template中不能直接使用，要先定义一下
import { routes } from "../../../router/index";
import {
  reqMemberDetail,
  reqMemberupdate
} from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      member: {
        uid:"",
        nickname:"",
        phone:"",
        password:"",
        status:1
      },
      //   定义routes
      routes: routes,
      data: [],
      defaultProps: {}
    };
  },
  methods: {
    ...mapActions({}),
    cancel() {
      this.info.isshow = false;
    },
    clear() {
      this.member = {
         uid:"",
        nickname:"",
        phone:"",
        password:"",
        status:1
      };
    },
    getOne(uid) {
      reqMemberDetail(uid).then(res => {
        if (res.data.code === 200) {
          this.member = res.data.list;
          // 密码先变成空
          this.member.password = ""
          // 补id，后面要用
          this.member.uid = uid;
        } else {
          errorAlert(res.data.msg);
        }
      });
    },
    update(member) {
      reqMemberupdate(member).then(res => {
        // 弹出提示框
        successAlert("修改成功");
        // 弹框消失
        this.cancel();
        // 弹框置空
        this.clear();
        // 刷新列表
        this.$emit("init");
      });
    },
    closed() {
      if (this.info.title === "角色编辑") {
        this.clear();
        this.info.title = "角色添加";
      }
    }
  },
  computed: {
    ...mapGetters({})
  },
  mounted() {
  }
};
</script>

<style scoped>
.dialog-footer{
  text-align: center;
}
</style>