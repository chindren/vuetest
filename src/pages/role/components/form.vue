<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user">
        <el-form-item label="菜单名称" label-width="120px">
          <el-input v-model="user.rolename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" label-width="120px">
          <!-- 树形控件
            data:数据
            :props="{children:'哪个字段是代表有下一个子节点',label:'展示在页面的字段'}"
            node-key:选中节点后，得到什么字段
            default-expanded-keys:默认展开的id值
            this.$refs.tree.getCheckedNodes() 可以取到选中的节点对应的整条数据，拼成的数组
            this.$refs.tree.getCheckedKeys() 可以取到选中节点的key拼成的数组,这里的key设置的是id(node-key)
            this.$refs.tree.setCheckedKeys([10,11,12]); 给树设置值
          -->
          <!-- 14.将data 绑定到tree,配置props，有了这句话之后this上的$refs属性会多一个tree -->
          <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            ref="tree"
            :props="{children: 'children',label: 'title'}"
          ></el-tree>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title==='角色添加'" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update(user)">修 改</el-button>
      </div>
      {{user}}
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// 引入routes,为了方便放在上级菜单的下拉选项中，routes在template中不能直接使用，要先定义一下
import { routes } from "../../../router/index";
import {
  reqRoleAdd,
  reqRoleList,
  reqRoleDetail,
  reqRoleupdate,
  reqRoleDel,
  reqMenuList
} from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      user: {
        rolename: "",
        menus: "",
        status: 1
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
      this.user = {
        rolename: "",
        menus: "",
        status: 1
      };
      //把树清空
      this.$refs.tree.setCheckedKeys([]);
    },
    add() {
      // 点击el-button按钮的时候
      // console.log(this.$refs.tree);
      this.user.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      reqRoleAdd(this.user).then(res => {
        if (res.data.code === 200) {
          // 成功弹窗
          successAlert("添加成功");
          // 弹框消失
          this.cancel();
          // 清空弹窗
          this.clear();
          // 刷新列表
          this.$emit("init");
        } else {
          errorAlert(res.data.msg);
        }
      });
    },
    getOne(id) {
      reqRoleDetail(id).then(res => {
        if (res.data.code === 200) {
          this.user = res.data.list;
          //处理树形控件的数据
          this.$refs.tree.setCheckedKeys(JSON.parse(this.user.menus));
          // 补id，后面要用
          this.user.id = id;
        } else {
          errorAlert(res.data.msg);
        }
      });
    },
    update(user) {
      this.user.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      reqRoleupdate(user).then(res => {
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
        this.info.title = "角色添加"
      }
    }
  },
  computed: {
    ...mapGetters({})
  },
  mounted() {
    reqMenuList().then(res => {
      if (res.data.code === 200) {
        this.data = res.data.list;
      }
    });
  }
};
</script>

<style scoped>
</style>