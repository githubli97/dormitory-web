<template>
  <v-card>
    <v-card-title>
      <v-btn @click="addStudent" color="primary">新增学生信息</v-btn>
      <v-spacer/>
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
        <td class="text-xs-center">{{ props.item.studentNo }}</td>
        <td class="text-xs-center">{{ props.item.studentName }}</td>
        <td class="text-xs-center">{{ props.item.sex }}</td>
        <td class="text-xs-center">{{ props.item.phone }}</td>
        <td class="text-xs-center">{{ props.item.email }}</td>
        <td class="justify-center layout px-0">
          <v-btn icon @click="editStudent(props.item)">
            <i class="el-icon-edit"/>
          </v-btn>
          <v-btn icon @click="deleteStudent(props.item)">
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

    <v-dialog v-model="show" max-width="800" scrollable v-if="show" persistent>
      <v-card>
        <v-toolbar dark dense color="primary">
          <v-toolbar-title>{{isEdit ? '修改学生信息' : '新增学生信息'}}</v-toolbar-title>
          <v-spacer/>
          <v-btn icon @click="show = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="px-5 py-2">
          <!-- 表单 -->
          <student-form :oldStudent="oldStudent" :isEdit="isEdit" @close="show = false"
                        :reload="getDataFromApi"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>

</template>

<script>
  import StudentForm from './StudentForm'

  export default {
    name: "student",
    components: {
      StudentForm
    },
    data() {
      return {
        totalItems: 0,// 总条数
        items: [],// 表格数据
        loading: true,
        pagination: {},// 分页信息
        rowsPerPageItems: [5, 10, 30],
        rowsPerPageText: '每页行数:',
        headers: [// 表头
          {text: '学号', align: 'center', value: 'studentNo'},
          {text: '姓名', align: 'center', value: 'studentName'},
          {text: '性别', align: 'center', value: 'sex'},
          {text: '联系电话', align: 'center', value: 'phone'},
          {text: '邮箱', align: 'center', value: 'email'},
          {text: '操作', align: 'center', value: 'id', sortable: false}
        ],
        show: false,// 是否弹出窗口
        oldStudent: {}, // 学生信息信息
        isEdit: false, // 判断是编辑还是新增

        show2: false,
        studentId: '',

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
      addStudent() {
        this.oldStudent = null;
        this.isEdit = false;
        this.show = true;
      },
      updateState(item) {
        this.$http({
          method: 'put',
          url: '/user/student',
          data: this.$qs.stringify(item)
        }).then(() => {
          this.$message.success("修改成功！");
          // this.getDataFromApi();
        })
          .catch(() => {
            this.$message.error("修改失败！");
          });
      },
      editStudent(item) {
        this.oldStudent = item;
        this.isEdit = true;
        this.show = true;
      },
      deleteStudent(item) {
        this.$message.confirm('此操作将永久删除该学生信息, 是否继续?').then(() => {
          // 发起删除请求
          this.$http.delete("/user/student/" + item.id,)
            .then(() => {
              // 删除成功，重新加载数据
              this.$message.success("删除成功！");
              this.getDataFromApi();
            })
        }).catch(() => {
          this.$message.info("删除已取消！");
        });

      },
      getDataFromApi() {
        this.loading = true;
        // 通过axios获取数据
        this.$http.get("/user/student/page", {
          params: {
            page: this.pagination.page, // 当前页
            rows: this.pagination.rowsPerPage, // 每页条数
            sortBy: this.pagination.sortBy, // 排序字段
            desc: this.pagination.descending, // 是否降序
          }
        }).then(resp => { // 获取响应结果对象
          this.totalItems = resp.data.total; // 总条数
          this.items = resp.data.items; // 学生信息数据
          this.loading = false; // 加载完成
        }).catch(() => {
          this.showNoData = true;
          this.loading = false; // 加载完成
        });
      }
    }
  }
</script>


<style scoped>

</style>
