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
      <el-table-column prop="id" label="商品编号"></el-table-column>
      <el-table-column prop="goodsname" label="商品名称"></el-table-column>
      <el-table-column prop="price" label="商品价格"></el-table-column>
      <el-table-column prop="market_price" label="市场价格"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="$imgUrl+scope.row.img" alt />
        </template>
      </el-table-column>
      <el-table-column label="是否新品">
        <template slot-scope="scope">
          <!-- <button @click="sco(scope)">scpoe</button> -->
          <el-button type="primary" v-if="scope.row.status===1">是</el-button>
          <el-button type="danger " v-else>否</el-button>
        </template>
      </el-table-column>
      <el-table-column label="是否热卖">
        <template slot-scope="scope">
          <!-- <button @click="sco(scope)">scpoe</button> -->
          <el-button type="primary" v-if="scope.row.status===1">是</el-button>
          <el-button type="danger " v-else>否</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <!-- <button @click="sco(scope)">scpoe</button> -->
          <el-button type="primary" v-if="scope.row.ishot===1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <v-del @del="reqDel(scope.row.id)"></v-del>
          <!-- 将删除按钮作为一个独立的组件 -->
          <!-- <el-button type="danger" @click="del(scope.row.id)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, errorAlert } from "../../../utils/alert";
import {
  reqGoodsDel
} from "../../../utils/http";
export default {
  data() {
    return {
      imgSrc: ""
    };
  },
  methods: {
    ...mapActions({
      reqList: "goods/reqList",
      reqCount: "goods/reqCount",
      changePage: "goods/changePage"
    }),
    reqDel(id) {
      reqGoodsDel(id).then(res => {
        if (res.data.code == 200) {
          //成功的弹框
          successAlert(res.data.msg);
          //29.通知父组件刷新list
          this.reqList();
          this.reqCount();
        }
      });
    },
    sco(scope){
      console.log(scope);
    },
    edit(id) {
      this.$emit("edit", id);
    }
  },
  computed: {
    ...mapGetters({
      list: "goods/list",
      total: "goods/total",
      size: "goods/size"
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