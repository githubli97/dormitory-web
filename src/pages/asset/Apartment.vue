<template>
  <v-card>
    <v-card-title>
      <v-btn @click="addApartment" color="primary">新增公寓</v-btn>
      <v-spacer/>
      <v-text-field
        append-icon="search"
        label="搜索"
        single-line
        hide-details
        v-model="search"
      />
    </v-card-title>
    <v-divider/>
    <v-data-table
      :headers="headers"
      :items="items"
      :pagination.sync="pagination"
      :total-items="totalItems"
      :loading="loading"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.apartmentName }}</td>
        <td class="text-xs-center">{{ props.item.apartmentManager }}</td>
        <td class="text-xs-center">{{ props.item.totalFloor }}</td>
        <td class="text-xs-center">{{ props.item.apartmentType }}</td>
        <td class="justify-center layout px-0">
          <v-btn icon @click="editApartment(props.item)">
            <i class="el-icon-edit"/>
          </v-btn>
          <v-btn icon @click="deleteApartment(props.item)">
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
        <v-alert :value="true" color="error" icon="warning">
          对不起，没有查询到任何数据 :(
        </v-alert>
      </template>
      <template slot="pageText" slot-scope="props">
        共{{props.itemsLength}}条,当前:{{ props.pageStart }} - {{ props.pageStop }}
      </template>
    </v-data-table>

    <v-dialog v-model="show" max-width="600" scrollable v-if="show">
      <v-card>
        <v-toolbar dark dense color="primary">
          <v-toolbar-title>{{isEdit ? '修改公寓' : '新增公寓'}}</v-toolbar-title>
          <v-spacer/>
          <v-btn icon @click="show = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="px-5 py-2">
          <!-- 表单 -->
          <apartment-form :oldapartment="apartment" :isEdit="isEdit" @close="show = false" :reload="getDataFromApi"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>

</template>

<script>
  import ApartmentForm from './ApartmentForm'
  import {apartmentData} from '../../mockDB'

  export default {
    name: "apartment",
    components: {
      ApartmentForm
    },
    data() {
      return {
        search: '',// 过滤字段
        totalItems: 0,// 总条数
        items: [],// 表格数据
        loading: true,
        pagination: {},// 分页信息
        headers: [// 表头
          {text: 'id', align: 'center', value: 'id'},
          {text: '公寓名', align: 'center', value: 'apartmentName'},
          {text: '公寓管理员', align: 'center', value: 'apartmentManager'},
          {text: '公寓总层数', align: 'center', value: 'totalFloor'},
          {text: '公寓类型', align: 'center', value: 'apartmentType'},
          {text: '操作', align: 'center', value: 'id', sortable: false}
        ],
        show: false,// 是否弹出窗口
        apartment: {}, // 公寓信息
        isEdit: false // 判断是编辑还是新增
      }
    },
    watch: {
      pagination: {
        handler() {
          this.getDataFromApi();
        },
        deep: true
      },
      search: {
        handler() {
          this.getDataFromApi();
        }
      },
      show(val, oldVal) {
        // 表单关闭后重新加载数据
        if (oldVal) {
          this.getDataFromApi();
        }
      }
    },
    mounted() {
      this.getDataFromApi();
    },
    methods: {
      addApartment() {
        this.apartment = {};
        this.isEdit = false;
        this.show = true;
      },
      editApartment(item) {
        this.apartment = item;
        this.isEdit = true;
        this.show = true;
        // // 查询商品分类信息，进行回显
        // this.$http.get("/item/category/bid/" + item.id)
        //   .then(resp => {
        //     this.apartment.categories = resp.data;
        //   })

      },
      deleteApartment(item) {
        this.$message.confirm('此操作将永久删除该公寓, 是否继续?').then(() => {
          // 发起删除请求
          this.$http.delete("/asset/apartment?id=" + item.id,)
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
        // 200ms后返回假数据
        window.setTimeout(() => {
          this.items = apartmentData;
          this.loading = false;

        }, 200)
      }
    }
  }
</script>

<style scoped>

</style>
