<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>
    <!-- 子组件通知父组件，触发edit方法，开始编辑，把需要编辑的id传值给edit，父组件接受的时候，用$event接受，或者不用写，也是用$event接收 -->
    <v-list :list="list" @init="init" @edit="edit($event)"></v-list>
    <!-- 自定义事件init，当form添加完成后信息，通知menu重新发送请求list，更新列表 -->
    <v-form :info="info" :list="list" @init="init" ref="form"></v-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// 引入list
import vList from "./components/list";
import vForm from "./components/form";
import { reqMenuList } from "../../utils/http";
export default {
  data() {
    return {
      list: [],
      info: {
        title: "添加活动",
        isshow: false
      }
    };
  },
  methods: {
    ...mapActions({}),
    willAdd() {
      this.info.isshow = true;
    },
    init() {
      reqMenuList().then(res => {
        this.list = res.data.list;
        console.log(this.list);
      });
    },
    //处理编辑
    edit(id) {
      //弹框出现
      this.info.isshow = true;
      // 34.给info补了一个字段，用来判断是添加还是编辑打开的弹框
      this.info.title = "编辑活动";
      //37.父组件调用子组件 form.vue 的getOne()
      this.$refs.form.getOne(id);
    }
  },
  computed: {
    ...mapGetters({})
  },
  components: {
    vList,
    vForm
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped>
</style>