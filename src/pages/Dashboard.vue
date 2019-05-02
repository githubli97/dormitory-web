<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex xs10 md6>
        <v-card>
          <v-card-text class="px2">
            <div ref="sale" style="width: 100%;height:350px"></div>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs10 md6>
        <v-card>
          <v-card-text class="px2">
            <div ref="pie" style="width: 100%;height:350px"></div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  // 引入 ECharts 主模块
  var echarts = require('echarts/lib/echarts');
  require('echarts/lib/chart/bar');
  require('echarts/lib/chart/pie');

  export default {
    name: "dashboard",
    data() {
      return {}
    },
    mounted() {
      this.$nextTick(() => {
        var sale = echarts.init(this.$refs.sale);


        // 指定图表的配置项和数据
        var option = {
          title: {
            text: '学生人数统计'
          },
          tooltip: {},
          legend: {
            data: ['人数']
          },
          xAxis: {
            data: []
          },
          yAxis: {},
          series: [{
            name: '人数',
            type: 'bar',
            data: []
          }]
        };


        const pie = echarts.init(this.$refs.pie);

        var option2 = {
          roseType: 'angle',
          title: {
            text: '学生分布'
          },
          series: [
            {
              name: '学生分布',
              type: 'pie',
              radius: '55%',
              data: []
            }
          ],
          itemStyle: {
            emphasis: {
              // 阴影的大小
              shadowBlur: 200,
              // 阴影水平方向上的偏移
              shadowOffsetX: 0,
              // 阴影垂直方向上的偏移
              shadowOffsetY: 0,
              // 阴影颜色
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
        this.$http.get("/asset/apartment/peopleCount")
          .then(resp => { // 获取响应结果对象
            for (let i = 0; i < resp.data.length; i++) {
              option.xAxis.data[i] = resp.data[i].apartment_name;
              option.series[0].data[i] = parseInt(resp.data[i].count);
              option2.series[0].data[i] = {value: parseInt(resp.data[i].count), name: resp.data[i].apartment_name}
            }
            // 使用刚指定的配置项和数据显示图表。
            sale.setOption(option);
            pie.setOption(option2)
          })

      })
    }
  }
</script>

<style scoped>

</style>
