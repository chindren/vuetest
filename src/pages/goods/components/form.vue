<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed" @opened="opened">
      <el-form :model="good" :rules="rules">
        <el-form-item label="一级分类" label-width="120px" prop="first_cateid">
          <el-select v-model="good.first_cateid" placeholder="请选择" @change="changeFirst">
            <el-option
              v-for="item in getList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" label-width="120px" prop="second_cateid">
          <el-select v-model="good.second_cateid" placeholder="请选择">
            <el-option
              v-for="item in secList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" label-width="120px" prop="goodsname">
          <el-input v-model="good.goodsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" label-width="120px" prop="price">
          <el-input v-model="good.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="市场价格" label-width="120px" prop="market_price">
          <el-input v-model="good.market_price" autocomplete="off"></el-input>
        </el-form-item>
        <!-- action是指上传的地址，不用使用他的地址，所以随便写个东西就好了，因为这个是必须的所以不能删除 -->
        <el-form-item label="图片" label-width="120px">
          <template>
            <div class="myupload">
              <span>+</span>
              <!-- 当图片显示出来以后,input就不显示了 -->
              <img :src="imgUrl" class="imgs" v-if="imgUrl != ''" />
              <!-- 当文件选择成功之后，input会发生改变，可以调用change事件，调用函数
              这个函数的event事件中target中files会有文件的信息-->
              <input type="file" class="upload" @change="changeFile" />
            </div>
          </template>
        </el-form-item>
        <el-form-item label="商品规格" label-width="120px" prop="specsid">
          <el-select v-model="good.specsid" placeholder="请选择" @change="changeSpecsId">
            <el-option
              v-for="item in getspecList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格属性" label-width="120px" prop="specsattr">
          <el-select v-model="good.specsattr" placeholder="请选择" multiple>
            <el-option v-for="item in attrsList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否新品" label-width="120px">
          <template>
            <el-radio v-model="good.isnew" :label="1">是</el-radio>
            <el-radio v-model="good.isnew" :label="2">否</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="是否热卖" label-width="120px">
          <template>
            <el-radio v-model="good.ishot" :label="1">是</el-radio>
            <el-radio v-model="good.ishot" :label="2">否</el-radio>
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
    </el-dialog>
  </div>
</template>

<script>
import path from "path";
import { mapGetters, mapActions } from "vuex";
import {
  reqCateList,
  reqGoodsAdd,
  reqGoodsDetail,
  reqGoodsupdate
} from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
// 引入富文本框
import E from "wangeditor";
export default {
  props: ["info"],
  data() {
    return {
      rules: {
        first_cateid: [
          { required: true, message: "请输入一级分类", trigger: "change" }
        ],
        second_cateid: [
          { required: true, message: "请输入二级分类", trigger: "change" }
        ],
        goodsname: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        market_price: [
          { required: true, message: "请输入商品市场价格", trigger: "blur" }
        ],
        specsid: [
          { required: true, message: "请输入商品规格", trigger: "change" }
        ],
        specsattr: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个规格属性",
            trigger: "change"
          }
        ]
      },
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
  computed: {
    ...mapGetters({
      getList: "cate/getList",
      getspecList: "spec/getList"
    })
  },
  methods: {
    ...mapActions({
      reqList: "cate/reqList",
      reqspecList: "spec/reqList",
      reqgoodssList: "goods/reqList",
      reqgoodssCount: "goods/reqCount"
    }),
    check() {
      return new Promise((resolve, reject) => {
        //验证
        if (this.good.first_cateid === "") {
          errorAlert("一级分类不能为空");
          return;
        }
        if (this.good.second_cateid === "") {
          errorAlert("二级分类不能为空");
          return;
        }
        if (this.good.goodsname === "") {
          errorAlert("商品名称为空");
          return;
        }
        if (this.good.price === "") {
          errorAlert("商品价格为空");
          return;
        }
        if (this.good.market_price === "") {
          errorAlert("商品市场价格为空");
          return;
        }
        if (!this.good.img) {
          errorAlert("请选择图片");
          return;
        }
        if (this.good.specsid === "") {
          errorAlert("请选择商品规格");
          return;
        }
        if (this.good.specsattr.length === 0) {
          errorAlert("请选择商品属性");
          return;
        }
        if (this.editor.txt.html() === "") {
          errorAlert("请输入商品描述");
          return;
        }
        resolve();
      });
    },
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
    getSecondList() {
      reqCateList({ pid: this.good.first_cateid }).then(res => {
        this.secList = res.data.list;
      });
    },
    changeSpecsId() {
      //先将specsattr 置空
      this.good.specsattr = [];
      this.getAttrs();
      // 取出 specsList ,哪条数据的id和this.good.specsid是一样的
      // let obj = this.getspecList.find(item => item.id === this.good.specsid);

      // //就将这条数据的attrs取出来，赋值给attrsList
      // this.attrsList = obj.attrs;
    },
    getAttrs() {
      // 取出 specsList ,哪条数据的id和this.good.specsid是一样的
      let obj = this.getspecList.find(item => {
        return item.id === this.good.specsid;
      });

      //就将这条数据的attrs取出来，赋值给attrsList
      this.attrsList = obj ? obj.attrs : [];
    },
    changeFile(event) {
      // console.log(event);
      // 获取file文件信息
      let file = event.target.files[0];

      // 获取文件的后缀名
      let extname = path.extname(file.name);
      // console.log(extname);

      let arr = [".jpg", ".jpeg", ".png", ".gif"];
      if (!arr.includes(extname)) {
        errorAlert("请上传正确的图片格式");
      }
      if (file.size > 2 * 1024 * 1024) {
        errorAlert("文件大小不能超过2M");
      }

      // URL.createObjectURL(file) 将一个文件生成一个URL地址
      this.imgUrl = URL.createObjectURL(file);
      //给good.img赋值
      ///**********************为什么要给img传值file，而不是img的url**************************************** */
      this.good.img = file;
      // console.log( this.cate.img);
    },
    //36.获取一条数据
    getOne(id) {
      reqGoodsDetail(id).then(res => {
        this.good = res.data.list;
        console.log(this.good);

        this.good.id = id;
        //获取二级list
        this.getSecondList();
        //图片
        this.imgUrl = this.$imgUrl + this.good.img;
        // console.log(this.good.img);

        // //属性
        this.good.specsattr = JSON.parse(this.good.specsattr);
        // //计算规格属性的list
        this.getAttrs();
        //给编辑器赋值
        if (this.editor) {
          this.editor.txt.html(this.good.description);
        }
      });
    },
    //37 点了修改
    update() {
      this.check().then(() => {
        this.good.description = this.editor.txt.html();
        let d = { ...this.good };
        d.specsattr = JSON.stringify(d.specsattr);
        console.log(this.good);

        reqGoodsupdate(this.good).then(res => {
          console.log(111);

          if (res.data.code === 200) {
            //成功弹框
            successAlert("修改成功");
            //弹框消失
            this.cancel();
            //form重置
            this.empty();
            //列表刷新
            this.reqgoodssList();
            this.reqgoodssCount();
          }
        });
      });
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
      this.info.title = "添加商品";
    },
    addAttr() {
      this.attrArr.push({
        value: ""
      });
    },
    // 添加成功了之后，一定要重新舒心list列表，不然不会显示新的信息
    willAdd() {
      this.check().then(() => {
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
      });
    }
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
.myupload {
  position: relative;
  width: 100px;
  height: 100px;
  text-align: center;
  border: 1px dashed #ccc;
}
.myupload span {
  font-size: 30px;
  width: 100%;
  height: 100%;
  line-height: 100px;
}
.upload {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
.imgs {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>