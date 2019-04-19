<template>
  <v-card>
    <v-card-title>
      <v-btn @click="addRoom" color="primary">新增宿舍</v-btn>
      <v-spacer/>
      <v-text-field
        append-icon="search"
        label="输入宿舍号"
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
        <td class="text-xs-center">{{ props.item.apartmentId }}</td>
        <td class="text-xs-center">{{ props.item.roomNum }}</td>
        <td class="text-xs-center">{{ props.item.studentCount }}</td>
        <td class="text-xs-center">{{ props.item.roomArea }}</td>
        <td class="justify-center layout px-0">
          <v-btn icon @click="editRoom(props.item)">
            <i class="el-icon-edit"/>
          </v-btn>
          <v-btn icon @click="deleteRoom(props.item)">
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
          <v-toolbar-title>{{isEdit ? '修改宿舍' : '新增宿舍'}}</v-toolbar-title>
          <v-spacer/>
          <v-btn icon @click="show = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="px-5 py-2">
          <!-- 表单 -->
          <room-form :oldRoom="oldRoom" :isEdit="isEdit" @close="show = false" :reload="getDataFromApi"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>

</template>

<script>
  import RoomForm from './RoomForm'

  export default {
    name: "room",
    components: {
      RoomForm
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
          {text: '所属公寓', align: 'center', value: 'apartmentId'},
          {text: '房间号', align: 'center', value: 'roomNum'},
          {text: '入住学生数', align: 'center', value: 'studentCount'},
          {text: '房间面积', align: 'center', value: 'roomArea'},
          {text: '操作', align: 'center', value: 'id', sortable: false}
        ],
        show: false,// 是否弹出窗口
        oldRoom: {}, // 宿舍信息
        isEdit: false, // 判断是编辑还是新增

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
      addRoom() {
        this.oldRoom = null;
        this.isEdit = false;
        this.show = true;
      },
      editRoom(item) {
        this.oldRoom = item;
        this.isEdit = true;
        this.show = true;
      },
      deleteRoom(item) {
        this.$message.confirm('此操作将永久删除该宿舍, 是否继续?').then(() => {
          // 发起删除请求
          this.$http.delete("/asset/room/" + item.id,)
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
        this.$http.get("/asset/room/page", {
          params: {
            page: this.pagination.page, // 当前页
            rows: this.pagination.rowsPerPage, // 每页条数
            sortBy: this.pagination.sortBy, // 排序字段
            desc: this.pagination.descending, // 是否降序
            key: this.search // 查询字段
          }
        }).then(resp => { // 获取响应结果对象
          this.totalItems = resp.data.total; // 总条数
          this.items = resp.data.items; // 宿舍数据
          this.loading = false; // 加载完成
        }).catch(() =>{
          this.showNoData = true;
        });
      }
    }
  }
</script>



<style scoped>

</style>
