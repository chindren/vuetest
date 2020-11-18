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
      <el-table-column prop="id" label="分类编号"></el-table-column>
      <el-table-column prop="catename" label="分类名称"></el-table-column>
      <el-table-column prop="img" label="图片">
        <template slot-scope="scope">
          <!-- 数据库里存的Img没有前缀，$imgUrl是放在 -->
          <img :src="$imgUrl+scope.row.img" alt="">
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <!-- <button @click="sco(scope)">scpoe</button> -->
          <el-button type="primary" v-if="scope.row.status===1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <template>
            <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
            <v-del @del="reqDel(scope.row.id)"></v-del>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, errorAlert } from "../../../utils/alert";
import { reqCateDel } from "../../../utils/http";
export default {
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    ...mapActions({
      reqList:"cate/reqList"
    }),
    reqDel(id) {
      reqCateDel(id).then(res => {
        if (res.data.code == 200) {
          //成功的弹框
          successAlert(res.data.msg);
          //29.通知父组件刷新list
          this.reqList()
        }
      });
    },
    edit(id) {
      //通知父组件，要编辑了
      this.$emit("edit", id);
    },
    sco(scoped) {
      console.log(scoped);
    }
  },
  computed: {
    ...mapGetters({
      list: "cate/getList"
    })
  },
  mounted() {
    this.reqList();
  }
};
</script>

<style scoped>
img{
  width: 80px;
  height: 80px;
}
</style>