<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="willAdd">添加</el-button>
    <v-form :info="info" ref="detail"></v-form>
    <v-list @edit="edit($event)"></v-list>
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
        title: "添加商品"
      }
    };
  },
  computed: {
    ...mapGetters({
      list: "goods/list",
      total: "goods/total",
      size: "goods/size"
    })
  },
  methods: {
    ...mapActions({
      reqList: "goods/reqList",
      reqCount: "goods/reqCount",
      changePage: "goods/changePage"
    }),
    willAdd() {
      this.info.isshow = true;
    },
    edit(id) {
      this.info = {
        isshow: true,
        title: "修改商品"
      };
      // 让from去申请一条数据
      this.$refs.detail.getOne(id);
    }
  },
  mounted() {
    this.reqList();
    this.reqCount();
  },
  components: {
    vForm,
    vList
  }
};
</script>

<style scoped>
</style>