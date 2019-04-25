<template>
  <v-form v-model="valid" ref="waterstockForm">
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <div>发布总量</div>
        <el-input-number v-model="waterstock.amount" :min="0" :max="50" label="发布总量"></el-input-number>
      </v-flex>
      <v-flex xs12 sm6>
        <div>剩余库存</div>
        <el-input-number v-model="waterstock.stock" :min="0" :max="50" label="剩余库存"></el-input-number>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <div>排序号</div>
        <el-input-number v-model="waterstock.sortNum" label="排序号"></el-input-number>
      </v-flex>
      <v-flex xs12 sm6>
        <v-select
          :items="apartments.states"
          v-model="waterstock.apartmentId"
          item-text="apartmentName"
          item-value="id"
          label="所属公寓"
          autocomplete
        ></v-select>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <div>当前状态</div>
        <v-switch
          :label="`${waterstock.isValid ? '启用' : '禁用'}`"
          color="success"
          v-model="waterstock.isValid"
        ></v-switch>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <v-text-field
          v-model="waterstock.remark"
          name="input-7-1"
          label="备注"
          multi-line
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout class="my-4">
      <v-btn @click="submit" color="primary">提交</v-btn>
      <v-btn @click="clear" color="warning">重置</v-btn>
    </v-layout>
  </v-form>
</template>

<script>
  import config from '@/config';
  import {InputNumber} from 'element-ui'


  export default {
    name: "waterstock-form",
    props: {
      oldWaterstock: {
        type: Object
      },
      isEdit: {
        type: Boolean,
        default: false
      },
      show: {
        type: Boolean,
        default: true
      }
    },
    components: {
      ElInputNumber: InputNumber
    },
    data() {
      return {
        baseUrl: config.api,
        valid: false,
        waterstock: {
          id: "",
          teacherId: "",
          apartmentId: "",
          sendDate: "",
          amount: "",
          stock: "",
          remark: "",
          isValid: ""
        },
        apartments: {
          states: []
        }
      }
    },
    watch: {
      oldWaterstock: { //深度监听，可监听到对象、数组的变化
        handler(newV) {
          if (newV) {
            this.waterstock = Object.deepCopy(newV);
          } else {
            this.waterstock = {
              id: "",
              teacherId: "",
              apartmentId: "",
              sendDate: "",
              amount: "",
              stock: "",
              remark: "",
              isValid: ""
            };
          }
        },
        immediate: true
      }
    },
    beforeCreate() {
      this.$http({
        method: 'get', // 动态判断是POST还是PUT
        url: '/asset/apartment/selectIdAndNames'
      }).then(resp => {
        this.apartments.states = resp.data;
      });
    },
    methods: {
      submit() {
        // 表单校验
        if (this.$refs.waterstockForm.validate()) {
          this.$http({
            method: this.isEdit ? 'put' : 'post', // 动态判断是POST还是PUT
            url: '/others/stock',
            data: this.$qs.stringify(this.waterstock)
          }).then(() => {
            this.$message.success("保存成功！");
            // 关闭窗口
            this.$emit("close");
          })
            .catch(() => {
              this.$message.error("保存失败！");
            });
        }
      },
      clear() {
        // 重置表单
        this.$refs.waterstockForm.reset();
      },
      closeWindow() {
        this.$emit("close");
      }
    }
  }
</script>

<style scoped>

</style>
