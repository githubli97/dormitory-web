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
                <span class="headline" color="black">发布位置：{{ post.apartmentId }}</span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-media>
        <v-card-text>
          {{ post.content }}
        </v-card-text>
        <v-card-actions>
          <v-container fill-height fluid>
            <v-layout>
              <v-flex xs12 align-end d-flex>
                <span class="headline">库存:{{ post.stock }}</span>
              </v-flex>
            </v-layout>
          </v-container>
          <v-spacer></v-spacer>
          <v-btn flat class="blue--text" v-show="post.readonly">{{post.content}}</v-btn>
          <v-btn flat class="blue--text" v-show="!post.readonly" @click="">{{post.content}}</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-flex>
</template>
<script>

  export default {
    name: "student-stock",
    props: {
      userId: Object
    },
    data() {
      return {
        title: "宿舍管理系统",
        posts: [],
        countDown: ""
      }
    },
    watch: {
      userId(value) {
        if (value.userId != null && value.userId != "") {

          this.$http.get("/others/stock/stockList/" + value.userId)
            .then(resp => { // 获取响应结果对象
              this.posts = Object.deepCopy(resp.data); // 公告数据

              const date = new Date();
              var s1 = date.getTime();
              for (var i = 0; i < this.posts.length; i++) {
                var date1 = new Date(this.posts[i].sendDate);
                var s2 = date1.getTime();

                if (s1 < s2) {
                  var total = (s2 - s1) / 1000;
                  var min = parseInt((total % (24 * 60 * 60)) / 60);//计算整数分
                  var afterMin = parseInt(total % 60);//取得算出分后剩余的秒数

                  this.posts[i].content = min + "分" + afterMin + "秒";
                  this.posts[i].readonly = false;
                  console.log(this.posts[i].content);

                } else {
                  this.posts[i].content = "开始预订";
                  this.posts[i].readonly = true;
                }
              }
            });
        }
      },
      immediate: true
    },
    method: {
      buttonTime() {
        const date = new Date();
        for (var i = 0; i < this.posts.length; i++) {
          let date1 = new Date(this.posts[i].sendDate);
          var s1 = date.getTime();
          var s2 = date1.getTime();

          if (s1 < s2) {
            var total = (s2 - s1) / 1000;
            var min = parseInt((total % (24 * 60 * 60)) / 60);//计算整数分
            var afterMin = parseInt(total % 60);//取得算出分后剩余的秒数

            this.posts[i].content = min + "分" + afterMin + "秒";
            console.log(this.posts[i].content);

          } else {
            this.posts[i].content = "开始预订";
          }
        }
      }
    }

  }
</script>
