<template>
  <v-flex xs12 md5 offset-md2>
    <div v-for="post in posts" :key="post.title">
      <v-card class="my-3" hover>
        <v-card-media
          class="white--text"
          height="170px"
          :src="post.image"
        >
          <v-container fill-height fluid>
            <v-layout>
              <v-flex xs12 align-end d-flex>
                <span class="headline">{{ post.title }}</span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-media>
        <v-card-text>
          {{ post.content }}
        </v-card-text>
        <v-card-actions>
          <div>来自于：{{post.adviceArea}},{{post.createTime}}</div>
          <v-spacer></v-spacer>
          <!--<v-btn flat class="blue&#45;&#45;text"></v-btn>-->
        </v-card-actions>
      </v-card>
    </div>
  </v-flex>
</template>
<script>

  export default {
    name: "student-announcement",
    props: {
      userId: Object
    },
    data() {
      return {
        title: "宿舍管理系统",
        posts: [],
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
      userId(value) {
        if (value.userId != null && value.userId != "") {

          this.$http.get("/others/announcement/announcementList/" + value.userId)
            .then(resp => { // 获取响应结果对象
              this.posts = Object.deepCopy(resp.data); // 公告数据

              for (var i = 0; i < this.posts.length; i++) {
                for (var j = 0; j < this.apartments.states.length; j++) {
                  if (this.posts[i].adviceArea == this.apartments.states[j].id) {
                    this.posts[i].adviceArea = this.apartments.states[j].apartmentName;
                  }
                }
              }
            });
        }
      },
      immediate: true
    }

  }
</script>
