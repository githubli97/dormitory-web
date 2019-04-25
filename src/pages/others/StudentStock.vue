<template>
  <v-flex xs12 md5 offset-md2>
    <div v-for="post in posts" :key="post.title">
      <v-card class="my-3" hover>
        <v-card-media
          class="white--text"
          height="170px"
          :src="post.imgUrl"
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
          <v-container fill-height fluid>
            <v-layout>
              <v-flex xs12 align-end d-flex>
                <span class="headline">库存:{{ post.title }}</span>
              </v-flex>
            </v-layout>
          </v-container>
          <v-spacer></v-spacer>
          <v-btn flat class="blue--text">查看详情2</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-flex>
</template>
<script>

  export default {
    name: "student-stock",
    data() {
      return {

        title: "宿舍管理系统",
        posts: [],
        countDown: ""

      }
    },
    method: {
      resetTime(time) {
        var timer = null;
        var t = time;
        var m = 0;
        var s = 0;
        m = Math.floor(t / 60 % 60);
        m < 10 && (m = '0' + m);
        s = Math.floor(t % 60);

        function countDown() {
          s--;
          s < 10 && (s = '0' + s);
          if (s.length >= 3) {
            s = 59;
            m = "0" + (Number(m) - 1);
          }
          if (m.length >= 3) {
            m = '00';
            s = '00';
            clearInterval(timer);
          }
          this.countDown = m + "分钟" + s + "秒";
        }

        timer = setInterval(countDown, 1000);
      },
    }

  }
</script>
