<template>
  <div>
    <el-table
      :data="getList"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="title" label="活动名称"></el-table-column>
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
import { reqSeckDel } from "../../../utils/http";
export default {
  props: ["list"],
  data() {
    return {
      tableData: []
    };
  },
  computed: {
    ...mapGetters({
      getList:"seck/getList"
    })
  },
  methods: {
    ...mapActions({
      reqList:"seck/reqList"
    }),
    reqDel(id) {
      reqSeckDel(id).then(res => {
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
  mounted() {
    this.reqList();
  }
};
</script>

<style scoped>
</style>