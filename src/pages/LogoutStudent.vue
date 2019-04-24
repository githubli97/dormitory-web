<template>
  <v-app light>
    <v-content>
      <v-container>
        <v-layout row wrap align-center>
          <v-flex xs12 md4>
            <div class="text-xs-center">

              <userinfo></userinfo>
              <div class="subheading text-xs-center grey--text pt-1 pb-3">
                <v-layout justify-space-between>
                  <!--两个按钮-->
                  <v-btn round color="primary" dark @click="stockShow = false; announcementShow = true;">公告</v-btn>
                  <v-btn round color="primary" dark @click="stockShow = true; announcementShow = false;">饮水</v-btn>
                </v-layout>
              </div>
              <!--<div class="text-xs-center">-->
              <!--<v-pagination :length="4" v-model="page" circle></v-pagination>-->
              <!--</div>-->
            </div>
          </v-flex>
          <student-announcement :userId="{userId: userInfo.id}" v-show="announcementShow"></student-announcement>
          <student-stock :userId="userInfo.id" v-show="stockShow"></student-stock>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer class="secondary" app>
      <v-layout row wrap align-center>
        <v-flex xs12>
          <div class="white--text ml-3">
            Made with
            <v-icon class="red--text">favorite</v-icon>
            by <a class="white--text" href="#" target="_blank">Dormitory</a>
            and <a class="white--text" href="#" target="_blank">LiHang.</a>
          </div>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
  import Userinfo from "./user/Studentinfo"
  import StudentAnnouncement from "./others/StudentAnnouncement"
  import StudentStock from "./others/StudentStock"


  export default {
    data() {
      return {
        announcementShow: true,
        stockShow: false,
        userInfo: {
          id: "",
          username: ""
        }
      }
    },
    components: {
      Userinfo,
      StudentAnnouncement,
      StudentStock
    },
    beforeCreate() {
      this.$http.get("/auth/verify")
        .then(resp => { // 获取响应结果对象
          if (resp.data.teacher) {
            this.$router.push("/");
          } else {
            this.userInfo = Object.deepCopy(resp.data);
          }
        }).catch(() => {
        this.$router.push("/login");
      });

    }
  };
</script>
