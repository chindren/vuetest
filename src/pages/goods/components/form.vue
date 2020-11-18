<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed" @opened="opened">
      <el-form :model="good">
        <el-form-item label="一级分类" label-width="120px">
          <el-select v-model="good.first_cateid" placeholder="请选择" @change="changeFirst">
            <el-option
              v-for="item in getList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" label-width="120px">
          <el-select v-model="good.second_cateid" placeholder="请选择">
            <el-option
              v-for="item in secList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" label-width="120px">
          <el-input v-model="good.goodsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" label-width="120px">
          <el-input v-model="good.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="市场价格" label-width="120px">
          <el-input v-model="good.market_price" autocomplete="off"></el-input>
        </el-form-item>
        <!-- action是指上传的地址，不用使用他的地址，所以随便写个东西就好了，因为这个是必须的所以不能删除 -->
        <el-form-item label="图片" label-width="120px">
          <el-upload
            action="#"
            list-type="picture-card"
            :on-change="uploadImg"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog visible.sync="true">
            <img width="100%" :src="imgUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="商品规格" label-width="120px">
          <el-select v-model="good.specsid" placeholder="请选择" @change="changeSpecsId">
            <el-option
              v-for="item in getspecList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格属性" label-width="120px">
          <el-select v-model="good.specsattr" placeholder="请选择" multiple>
            <el-option v-for="item in attrsList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否新品" label-width="120px">
          <template>
            <el-radio v-model="good.isnew" label="1">是</el-radio>
            <el-radio v-model="good.isnew" label="2">否</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="是否热卖" label-width="120px">
          <template>
            <el-radio v-model="good.ishot" label="1">是</el-radio>
            <el-radio v-model="good.ishot" label="2">否</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="good.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="商品描述" label-width="120px">
          <div id="div1" v-if="info.isshow"></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title ==='添加商品'" @click="willAdd">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
      {{good}}
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { reqCateList, reqGoodsAdd, reqGoodsDetail } from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
// 引入富文本框
import E from "wangeditor";
export default {
  props: ["info"],
  data() {
    return {
      form: {},
      good: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //此时是[]，后端需要的是"[]"
        isnew: "",
        ishot: "",
        status: 1
      },
      secList: [],
      attrsList: [],
      imgUrl: "",
      defaultProps: {}
    };
  },
  methods: {
    ...mapActions({
      reqList: "cate/reqList",
      reqspecList: "spec/reqList",
      reqgoodssList: "goods/reqList",
      reqgoodssCount: "goods/reqCount"
    }),
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this.good = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //此时是[]，后端需要的是"[]"
        isnew: "",
        ishot: "",
        status: 1
      };
      this.secList = [];
      this.attrsList = [];
      this.imgUrl = "";
    },
    changeFirst() {
      //二级分类的id重置
      this.good.second_cateid = "";
      // 获取上级分类下面的子分类
      this.getSecondList();
    },
    getSecondList(){
      reqCateList({ pid: this.good.first_cateid }).then(res => {
        this.secList = res.data.list;
      });
    },
    changeSpecsId() {
      //先将specsattr 置空
      // this.good.specsattr = [];
      // 取出 specsList ,哪条数据的id和this.user.specsid是一样的
      let obj = this.getspecList.find(item => item.id === this.good.specsid);

      //就将这条数据的attrs取出来，赋值给attrsList
      this.attrsList = obj.attrs;
    },
    getAttrs() {
      // 取出 specsList ,哪条数据的id和this.user.specsid是一样的
      let obj = this.getspecList.find(item => item.id === this.good.specsid);

      //就将这条数据的attrs取出来，赋值给attrsList
      this.attrsList = obj.attrs;
    },
    uploadImg(file) {
      this.good.img = file.raw;
    },
    //36.获取一条数据
    getOne(id) {
      reqGoodsDetail(id).then(res => {
        this.good = res.data.list;
        this.good.id = id;
        //获取二级list
        this.getSecondList();
        //图片
        this.imgUrl = this.$imgUrl + this.good.img;
        // console.log(this.good.img);
        
        // //属性
        // this.good.specsattr = JSON.parse(this.good.specsattr);
        // //计算规格属性的list
        // this.getAttrs();
        // //给编辑器赋值
        // if (this.editor) {
        //   this.editor.txt.html(this.good.description);
        // }
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
          this.reqList();
        } else {
          errorAlert(res.data.msg);
        }
      });
      this,info.title = "添加商品"
    },
    // 当弹窗打开的时候调用，创建一个富文本输入框
    opened() {
      // 将editor放在this上，这里的this还是指的vue对象,这样别人用起来也比较方便
      this.editor = new E("#div1");
      this.editor.create();
    },
    closed() {
      // 如果是添加出现，点击了取消，此时，什么都不做
      // 如果是编辑出现，点击了取消，此时，form置空
      if (this.info.title != "添加s商品") {
        this.empty();
      }
      this.info.title = "添加商品"
    },
    addAttr() {
      this.attrArr.push({
        value: ""
      });
    },
    // 添加成功了之后，一定要重新舒心list列表，不然不会显示新的信息
    willAdd() {
      this.good.description = this.editor.txt.html();

      let d = { ...this.good };
      d.specsattr = JSON.stringify(d.specsattr);

      reqGoodsAdd(d).then(res => {
        if (res.data.code === 200) {
          //成功
          //弹个成功
          successAlert("添加成功");
          //弹框消失
          this.cancel();
          //form置空
          this.empty();
          //24.通知menu刷新列表数据
          this.reqgoodssList();
          this.reqgoodssCount();
        }
      });
    }
  },
  computed: {
    ...mapGetters({
      getList: "cate/getList",
      getspecList: "spec/getList"
    })
  },
  mounted() {
    this.reqList();
    this.reqspecList(true);
  }
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