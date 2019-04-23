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
          <div>来自于{{post.adviceArea}},{{post.createTime}}</div>
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
    data() {
      return {
        title: "宿舍管理系统",
        posts: []
      }
    }, mounted() {
      this.$http.get("/others/announcement/page")
        .then(resp => { // 获取响应结果对象
          console.log(resp.data);
          this.posts = resp.data.items; // 公告数据
        });
    }

  }
</script>
