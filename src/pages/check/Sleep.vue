<template>
  <v-card>
    <v-card-title>
      <v-btn @click="addSleep" color="primary">新增考勤检查单</v-btn>
      <v-spacer/>
      <v-text-field
        append-icon="search"
        label="输入考勤检查单号"
        single-line
        hide-details
        v-model="search"
        v-on:keyup.enter="getDataFromApi"
      />
    </v-card-title>
    <v-divider/>
    <v-data-table
      :headers="headers"
      :items="items"
      :pagination.sync="pagination"
      :rows-per-page-items="rowsPerPageItems"
      :rows-per-page-text="rowsPerPageText"
      :total-items="totalItems"
      :loading="loading"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.checkFloor }}</td>
        <td class="text-xs-center">{{ props.item.inspectorId }}</td>
        <td class="text-xs-center">{{ props.item.checkDate }}</td>
        <td class="justify-center layout px-0">
          <v-btn icon @click="editSleep(props.item)">
            <i class="el-icon-edit"/>
          </v-btn>
          <v-btn icon @click="selectSleepRecord(props.item)">
            <i class="el-icon-tickets" />
          </v-btn>
          <v-btn icon @click="deleteSleep(props.item)">
            <i class="el-icon-delete"/>
          </v-btn>
        </td>
      </template>
      <template slot="expand" slot-scope="props">
        <v-card flat>
          <v-card-text>Peek-a-boo!</v-card-text>
        </v-card>
      </template>
      <template slot="no-data">
        <v-alert :value="showNoData" color="error" icon="warning">
          对不起，没有查询到任何数据 :(
        </v-alert>
      </template>
      <template slot="pageText" slot-scope="props">
        共{{props.itemsLength}}条,当前:{{ props.pageStart }} - {{ props.pageStop }}
      </template>
    </v-data-table>

    <v-dialog v-model="show" max-width="600" scrollable v-if="show" persistent>
      <v-card>
        <v-toolbar dark dense color="primary">
          <v-toolbar-title>{{isEdit ? '修改考勤检查单' : '新增考勤检查单'}}</v-toolbar-title>
          <v-spacer/>
          <v-btn icon @click="show = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="px-5 py-2">
          <!-- 表单 -->
          <sleep-form :oldSleep="oldSleep" :isEdit="isEdit" @close="show = false" :reload="getDataFromApi"/>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="show2" max-width="1000" scrollable v-if="show2" persistent>
      <v-card>
        <v-toolbar dark dense color="primary">
          <v-toolbar-title>考勤状态</v-toolbar-title>
          <v-spacer/>
          <v-btn icon @click="show2 = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="px-5 py-2">
          <!-- 表单 -->
          <sleep-record :sleepId="sleepId" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>

</template>

<script>
    import SleepForm from './SleepForm'
    import SleepRecord from './SleepRecord'

    export default {
      name: "sleep",
      components: {
        SleepForm,
        SleepRecord
      },
      data() {
        return {
          search: '',// 过滤字段
          totalItems: 0,// 总条数
          items: [],// 表格数据
          loading: true,
          pagination: {},// 分页信息
          rowsPerPageItems: [5, 10, 30],
          rowsPerPageText: '每页行数:',
          headers: [// 表头
            {text: '单号', align: 'center', sortable: false, value: 'id'},
            {text: '检查楼层', align: 'center', value: 'checkFloor'},
            {text: '检查员', align: 'center', value: 'inspectorId'},
            {text: '检查日期', align: 'center', value: 'checkDate'},
            {text: '操作', align: 'center', value: 'id', sortable: false}
          ],
          show: false,// 是否弹出窗口
          oldSleep: {}, // 考勤检查单信息
          isEdit: false, // 判断是编辑还是新增

          show2: false,
          sleepId: '',

          showNoData: false

        }
      },
      watch: {
        pagination: {
          handler() {
            this.getDataFromApi();
          },
          deep: true
        },
        show(val, oldVal) {
          // 表单关闭后重新加载数据
          if (oldVal) {
            this.getDataFromApi();
          }
        }
      },
      methods: {
        addSleep() {
          this.oldSleep = null;
          this.isEdit = false;
          this.show = true;
        },
        editSleep(item) {
          this.oldSleep = item;
          this.isEdit = true;
          this.show = true;
        },
        getDataFromApi() {
          this.loading = true;
          // 通过axios获取数据
          this.$http.get("/check/sleep/page", {
            params: {
              page: this.pagination.page, // 当前页
              rows: this.pagination.rowsPerPage, // 每页条数
              sortBy: this.pagination.sortBy, // 排序字段
              desc: this.pagination.descending, // 是否降序
              key: this.search // 查询字段
            }
          }).then(resp => { // 获取响应结果对象
            this.totalItems = resp.data.total; // 总条数
            this.items = resp.data.items; // 考勤检查单数据
            this.loading = false; // 加载完成

          }).catch(() =>{
            this.showNoData = true;
            console.log(this.showNoData);
          });
        },
        deleteSleep(item) {
          this.$message.confirm('此操作将永久删除该考勤检查单, 是否继续?').then(() => {
            // 发起删除请求
            this.$http.delete("/check/sleep/" + item.id,)
              .then(() => {
                // 删除成功，重新加载数据
                this.$message.success("删除成功！");
                this.getDataFromApi();
              })
          }).catch(() => {
            this.$message.info("删除已取消！");
          });

        },
        selectSleepRecord(item) {
          this.show2 = true;
          this.sleepId = item.id;
        }
    }
    }
  </script>



<style scoped>

</style>
