<template>
  <v-card>
    <v-card-title>
      <v-btn @click="addAnnouncement" color="primary">新增公告</v-btn>
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
        <td class="text-xs-center">{{ props.item.title }}</td>
        <td class="text-xs-center">{{ props.item.adviceArea }}</td>
        <td class="text-xs-center">{{ props.item.createTime }}</td>
        <td class="text-xs-center">
          <v-switch
            :label="`${props.item.state ? '启用' : '禁用'}`"
            color="success"
            v-model="props.item.state"
            @change="updateState(props.item)"
          ></v-switch>
        </td>
        <td class="justify-center layout px-0">
          <v-btn icon @click="editAnnouncement(props.item)">
            <i class="el-icon-edit"/>
          </v-btn>
          <v-btn icon @click="deleteAnnouncement(props.item)">
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
          <v-toolbar-title>{{isEdit ? '修改公告' : '新增公告'}}</v-toolbar-title>
          <v-spacer/>
          <v-btn icon @click="show = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="px-5 py-2">
          <!-- 表单 -->
          <announcement-form :oldAnnouncement="oldAnnouncement" :isEdit="isEdit" @close="show = false"
                             :reload="getDataFromApi"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>

</template>

<script>
  import AnnouncementForm from './AnnouncementForm'

  export default {
    name: "announcement",
    components: {
      AnnouncementForm
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
          {text: '主题', align: 'center', sortable: false, value: 'title'},
          {text: '所属公寓', align: 'center', value: 'adviceArea'},
          {text: '创建时间', align: 'center', value: 'createTime'},
          {text: '是否启用', align: 'left', value: 'state'},
          {text: '操作', align: 'center', value: 'id', sortable: false}
        ],
        show: false,// 是否弹出窗口
        oldAnnouncement: {}, // 公告信息
        isEdit: false, // 判断是编辑还是新增

        show2: false,
        announcementId: '',

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
      addAnnouncement() {
        this.oldAnnouncement = null;
        this.isEdit = false;
        this.show = true;
      },
      updateState(item) {
        this.$http({
          method: 'put',
          url: '/others/announcement',
          data: this.$qs.stringify(item)
        }).then(() => {
          this.$message.success("公告显示！");
          // this.getDataFromApi();
        })
          .catch(() => {
            this.$message.error("公告关闭！");
          });
      },
      editAnnouncement(item) {
        this.oldAnnouncement = item;
        this.isEdit = true;
        this.show = true;
      },
      deleteAnnouncement(item) {
        this.$message.confirm('此操作将永久删除该公告, 是否继续?').then(() => {
          // 发起删除请求
          this.$http.delete("/others/announcement/" + item.id,)
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
        this.$http.get("/others/announcement/page", {
          params: {
            page: this.pagination.page, // 当前页
            rows: this.pagination.rowsPerPage, // 每页条数
            sortBy: this.pagination.sortBy, // 排序字段
            desc: this.pagination.descending, // 是否降序
          }
        }).then(resp => { // 获取响应结果对象
          this.totalItems = resp.data.total; // 总条数
          this.items = resp.data.items; // 公告数据
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
