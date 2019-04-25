<template>
  <v-form v-model="valid" ref="studentForm">
    <v-layout row>
      <v-flex xs3>
        <v-subheader>姓名：</v-subheader>
      </v-flex>
      <v-flex xs3>
        <v-text-field
          label="姓名"
          v-model="student.studentName"
        ></v-text-field>
      </v-flex>
      <v-flex xs3>
        <v-subheader>性别：</v-subheader>
      </v-flex>
      <v-flex xs3>
        <el-radio v-model="student.sex" label="1" border> 男</el-radio>
        <el-radio v-model="student.sex" label="2" border> 女</el-radio>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs3>
        <v-subheader>公寓名：</v-subheader>
      </v-flex>
      <v-flex xs3>
        <v-select
          :items="apartments.states"
          v-model="student.apartmentId"
          item-text="apartmentName"
          item-value="id"
          label="所属公寓"
          autocomplete
        ></v-select>
      </v-flex>
      <v-flex xs3>
        <v-subheader>房间名：</v-subheader>
      </v-flex>
      <v-flex xs3>
        <v-text-field
          label="房间名"
          v-model="student.roomId"
        ></v-text-field>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs3>
        <v-subheader>学号：</v-subheader>
      </v-flex>
      <v-flex xs3>
        <v-text-field
          label="学号"
          v-model="student.studentNo"
        ></v-text-field>
      </v-flex>
      <v-flex xs3>
        <v-subheader>学院：</v-subheader>
      </v-flex>
      <v-flex xs3>
        <v-text-field
          label="学院"
          v-model="student.college"
        ></v-text-field>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs3>
        <v-subheader>专业：</v-subheader>
      </v-flex>
      <v-flex xs3>
        <v-text-field
          label="专业"
          v-model="student.major"
        ></v-text-field>
      </v-flex>
      <v-flex xs3>
        <v-subheader>班级：</v-subheader>
      </v-flex>
      <v-flex xs3>
        <v-text-field
          label="班级"
          v-model="student.grade"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs3>
        <v-subheader>电话：</v-subheader>
      </v-flex>
      <v-flex xs3>
        <v-text-field
          label="电话"
          v-model="student.phone"
        ></v-text-field>
      </v-flex>
      <v-flex xs3>
        <v-subheader>邮箱：</v-subheader>
      </v-flex>
      <v-flex xs3>
        <v-text-field
          label="邮箱"
          v-model="student.email"
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
  import {Radio} from 'element-ui'

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
    components: {
      elRadio: Radio
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

          college: "",
          major: "",
          grade: "",
          phone: ""

        },
        apartments: {
          states: []
        }
      }
    },
    watch: {
      oldStudent: { //深度监听，可监听到对象、数组的变化
        handler(newV) {
          if (newV) {
            this.student = Object.deepCopy(newV);
            if (this.student.sex != null) {
              this.student.sex = this.student.sex.toString();
            }
          } else {
            this.student = {
              id: "",
              studentName: "",
              sex: "",
              apartmentId: "",
              studentNo: "",

              college: "",
              major: "",
              grade: "",
              phone: ""

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
