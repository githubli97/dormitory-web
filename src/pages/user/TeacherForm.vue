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
        <v-text-field
          label="性别"
          v-model="teacher.sex"
          :rules="[v => !!v || '性别不能为空']"
          required></v-text-field>
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="管理公寓"
          v-model="teacher.apartmentId"
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
        }
      }
    },
    watch: {
      oldTeacher: { //深度监听，可监听到对象、数组的变化
        handler(newV) {
          if (newV) {
            this.teacher = Object.deepCopy(newV);
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
