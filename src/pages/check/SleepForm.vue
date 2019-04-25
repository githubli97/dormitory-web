<template>
  <v-form v-model="valid" ref="sleepForm">
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <v-select
          :items="apartments.states"
          v-model="sleep.checkApartment"
          item-text="apartmentName"
          item-value="id"
          label="检查公寓"
          autocomplete
        ></v-select>
      </v-flex>
      <v-flex xs12 sm6>
        <v-text-field
          label="检查楼层"
          v-model="sleep.checkFloor"
          :rules="[v => !!v || '检查楼层不能为空']"
          required></v-text-field>
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="检查员"
          v-model="sleep.inspectorId"
          :rules="[v => !!v || '检查员不能为空']"
          required

        />
      </v-flex>

      <v-flex xs12 sm6>
        <el-date-picker
          v-model="sleep.checkDate"
          type="datetime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="检查日期">
        </el-date-picker>
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="排序号"
          v-model="sleep.sortNum"
          :rules="[v => !!v || '排序号不能为空']"
          required
        />
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="'备注"
          v-model="sleep.remarks"
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
    name: "sleep-form",
    props: {
      oldSleep: {
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
        sleep: {
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
    }, beforeCreate() {
      this.$http({
        method: 'get', // 动态判断是POST还是PUT
        url: '/asset/apartment/selectIdAndNames'
      }).then(resp => {
        this.apartments.states = resp.data;
      });
    },
    watch: {
      oldSleep:{ //深度监听，可监听到对象、数组的变化
        handler (newV) {
          if (newV) {
            this.sleep = Object.deepCopy(newV);
          } else {
            this.sleep = {
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
      if (this.$refs.sleepForm.validate()) {
        this.$http({
          method: this.isEdit ? 'put' : 'post', // 动态判断是POST还是PUT
          url: '/check/sleep',
          data: this.sleep
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
      this.$refs.sleepForm.reset();
    },
    closeWindow(){
      this.$emit("close");
    }
  }
  }
</script>

<style scoped>

</style>
