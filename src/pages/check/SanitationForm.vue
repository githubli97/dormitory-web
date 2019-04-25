<template>
  <v-form v-model="valid" ref="sanitationForm">
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <v-select
          :items="apartments.states"
          v-model="sanitation.checkApartment"
          item-text="apartmentName"
          item-value="id"
          label="管理公寓"
          autocomplete
        ></v-select>
      </v-flex>
      <v-flex xs12 sm6>
        <v-text-field
          label="检查楼层"
          v-model="sanitation.checkFloor"
          :rules="[v => !!v || '检查楼层不能为空']"
          required></v-text-field>
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="检查员"
          v-model="sanitation.inspectorId"
          :rules="[v => !!v || '检查员不能为空']"
          required

        />
      </v-flex>

      <v-flex xs12 sm6>
        <el-date-picker
          v-model="sanitation.checkDate"
          type="datetime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="检查日期">
        </el-date-picker>
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="排序号"
          v-model="sanitation.sortNum"
          :rules="[v => !!v || '排序号不能为空']"
          required
        />
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="'备注"
          v-model="sanitation.remarks"
          required
        />
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
  import {DatePicker} from 'element-ui';


  export default {
    name: "sanitation-form",
    props: {
      oldSanitation: {
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
      elDatePicker: DatePicker
    },
    data() {
      return {
        baseUrl: config.api,
        valid: false,
        sanitation: {
          id: "",
          checkApartment: "",
          checkFloor: "",
          inspectorId: "",
          checkDate: "",
          sortNum: "",
          remarks: ""
        },
        apartments: {
          states: []
        }
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
    watch: {
      oldSanitation:{ //深度监听，可监听到对象、数组的变化
        handler (newV) {
          if (newV) {
            this.sanitation = Object.deepCopy(newV);
          } else {
            this.sanitation = {
              id: "",
              checkApartment: "",
              checkFloor: "",
              inspectorId: "",
              checkDate: "",
              sortNum: "",
              remarks: ""
            };
          }
        },
        immediate:true
      }
    },
  methods: {
    submit() {
      // 表单校验
      if (this.$refs.sanitationForm.validate()) {
        this.$http({
          method: this.isEdit ? 'put' : 'post', // 动态判断是POST还是PUT
          url: '/check/sanitation',
          data: this.sanitation
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
    clear(){
      // 重置表单
      this.$refs.sanitationForm.reset();
    },
    closeWindow(){
      this.$emit("close");
    }
  }
  }
</script>

<style scoped>

</style>
