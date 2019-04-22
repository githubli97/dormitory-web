<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="text-xs-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
    >
      <template slot="activator">
        <v-toolbar flat class="transparent">
          <v-list class="pa-0">
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <img src="http://localhost:9002/1.jpg">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ username }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-toolbar>
      </template>

      <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ userInfo.teacherName }}</v-list-tile-title>
              <v-list-tile-sub-title>个人信息页</v-list-tile-sub-title>
            </v-list-tile-content>

          </v-list-tile>
        </v-list>

        <v-divider></v-divider>

        <v-layout row>
          <v-flex xs6>
            <v-subheader>姓名：</v-subheader>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="姓名"
              v-model="userInfo.teacherName"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs6>
            <v-subheader>性别：</v-subheader>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="性别"
              v-model="userInfo.sex"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs6>
            <v-subheader>管理公寓号：</v-subheader>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="管理公寓号"
              v-model="userInfo.apartmentId"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs6>
            <v-subheader>教师工号：</v-subheader>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="教师工号"
              v-model="userInfo.teacherNo"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <v-card-actions>
          <v-spacer></v-spacer>

          <!--取消保存-->
          <v-btn flat @click="logout()">注销</v-btn>
          <v-btn color="primary" flat @click="saveTeacher()">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
  export default {
    name: "userinfo",
    props: {
      userinfo: Object
    },
    data: () => ({
      fav: true,
      menu: false,
      message: false,
      hints: true,
      username: "",
      userInfo: {
        id: "",
        teacherName: "",
        sex: "",
        apartmentId: "",
        teacherNo: "",
        image: ""
      }
    }),
    watch: {
      userinfo: { //深度监听，可监听到对象、数组的变化
        handler(newV) {
          if (newV) {
            this.username = newV.username;
            this.userInfo.id = newV.id;
            if (this.userInfo.id != "" && this.userInfo.id != null) {
              // 通过axios获取数据
              this.$http.get("/user/teacher/" + this.userInfo.id)
                .then(resp => { // 获取响应结果对象
                  this.userInfo = Object.deepCopy(resp.data);
                })
            }
          } else {
            this.userInfo = {
              id: "",
              teacherName: "",
              sex: "",
              apartmentId: "",
              teacherNo: "",
              image: ""
            };
          }
        },
        immediate: true
      }
    },
    methods: {
      logout() {
        this.menu = false;
        this.$http.get("/auth/logout")
          .then(resp => {
            // this.$router.push("/login");
            this.$router.go(0);
          });
      },
      saveTeacher() {
        this.$http({
          method: 'put',
          url: '/user/teacher',
          data: this.$qs.stringify(this.userInfo)
        }).then(() => {
          this.$message.success("保存成功！");
          this.menu = false;
        })
          .catch(() => {
            this.$message.error("保存失败！");
          });
      }
    }
  }
</script>
