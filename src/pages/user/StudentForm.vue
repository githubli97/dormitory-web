<template>
  <v-form v-model="valid" ref="studentForm">
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <v-text-field
          label="学生工号"
          v-model="student.studentNo"
          :rules="[v => !!v || '学生姓名不能为空']"
          :counter="10"
        />
      </v-flex>
      <v-flex xs12 sm6>
        <v-text-field
          label="学生姓名"
          v-model="student.studentName"
          :rules="[v => !!v || '学生姓名不能为空']"
          :counter="10"
        />
      </v-flex>
      <v-flex xs12 sm6>
        <v-text-field
          label="性别"
          v-model="student.sex"
          :rules="[v => !!v || '性别不能为空']"
          required></v-text-field>
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="管理公寓"
          v-model="student.apartmentId"
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

  export default {
    name: "student-form",
    props: {
      oldStudent: {
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
    data() {
      return {
        baseUrl: config.api,
        valid: false,
        student: {
          id: "",
          studentName: "",
          sex: "",
          apartmentId: "",
          studentNo: "",
        }
      }
    },
    watch: {
      oldStudent: { //深度监听，可监听到对象、数组的变化
        handler(newV) {
          if (newV) {
            this.student = Object.deepCopy(newV);
          } else {
            this.student = {
              id: "",
              studentName: "",
              sex: "",
              apartmentId: "",
              studentNo: "",
            };
          }
        },
        immediate: true
      }
    },
    methods: {
      submit() {
        // 表单校验
        if (this.$refs.studentForm.validate()) {
          this.$http({
            method: this.isEdit ? 'put' : 'post', // 动态判断是POST还是PUT
            url: '/user/student',
            data: this.$qs.stringify(this.student)
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
        this.$refs.studentForm.reset();
      },
      closeWindow() {
        this.$emit("close");
      }
    }
  }
</script>

<style scoped>

</style>
