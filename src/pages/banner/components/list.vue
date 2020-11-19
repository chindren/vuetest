<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="title" label="轮播图标题"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="$imgUrl+scope.row.img" alt />
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status===1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <v-del @del="reqDel(scope.row.id)"></v-del>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, errorAlert } from "../../../utils/alert";
import { reqBannerDel } from "../../../utils/http";
export default {
  data() {
    return {
      banner: {
        id: "",
        title: "",
        img: null,
        status: 1
      },
      imgUrl: "",
      defaultProps: {}
    };
  },
  computed: {
    ...mapGetters({
      list: "banner/getList"
    })
  },
  methods: {
    ...mapActions({
      reqList: "banner/reqList"
    }),
    reqDel(id) {
      reqBannerDel(id).then(res => {
        if (res.data.code == 200) {
          //成功的弹框
          successAlert(res.data.msg);
          //29.通知父组件刷新list
          this.reqList();
        }
      });
    },
    sco(scope) {
      console.log(scope);
    },
    edit(id) {
      this.$emit("edit", id);
    }
  },
  mounted() {
    this.reqList();
  }
};
</script>

<style scoped>
img {
  width: 80px;
  height: 80px;
}
</style>