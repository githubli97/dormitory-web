<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :pagination.sync="pagination"
    :rows-per-page-items="rowsPerPageItems"
    :rows-per-page-text="rowsPerPageText"
    :total-items="totalItems"
    :loading="loading"
  >
    <template slot="items" slot-scope="props">
      <td class="text-xs-center">{{ props.item.studentId }}</td>
      <td class="text-xs-center">
        <v-edit-dialog
          :return-value.sync="props.item.isNormal"
          lazy
        >
          <div>{{ props.item.isNormal }}</div>
          <v-text-field
            slot="input"
            v-model="props.item.isNormal"
            :rules="[(v) => v <= 100 || '应小于100!']"
            single-line
            counter
            autofocus
            v-on:keyup.enter="saveSanitationRecord(props.item)"
          ></v-text-field>
        </v-edit-dialog>
      </td>
      <td class="text-xs-center">
        <v-edit-dialog
          :return-value.sync="props.item.remark"
          lazy
        >
          <div>{{ props.item.remark }}</div>
          <v-text-field
            slot="input"
            v-model="props.item.remark"
            :rules="[(v) => v.length <= 25 || '字数应小于25']"
            label="请输入25字以内备注"
            single-line
            counter
            autofocus
            v-on:keyup.enter="saveSanitationRecord(props.item)"
          ></v-text-field>
        </v-edit-dialog>
      </td>
    </template>
    <template slot="no-data">
      <v-alert :value="showNoData" color="error" icon="warning">
        对不起，没有查询到任何数据 :(
      </v-alert>
    </template>
    <template slot="pageText" slot-scope="{ pageStart, pageStop }">
      从 {{ pageStart }}条, 到 {{ pageStop }}条
    </template>
  </v-data-table>
</template>
<script>
  export default {
    name: "sleep-record",
    props: {
      sleepId: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        totalItems: 0,// 总条数
        items: [],// 表格数据
        loading: true,
        pagination: {},
        rowsPerPageItems: [5, 10, 30],
        rowsPerPageText: '每页行数:',
        headers: [
          {text: '学生姓名', align: 'center', value: 'studentId'},
          {text: '是否正常考勤', align: 'center', value: 'isNormal'},
          {text: '备注', align: 'center', sortable: false, value: 'remark'}
        ],

        showNoData: false
      }
    },
    watch: {
      pagination: {
        handler() {
          this.getDataFromApi();
        },
        deep: true
      }
    },
    created() {
      this.getDataFromApi();
    },
    methods: {
      getDataFromApi() {
        this.loading = true;
        // 通过axios获取数据
        this.$http.get("/check/sleep_record/page", {
          params: {
            page: this.pagination.page, // 当前页
            rows: this.pagination.rowsPerPage, // 每页条数
            sortBy: this.pagination.sortBy, // 排序字段
            desc: this.pagination.descending, // 是否降序
            sleepKey: this.sleepId // 父表主键
          }
        }).then(resp => { // 获取响应结果对象
          this.totalItems = resp.data.total; // 总条数
          this.items = resp.data.items; // 卫生检查单数据
          this.loading = false; // 加载完成
        }).catch(() =>{
          this.showNoData = true;
          console.log(this.showNoData);
        });
      },
      saveSanitationRecord(item) {
        this.$http({
          method: 'put', // 动态判断是POST还是PUT
          url: '/check/sleep_record',
          data: item
        }).then(() => {
          this.$message.success("保存成功！");
        })
          .catch(() => {
            this.$message.error("保存失败！");
          });
      }
      }
  }
</script>
<style scoped>

</style>
