<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="willAdd">添加</el-button>
    <v-form :info="info" @init="init" ref="detail"></v-form>
    <v-list :list="list" @edit="edit($event)"></v-list>
    <!-- 50.分页 
    total：总条数
    page-size:一页的数量
    current-change:当前页码发生了修改，会触发，回调函数的参数就是新的页码
    -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import vForm from "./components/form";
import vList from "./components/list";
import { errorAlert } from "../../utils/alert";
import {
  reqManageAdd,
  reqManageAll,
  reqManageList,
  reqManageDetail,
  reqManageupdate,
  reqManageDel,
  reqMenuList
} from "../../utils/http";
export default {
  data() {
    return {
      info: {
        isshow: false,
        title: "添加用户"
      },
      total: 0,
      size: 2,
      list: [],
      page: 1
    };
  },
  methods: {
    ...mapActions({}),
    willAdd() {
      this.info.isshow = true;
    },
    init() {
      reqManageAll().then(res => {
        if (res.data.code === 200) {
          res.data.list ? (this.total = res.data.list[0].total) : [];
          console.log(this.total);
        }
      });
      /*******************************为什么this.total不行******************************************* */
      // 获取第page页的，几条数据
      reqManageList({ page: this.page, size: this.size }).then(res => {
        if (res.data.code === 200) {
          this.list = res.data.list;
        }
      });
    },
    changePage(page) {
      // 当前页面改变时会触发次函数，把当前页面的page改了，然后重新查新列表
      this.page = page;
      this.init();
    },
    edit(id) {
      this.info = {
        isshow: true,
        title: "修改用户"
      };
      // 让from去申请一条数据
      this.$refs.detail.getOne(id);
    }
  },
  computed: {
    ...mapGetters({})
  },
  mounted() {
    this.init();
  },
  components: {
    vForm,
    vList
  }
};
</script>

<style scoped>
</style>