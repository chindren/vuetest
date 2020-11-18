<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="manager">
        <el-form-item label="所属角色" label-width="120px">
          <el-select v-model="manager.roleid" placeholder="请选择角色">
            <el-option label="请选择" :value="0" disabled></el-option>
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :value="item.id"
              :label="item.rolename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="manager.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px">
          <el-input v-model="manager.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="manager.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title ==='用户添加'" @click="willAdd">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
      {{manager}}
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// 引入routes,为了方便放在上级菜单的下拉选项中，routes在template中不能直接使用，要先定义一下
import { routes } from "../../../router/index";
import {
  reqRoleList,
  reqManageAdd,
  reqManageAll,
  reqManageList,
  reqManageDetail,
  reqManageupdate,
  reqManageDel,
  reqMenuList
} from "../../../utils/http";

import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      form: {},
      manager: {
        roleid: "",
        username: "",
        password: "",
        status: 1
      },
      roleList: [],
      defaultProps: {}
    };
  },
  methods: {
    ...mapActions({}),
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this.manager = {
        roleid: "",
        username: "",
        password: "",
        status: 1
      };
    },
    //36.获取一条数据
    getOne(uid) {
      reqManageDetail(uid).then(res => {
        //此时form上是没有id的
        this.manager = res.data.list;
        // 密码置空
        this.manager.password = ""
        //补id
        this.manager.uid = uid;
      });
    },
    //37 点了修改
    update() {
      reqManageupdate(this.manager).then(res => {
        if (res.data.code === 200) {
          //成功弹框
          successAlert("修改成功");
          //弹框消失
          this.cancel();
          //form重置
          this.empty();
          //列表刷新
          this.$emit("init");
        } else {
          errorAlert(res.data.msg);
        }
      });
    },
    closed() {
      // 如果是添加出现，点击了取消，此时，什么都不做
      // 如果是编辑出现，点击了取消，此时，form置空
      if (this.info.title === "编辑菜单") {
        this.empty();
      }
    },
    //27.上级菜单发生了修改
    changePid() {
      // 如果上级菜单是 顶级菜单，那么 form.type=1;否则是2
      if (this.form.pid === 0) {
        this.form.type = 1;
      } else {
        this.form.type = 2;
      }
    },
    // 添加成功了之后，一定要重新舒心list列表，不然不会显示新的信息
    willAdd() {
      reqManageAdd(this.manager).then(res => {
        if (res.data.code === 200) {
          //成功
          //弹个成功
          successAlert("添加成功");
          //弹框消失
          this.cancel();
          //form置空
          this.empty();
          //24.通知menu刷新列表数据
          this.$emit("init");
        } else {
          errorAlert(res.data.msg);
        }
      });
    }
  },
  computed: {
    ...mapGetters({})
  },
  mounted() {
    reqRoleList().then(res => {
      if (res.data.code === 200) {
        this.roleList = res.data.list;
        console.log(this.roleList);
      }
    });
  }
};
</script>

<style scoped>
</style>