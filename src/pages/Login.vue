<template>
  <v-app>
    <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>学生宿舍管理</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-form ref="loginForm">
                    <v-text-field
                      prepend-icon="person"
                      v-model="username"
                      label="用户名"
                      :error-messages="errorMsg4"
                      v-on:blur="checkUsername"
                      type="text"/>
                    <v-text-field
                      prepend-icon="lock"
                      v-model="password"
                      label="密码"
                      id="password"
                      :rules="[rules.passwordRequired]"
                      :append-icon="e1 ? 'visibility' : 'visibility_off'"
                      :append-icon-cb="() => (e1 = !e1)"
                      :type="e1 ? 'text' : 'password'"
                    ></v-text-field>
                    <v-layout row>
                      <v-flex xs8>
                        <v-text-field
                          prepend-icon="el-icon-edit"
                          label="验证码"
                          v-model="writeCode"
                          v-on:blur="checkWriteCode"
                          :error-messages="errorMsg2"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs4>
                        <div class="code" @click="refreshCode">
                          <sidentify :identifyCode="identifyCode"></sidentify>
                        </div>
                      </v-flex>
                    </v-layout>

                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="regist">学生注册</v-btn>
                  <v-btn color="primary" @click="doLogin">登录</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
    </v-content>
    <v-dialog v-model="dialog" width="300px">
      <v-alert icon="warning" color="error" :value="true">
        {{errorMsg}}
      </v-alert>
    </v-dialog>
  </v-app>
</template>

<script>
  import sidentify from '../components/identify'

export default {
  data: () => ({
    username: "",
    password: "",

    dialog: false,
    e1: false,
    identifyCodes: "1234578qwqertyuipasfghjjklzxcvnmQWERTYUIPASDFGHJKLZXCVBNM",
    identifyCode: "",
    writeCode: "",
    errorMsg2: [],
    errorMsg4: [],
    usernameError: true,
    writeCodeError: true,
    errorMsg: "",
    rules: {
      passwordRequired: v => !!v || '密码不能为空'
    }
  }),
  components: {
    sidentify
  },
  created() {
    this.refreshCode();
  },
  methods: {
    doLogin() {
      this.refreshCode();
      if (this.$refs.loginForm.validate() && !this.usernameError && !this.writeCodeError) {
        this.$http({
          method: 'post',
          url: '/auth/accredit',
          data: this.$qs.stringify({
            username: this.username,
            password: this.password
          })
        }).then(() => {
          this.$router.push("/index/dashboard");
        })
      }
      this.checkWriteCode();
    },
    regist() {
      this.$router.push("/register");
    },
    checkUsername() {
      if (this.username == null) {
        this.errorMsg4 = ['用户名不能为空'];
        this.usernameError = true;
      } else {
        this.errorMsg4 = [];
        this.usernameError = false;
      }
    },
    checkWriteCode() {
      if (this.writeCode == null || this.writeCode == "") {
        this.errorMsg2 = ['验证码不能为空'];
        this.writeCodeError = true;
      } else if (this.identifyCode.toUpperCase() != this.writeCode.toUpperCase()) {
        this.errorMsg2 = ['验证码错误'];
        this.writeCodeError = true;
      } else {
        this.errorMsg2 = [];
        this.writeCodeError = false;
      }
      return true;
    },
    //随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    //说明随机数格式
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    //生成随机数
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
          ]
      }
    }
  }
};
</script>
