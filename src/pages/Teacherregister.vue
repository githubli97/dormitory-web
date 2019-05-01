<template>
  <v-form v-model="valid" ref="teacherRegisterForm">
    <v-text-field
      prepend-icon="person"
      v-model="user.username"
      label="用户名"
      :error-messages="errorMsg4"
      v-on:blur="checkUsername"
      type="text"/>
    <v-text-field
      prepend-icon="lock"
      v-model="user.password"
      label="密码"
      id="password"
      :rules="[rules.passwordRequired, rules.passwordLength]"
      :append-icon="e1 ? 'visibility' : 'visibility_off'"
      :append-icon-cb="() => (e1 = !e1)"
      :type="e1 ? 'text' : 'password'"
      :error-messages="errorMsg"
    ></v-text-field>
    <v-text-field
      prepend-icon="lock"
      v-model="user.checkPassword"
      label=" 确认密码"
      id="checkPassword"
      v-on:blur="cpasswordCheck"
      :append-icon="e1 ? 'visibility' : 'visibility_off'"
      :append-icon-cb="() => (e1 = !e1)"
      :type="e1 ? 'text' : 'password'"
      :error-messages="errorMsg"
    ></v-text-field>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="regist">注册</v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
  import config from '@/config';


  export default {
    name: "teacher-register",
    props: {
      oldTeacher: {
        type: Object
      },
      show: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        user: {
          id: "",
          username: "",
          password: "",
          checkPassword: ""
        },


        baseUrl: config.api,
        valid: false,
        e1: false,
        errorMsg: [],
        errorMsg4: [],
        rules: {
          passwordRequired: v => !!v || '密码不能为空',
          passwordLength: v => (v.length >= 4 && v.length <= 16) || '密码要在4~16位',
          phone: v => {
            const phoneReg = /^1[34578]\d{9}$/;
            return phoneReg.test(v) || '手机号格式不正确';
          }
        },
        usernameError: true,
        checkPasswordError: true,

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
            this.user.id = newV.id;
          } else {
            this.user.id = "";
          }
        },
        immediate: true
      }
    },
    methods: {
      regist() {
        // 表单校验
        if (this.$refs.teacherRegisterForm.validate()) {
          this.$http({
            method: 'post', // 动态判断是POST还是PUT
            url: '/user/teacherRegister',
            data: this.$qs.stringify(this.user)
          }).then(() => {
            this.$message.success("保存成功！");
            // 关闭窗口
            this.closeWindow();
          })
            .catch(() => {
              this.$message.error("保存失败！");
            });
        }
      },
      cpasswordCheck() {

        if (this.user.password != this.user.checkPassword) {
          this.errorMsg = ['确认密码与密码不符'];
          this.checkPasswordError = true;
          return true;
        } else {
          this.errorMsg = [];
          this.checkPasswordError = false;
        }
        return true;
      },
      clear() {
        // 重置表单
        this.$refs.teacherRegisterForm.reset();
      },
      closeWindow() {
        this.$emit("close");
      },
      checkUsername() {

        if (this.user.username == null || this.user.username == "") {
          this.errorMsg4 = ['用户名不能为空'];
          this.usernameError = true;
          return true;
        } else if (this.user.username.length < 4 && this.user.username > 16) {
          this.errorMsg4 = ['用户名要在4~16位'];
          this.usernameError = true;
          return true;

        } else {
          this.$http({
            method: 'get', // 动态判断是POST还是PUT
            url: '/user/check/' + this.user.username + '/1'
          }).then(() => {
            this.errorMsg4 = [];
            this.usernameError = false;
          }).catch(() => {
            this.errorMsg4 = ['用户名重复'];
            this.usernameError = true;
            return true;

          });
        }
      }
    }
  }
</script>

<style scoped>

</style>
