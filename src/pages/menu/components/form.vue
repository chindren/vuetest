<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="form">
        <el-form-item label="菜单名称" label-width="120px">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" label-width="120px">
          <!-- form.pid是谁，地下value为该值的就会被选中 -->
          <el-select v-model="form.pid" placeholder="请选择" @change="changePid">
            <el-option label="请选择" :value="0"></el-option>
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option v-for="item in list" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型" label-width="120px">
          <el-radio v-model="form.type" :label="1" disabled>目录</el-radio>
          <el-radio v-model="form.type" :label="2" disabled>菜单</el-radio>
        </el-form-item>
        <el-form-item label="菜单图标" v-if="form.type===1" label-width="120px">
          <el-select v-model="form.icon" placeholder="请选择">
            <el-option v-for="item in icons" :key="item" :value="item">
              <i :class="item"></i>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单地址" v-else label-width="120px">
          <el-select v-model="form.url" placeholder="请选择">
            <el-option
              v-for="item in routes"
              :key="item.path"
              :label="item.name+'--/'+item.path"
              :value="'/'+item.path"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.title==='添加菜单'">添 加</el-button>
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
      {{form}}
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// 引入routes,为了方便放在上级菜单的下拉选项中，routes在template中不能直接使用，要先定义一下
import { routes } from "../../../router/index";
import { reqMenuAdd, reqMenuDetail, reqMenuUpdate } from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  props: ["info", "list"],
  data() {
    return {
      //icon集合
      icons: [
        "el-icon-s-tools",
        "el-icon-user-solid",
        "el-icon-s-help",
        "el-icon-s-operation"
      ],
      form: {
        pid: "",
        title: "",
        icon: "",
        type: "",
        url: "",
        status: 1
      },
      //   定义routes
      routes: routes
    };
  },
  methods: {
    ...mapActions({}),
    cancle() {
      this.info.isshow = false;
    },
    empty() {
      this.form = {
        pid: "",
        title: "",
        icon: "",
        type: "",
        url: "",
        status: 1
      };
    },
    //36.获取一条数据
    getOne(id) {
      reqMenuDetail(id).then(res => {
        //此时form上是没有id的
        this.form = res.data.list;
        //补id
        this.form.id = id;
      });
    },
    //37 点了修改
    update() {
      reqMenuUpdate(this.form).then(res => {
        if (res.data.code === 200) {
          //成功弹框
          successAlert("修改成功");
          //弹框消失
          this.cancle();
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
    add() {
      reqMenuAdd(this.form).then(res => {
        if (res.data.code === 200) {
          //成功
          //弹个成功
          successAlert("添加成功");
          //弹框消失
          this.cancle();
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
    // reqMenuList().then(res => {
    //   this.list = res.data.list;
    //   console.log(this.list);
    // });
  }
};
</script>

<style scoped>
</style>