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
      <el-table-column prop="id" label="规格编号"></el-table-column>
      <el-table-column prop="specsname" label="规格名称"></el-table-column>
      <el-table-column label="规格属性">
        <template slot-scope="scope">
            <el-tag v-for="item in scope.row.attrs" :key="item">{{item}}</el-tag>
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
  reqSpecsAdd,
  reqSpecsAll,
  reqSpecsList,
  reqSpecsDetail,
  reqSpecsupdate,
  reqSpecsDel
} from "../../../utils/http";
export default {
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      reqList: "spec/reqList"
    }),
    reqDel(id) {
      reqSpecsDel(id).then(res => {
        if (res.data.code == 200) {
          //成功的弹框
          successAlert(res.data.msg);
          //29.通知父组件刷新list
          this.reqList()
        }
      });
    },
    edit(id) {
      this.$emit("edit", id);
    }
  },
  computed: {
    ...mapGetters({
      list: "spec/getList",
      total: "spec/getTotal"
    })
  },
  mounted() {
    let list = this.reqList();
  }
};
</script>

<style scoped>
</style>