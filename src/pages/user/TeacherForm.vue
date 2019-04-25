<template>
  <v-form v-model="valid" ref="teacherForm">
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <v-text-field
          label="教师工号"
          v-model="teacher.teacherNo"
          :rules="[v => !!v || '教师姓名不能为空']"
          :counter="10"
        />
      </v-flex>
      <v-flex xs12 sm6>
        <v-text-field
          label="教师姓名"
          v-model="teacher.teacherName"
          :rules="[v => !!v || '教师姓名不能为空']"
          :counter="10"
        />
      </v-flex>
      <v-flex xs12 sm6>
        <el-radio v-model="teacher.sex" label="1" border> 男</el-radio>
        <el-radio v-model="teacher.sex" label="2" border> 女</el-radio>
      </v-flex>

      <v-flex xs12 sm6>
        <v-select
          :items="apartments.states"
          v-model="teacher.apartmentId"
          item-text="apartmentName"
          item-value="id"
          label="管理公寓"
          autocomplete
        ></v-select>
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
  import {Radio} from 'element-ui'



  export default {
    name: "teacher-form",
    props: {
      oldTeacher: {
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
      elRadio: Radio
    },
    data() {
      return {
        baseUrl: config.api,
        valid: false,
        teacher: {
          id: "",
          teacherName: "",
          sex: "",
          apartmentId: "",
          teacherNo: "",
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
      oldTeacher: { //深度监听，可监听到对象、数组的变化
        handler(newV) {
          if (newV) {
            this.teacher = Object.deepCopy(newV);
            this.teacher.sex = this.teacher.sex.toString();
          } else {
            this.teacher = {
              id: "",
              teacherName: "",
              sex: "",
              apartmentId: "",
              teacherNo: "",
            };
          }
        },
        immediate: true
      }
    },
    methods: {
      submit() {
        // 表单校验
        if (this.$refs.teacherForm.validate()) {
          this.$http({
            method: this.isEdit ? 'put' : 'post', // 动态判断是POST还是PUT
            url: '/user/teacher',
            data: this.$qs.stringify(this.teacher)
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
        this.$refs.teacherForm.reset();
      },
      closeWindow() {
        this.$emit("close");
      }
    }
  }
</script>

<style scoped>

</style>
