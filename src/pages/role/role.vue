<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="willAdd">添加</el-button>
    <v-form :info="info" @init="init" ref="detail"></v-form>
    <v-list :list="list"  @edit="edit($event)"></v-list>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import vForm from "./components/form";
import vList from "./components/list";
import {
  reqRoleAdd,
  reqRoleList,
  reqRoleDetail,
  reqRoleupdate,
  reqRoleDel
} from "../../utils/http";
import { errorAlert } from '../../utils/alert';
export default {
  data() {
    return {
      info: {
        isshow: false,
        title: "角色添加"
      },
      list: []
    };
  },
  methods: {
    ...mapActions({}),
    willAdd() {
      this.info.isshow = true;
    },
    init() {
      reqRoleList().then(res => {
        if (res.data.code === 200) {
          this.list = res.data.list;
        }
      });
    },
    edit(id){
      this.info={
        isshow: true,
        title: "角色编辑"
      }
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