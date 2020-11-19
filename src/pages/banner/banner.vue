<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="willAdd">添加</el-button>
    <v-form :info="info" ref="detail"></v-form>
    <v-list @edit="edit($event)"></v-list>
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
        title: "轮播图添加"
      }
    };
  },
  computed: {
    ...mapGetters({
        getList:"banner/getList"
    })
  },
  methods: {
    ...mapActions({
      reqList: "banner/reqList",
    }),
    willAdd() {
      this.info.isshow = true;
    },
    edit(id) {
      this.info = {
        isshow: true,
        title: "修改轮播图"
      };
      // 让from去申请一条数据
      this.$refs.detail.getOne(id);
    }
  },
  mounted() {
  },
  components: {
    vForm,
    vList
  }
};
</script>

<style scoped>
</style>