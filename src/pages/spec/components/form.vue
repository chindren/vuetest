<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="spec">
        <el-form-item label="规格名称" label-width="120px">
          <el-input v-model="spec.specsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="规格属性" label-width="120px" v-for="(item,index) in attrArr" :key="index">
          <div class="line">
            <el-input v-model="item.value" autocomplete="off"></el-input>
            <el-button type="primary" v-if="index===0" @click="addAttr">新增规格属性</el-button>
            <v-del v-else @del="willdel(index)"></v-del>
          </div>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="spec.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title ==='添加规格'" @click="willAdd">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
      {{spec}}{{attrArr}}
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// 引入routes,为了方便放在上级菜单的下拉选项中，routes在template中不能直接使用，要先定义一下
import { routes } from "../../../router/index";
import {
  reqSpecsAdd,
  reqSpecsAll,
  reqSpecsList,
  reqSpecsDetail,
  reqSpecsupdate,
  reqSpecsDel
} from "../../../utils/http";

import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      form: {},
      spec: {
        specsname: "",
        attrs: "",
        status: 1
      },
      attrArr: [{ value: "" }],
      defaultProps: {}
    };
  },
  methods: {
    ...mapActions({
      reqList: "spec/reqList"
    }),
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this.spec = {
        specsname: "",
        attrs: "",
        status: 1
      };
      this.attrArr = [{ value: "" }];
    },
    willdel(index){
      this.attrArr.splice(index,1);
    },
    //36.获取一条数据
    getOne(id) {
      reqSpecsDetail(id).then(res => {
        //此时form上是没有id的
        this.spec = res.data.list[0];
        //  '["s","M"]'-->[{value:"s"},{value:"M"}]
        this.attrArr = JSON.parse(this.spec.attrs).map(item => ({
          value: item
        }));
        //补id
        this.spec.id = id;
      });
    },
    //37 点了修改
    update() {
      this.spec.attrs = JSON.stringify(this.attrArr.map(item => item.value));
      reqSpecsupdate(this.spec).then(res => {
        if (res.data.code === 200) {
          //成功弹框
          successAlert("修改成功");
          //弹框消失
          this.cancel();
          //form重置
          this.empty();
          //列表刷新
          this.reqList()
        } else {
          errorAlert(res.data.msg);
        }
      });
    },
    closed() {
      // 如果是添加出现，点击了取消，此时，什么都不做
      // 如果是编辑出现，点击了取消，此时，form置空
      if (this.info.title === "编辑菜单") {
        this.empty();
      }
    },
    addAttr() {
      this.attrArr.push({
        value: ""
      });
    },
    // 添加成功了之后，一定要重新舒心list列表，不然不会显示新的信息
    willAdd() {
      this.spec.attrs = JSON.stringify(this.attrArr.map(item => item.value));

      reqSpecsAdd(this.spec).then(res => {
        if (res.data.code === 200) {
          //成功
          //弹个成功
          successAlert("添加成功");
          //弹框消失
          this.cancel();
          //form置空
          this.empty();
          //24.通知menu刷新列表数据
          this.reqList();
        }
      });
    }
  },
  computed: {
    ...mapGetters({
      getList: "spec/getList"
    })
  },
  mounted() {}
};
</script>

<style scoped>
.line {
  display: flex;
}
.line .el-input {
  flex: 1;
}
.line .el-button {
  width: auto;
}
</style>