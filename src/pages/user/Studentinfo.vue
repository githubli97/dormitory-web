<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="text-xs-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="600"
      offset-x
    >
      <div slot="activator">
        <img :src="userInfo.image" width="200" height="200">
        <div class="headline">{{userInfo.studentName}} <span style="font-weight:bold">同学</span></div>
      </div>

      <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-flex xs4>
              <v-list-tile-avatar>
                <v-upload
                  v-model="userInfo.image"
                  url="/upload/image"
                  :multiple="false"
                  :pic-width="50"
                  :pic-height="50"
                />
              </v-list-tile-avatar>
            </v-flex>
            <v-flex xs8>

              <v-list-tile-content>
                <v-list-tile-title>{{ userInfo.studentName }}</v-list-tile-title>
                <v-list-tile-sub-title>个人信息页</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-flex>

          </v-list-tile>
        </v-list>

        <v-divider></v-divider>

        <v-layout row>
          <v-flex xs3>
            <v-subheader>姓名：</v-subheader>
          </v-flex>
          <v-flex xs3>
            <v-text-field
              readonly
              label="姓名"
              v-model="userInfo.studentName"
            ></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-subheader>性别：</v-subheader>
          </v-flex>
          <v-flex xs3>
            <v-text-field
              readonly
              label="性别"
              v-model="userInfo.sex"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs3>
            <v-subheader>公寓名：</v-subheader>
          </v-flex>
          <v-flex xs3>
            <v-text-field
              readonly
              label="公寓名"
              v-model="userInfo.apartmentId"
            ></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-subheader>房间名：</v-subheader>
          </v-flex>
          <v-flex xs3>
            <v-text-field
              readonly
              label="房间名"
              v-model="userInfo.roomId"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs3>
            <v-subheader>学号：</v-subheader>
          </v-flex>
          <v-flex xs3>
            <v-text-field
              readonly
              label="学号"
              v-model="userInfo.studentNo"
            ></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-subheader>学院：</v-subheader>
          </v-flex>
          <v-flex xs3>
            <v-text-field
              readonly
              label="学院"
              v-model="userInfo.college"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs3>
            <v-subheader>专业：</v-subheader>
          </v-flex>
          <v-flex xs3>
            <v-text-field
              readonly
              label="专业"
              v-model="userInfo.major"
            ></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-subheader>班级：</v-subheader>
          </v-flex>
          <v-flex xs3>
            <v-text-field
              readonly
              label="班级"
              v-model="userInfo.grade"
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
              v-model="userInfo.phone"
            ></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-subheader>邮箱：</v-subheader>
          </v-flex>
          <v-flex xs3>
            <v-text-field
              label="邮箱"
              v-model="userInfo.email"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <v-card-actions>
          <v-spacer></v-spacer>

          <!--取消保存-->
          <v-btn flat @click="logout()">注销</v-btn>
          <v-btn color="primary" flat @click="saveStudent()">保存</v-btn>
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
        studentName: "",
        sex: "",
        roomId: "",
        apartmentId: "",
        studentNo: "",

        college: "",
        major: "",
        grade: "",
        phone: "",
        email: "",
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
              this.$http.get("/user/student/" + this.userInfo.id)
                .then(resp => { // 获取响应结果对象
                  this.userInfo = Object.deepCopy(resp.data);
                })
            }
          } else {
            this.userInfo = {
              id: "",
              studentName: "",
              sex: "",
              roomId: "",
              apartmentId: "",
              studentNo: "",

              college: "",
              major: "",
              grade: "",
              phone: "",
              email: "",
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
            this.$router.push("/login");
          });
      },
      saveStudent() {
        this.$http({
          method: 'put',
          url: '/user/student',
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
