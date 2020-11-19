<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="form">
        <el-form-item label="活动名称" label-width="120px">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动期限" label-width="120px">
          <template>
            <div class="block">
              <el-date-picker
                v-model="time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              ></el-date-picker>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="一级分类" label-width="120px">
          <!-- form.pid是谁，地下value为该值的就会被选中 -->
          <el-select v-model="form.first_cateid" placeholder="请选择" @change="changeFirstid">
            <el-option label="请选择" :value="0"></el-option>
            <el-option
              v-for="item in getcateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" label-width="120px">
          <!-- form.pid是谁，地下value为该值的就会被选中 -->
          <el-select v-model="form.second_cateid" placeholder="请选择" @change="changeSecondid">
            <el-option label="请选择" :value="0"></el-option>
            <el-option
              v-for="item in secondArr"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品" label-width="120px">
          <el-select v-model="form.goodsid" placeholder="请选择">
            <el-option
              v-for="item in goodsArr"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="willadd" v-if="info.title==='添加活动'">添 加</el-button>
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
      {{form}}{{time}}
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// 引入routes,为了方便放在上级菜单的下拉选项中，routes在template中不能直接使用，要先定义一下
import { routes } from "../../../router/index";
import { reqCateList,reqGoodsList,reqSeckAdd,reqSeckDetail,reqSeckUpdate } from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  props: ["info", "list"],
  data() {
    return {
      time: [],
      form: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1
      },
      //   定义二级分类需要用的数组
      secondArr: [],
      goodsArr: []
    };
  },
  computed: {
    ...mapGetters({
      getList: "seck/getList",
      getcateList: "cate/getList",
    })
  },
  methods: {
    ...mapActions({
      reqList: "seck/reqList",
      reqcatesList: "cate/reqList",
    }),
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this.time="";
      this.form={
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1
      },
      //   定义二级分类需要用的数组
      this.secondArr=[];
      this.goodsArr=[]
    },
    //36.获取一条数据
    getOne(id) {
      reqSeckDetail(id).then(res => {
        //此时form上是没有id的
        this.form = res.data.list;
        // 时间设置
        this.time.push(
          new Date(JSON.parse(this.form.begintime)),
          new Date(JSON.parse(this.form.endtime))
        );
        this.getTwo();
        this.getGoods();
        //补id
        this.form.id = id;
      });
    },
    //37 点了修改
    update() {
      reqSeckUpdate(this.form).then(res => {
        if (res.data.code === 200) {
          //成功弹框
          successAlert("修改成功");
          //弹框消失
          this.cancel();
          //form重置
          this.empty();
          //列表刷新
          this.reqList();
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
    //27.上级菜单发生了修改
    changeFirstid() {
      this.form.second_cateid="";
      this.getTwo();
    },
    getTwo(){
      // 获取一级分类的id值，取出这一条数据，然后取出里面的children
      // reqCateList穿的值为{istree: true}时，获取的是所有的数据，传递的是{pid: }获取当前元素的子元素
      reqCateList({ pid: this.form.first_cateid }).then(res => {
        this.secondArr = res.data.list;
      });
    },
    changeSecondid(){
      this.goodsArr=[];
      this.getGoods();
    },
    getGoods(){
      reqGoodsList({fid:this.form.first_cateid,sid:this.form.second_cateid}).then(res=>{
        this.goodsArr = res.data.list;
      })
    },
    // 添加成功了之后，一定要重新舒心list列表，不然不会显示新的信息
    willadd() {
      this.form.begintime = this.time[0].getTime();
      this.form.endtime = this.time[1].getTime()
      // console.log(this.form);
      
      reqSeckAdd(this.form).then(res => {
        if (res.data.code === 200) {
          //成功
          //弹个成功
          successAlert("添加成功");
          //弹框消失
          this.cancel();
          //form置空
          this.empty();
          //24.刷新列表数据
          this.reqList();
        }
      });
    }
  },
  mounted() {
    this.reqcatesList();
  }
};
</script>

<style scoped>
.block {
  width: 100%;
}
.el-date-picker {
  width: 100% !important;
}
</style>