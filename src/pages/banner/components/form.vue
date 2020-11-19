<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="banner">
        <el-form-item label="标题" label-width="120px">
          <el-input v-model="banner.title" autocomplete="off"></el-input>
        </el-form-item>
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
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="banner.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title ==='轮播图添加'" @click="willAdd">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
      {{banner}}
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqBannerAdd,
  reqBannerDetail,
  reqBannerUpdate
} from "../../../utils/http";

import path from "path";
import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      banner: {
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
      getBannerList: "banner/getList"
    })
  },
  methods: {
    ...mapActions({
      reqList: "banner/reqList"
    }),
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      this.cate = {
        roleid: "",
        username: "",
        password: "",
        status: 1
      };
    },
    //36.获取一条数据
    getOne(id) {
      reqBannerDetail(id).then(res => {
        //此时form上是没有id的
        this.banner = res.data.list;
        this.imgUrl = this.$imgUrl + this.banner.img;
        //补id
        this.banner.id = id;
      });
    },
    //37 点了修改
    update() {
      reqBannerUpdate(this.banner).then(res => {
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
    // 添加成功了之后，一定要重新舒心list列表，不然不会显示新的信息
    willAdd() {
      reqBannerAdd(this.banner).then(res => {
        if (res.data.code === 200) {
          //成功
          //弹个成功
          successAlert("添加成功");
          //弹框消失
          this.cancel();
          //form置空
          this.empty();
          //24.通知menu刷新列表数据，更新vuex中的数据
          this.reqList();
        }
      });
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
      //给user.img赋值
      ///**********************为什么要给img传值file，而不是img的url**************************************** */
      this.banner.img = file;
      // console.log( this.cate.img);
    }
  },
  mounted() {
    this.reqList();
  }
};
</script>

<style scoped>
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