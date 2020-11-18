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
      <el-table-column prop="id" label="菜单编号"></el-table-column>
      <el-table-column prop="title" label="菜单名称"></el-table-column>
      <el-table-column label="菜单图标">
        <!-- 代表当前行的信息 -->
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="采单地址"></el-table-column>
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
            <!-- 将删除按钮作为一个独立的组件 -->
            <!-- <el-button type="danger" @click="del(scope.row.id)">删除</el-button> -->
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, errorAlert } from "../../../utils/alert";
import { reqMenuDel } from "../../../utils/http";
export default {
  props: ["list"],
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    ...mapActions({}),
    reqDel(id) {
      reqMenuDel(id).then(res => {
        if (res.data.code == 200) {
          //成功的弹框
          successAlert(res.data.msg);
          //29.通知父组件刷新list
          this.$emit("init");
        } else {
          errorAlert(res.data.msg);
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
    ...mapGetters({})
  },
  mounted() {}
};
</script>

<style scoped>
</style>