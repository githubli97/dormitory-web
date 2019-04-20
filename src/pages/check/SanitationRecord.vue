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
      <td class="text-xs-center">{{ props.item.roomId }}</td>
      <td class="text-xs-center">
        <v-edit-dialog
          :return-value.sync="props.item.score"
          lazy
        >
          <div>{{ props.item.score }}</div>
          <v-text-field
            slot="input"
            v-model="props.item.score"
            :rules="[(v) => v <= 100 || '应小于100!']"
            label="请输入0-100之间的分数"
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
    name: "sanitation-record",
    props: {
      sanitationId: {
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
          {text: '房间号', align: 'center', value: 'roomId'},
          {text: '分数', align: 'center', value: 'score'},
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
        this.$http.get("/check/sanitation_record/page", {
          params: {
            page: this.pagination.page, // 当前页
            rows: this.pagination.rowsPerPage, // 每页条数
            sortBy: this.pagination.sortBy, // 排序字段
            desc: this.pagination.descending, // 是否降序
            sanitationKey: this.sanitationId // 父表主键
          }
        }).then(resp => { // 获取响应结果对象
          this.totalItems = resp.data.total; // 总条数
          this.items = resp.data.items; // 卫生检查单数据
          this.loading = false; // 加载完成
        }).catch(() =>{
          this.showNoData = true;
        });
      },
      saveSanitationRecord(item) {
        this.$http({
          method: 'put', // 动态判断是POST还是PUT
          url: '/check/sanitation_record',
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
