<template>
  <v-layout row justify-center>
    <v-dialog v-model="loginDialogOn" persistent max-width="500px" dark>
      <v-card>
        <v-img
          class="white--text"
          src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554202492584&di=20e911de67d7aa3f38a212ca7794bad9&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F2018-01-16%2F5a5db7a92e5ec.png"
          aspect-ratio="2"
        >
          <v-card-title>
            <span class="headline">登录</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-flex>
                  <v-text-field
                    v-model="phone"
                    :counter="11"
                    :rules="phoneRules"
                    label="手机号"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field
                    v-model="password"
                    type="password"
                    :rules="passwordRules"
                    label="密码"
                    required
                  ></v-text-field>
                </v-flex>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="submit">登录</v-btn>
            <v-btn flat @click="cancel">取消</v-btn>
          </v-card-actions>
        </v-img>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      phone: "",
      valid: true,
      phoneExist: false,
      userExist: false,
      phoneRules: [
        v => !!v || "手机号不能为空",
        v => /^1\d{10}$/.test(v) || "请输入正确的手机号"
      ],
      password: "",
      passwordRules: [
        v => !!v || "密码不能为空",
        v => /^.{6,16}$/.test(v) || "密码格式不正确"
      ]
    };
  },
  computed: {
    ...mapState(["loginDialogOn"])
  },
  watch: {
    phone(val) {
      if (/^1\d{10}$/.test(val)) {
        axios({
          method: "get",
          url: "/users",
          params: {
            phone: val
          }
        }).then(res => {
          this.phoneExist = !!res.data.status;
          this.updatePhone();
        });
      }
    },
    password(val) {
      if (/^.{6,16}$/.test(val)) {
        axios({
          method: "post",
          url: "/users/login",
          data: {
            phone: this.phone,
            pwd: val
          }
        }).then(res => {
          this.userExist = !!res.data.status;
          this.updatePassword();
        });
      }
    }
  },
  created() {
    this.phoneRules.push(v => !this.phoneExist || "该手机号不存在");
    this.passwordRules.push(v => this.userExist || "密码错误");
  },
  methods: {
    ...mapMutations(["setLoginDialogOn"]),
    ...mapActions(["setCurUser", "setShowBlogs"]),
    updatePhone() {
      this.$refs.form.inputs[0].validate();
    },
    updatePassword() {
      this.$refs.form.inputs[1].validate();
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.setLoginDialogOn();
        this.$router.push("/");
        this.$refs.form.reset();
        this.setCurUser();
        this.setShowBlogs();
      }
    },
    cancel() {
      this.$refs.form.reset();
      this.setLoginDialogOn();
    }
  }
};
</script>