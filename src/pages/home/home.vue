<template>
  <div id="main" class="box">
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import echarts from "echarts";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "cate/getList"
    })
  },
  methods: {
    ...mapActions({
      reqList: "cate/reqList"
    })
  },
  mounted() {
    //触发请求
    this.reqList();
  },
  watch: {
    list: {
      handler() {
        if (this.list.length > 0) {
          
          //画图
          let myChart = echarts.init(document.getElementById("main"));

          // 指定图表的配置项和数据
          var option = {
            title: {
              text: "前端学习课程天数"
            },
            tooltip: {},
            legend: {
              data: ["子分类数量"]
            },
            xAxis: {
              data: this.list.map(item=>item.catename),
            },
            yAxis: {},
            // series 数据
            series: [
              {
                name: "子分类数量",
                type: "bar",
                data:this.list.map(item=>item.children?item.children.length:0)
              },
            ]
          };

          myChart.setOption(option);
        }
      },
      deep: true
    }
  },
};
</script>

<style scoped>
.box {
  width: 80%;
  margin: 20px auto;
  height: 500px;
}
</style>