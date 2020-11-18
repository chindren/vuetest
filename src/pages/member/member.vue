<template>
  <div>
    <!-- 添加按钮 -->
    <v-form :info="info" @init="init" ref="detail"></v-form>
    <v-list :list="list" @edit="edit($event)"></v-list>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import vForm from "./components/form";
import vList from "./components/list";
import {
  reqMemberList
} from "../../utils/http";
import { errorAlert } from "../../utils/http";
export default {
  data() {
    return {
      info: {
        isshow: false,
        title: "会员修改"
      },
      list: []
    };
  },
  methods: {
    ...mapActions({}),
    init() {
      reqMemberList().then(res=>{
        this.list = res.data.list;
        console.log(this.list);
        
      })
    },
    edit(uid) {
      this.info.isshow = true;
      // 让from去申请一条数据
      this.$refs.detail.getOne(uid);
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