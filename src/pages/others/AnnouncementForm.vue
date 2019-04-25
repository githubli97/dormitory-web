<template>
  <v-form v-model="valid" ref="announcementForm">
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <v-text-field
          label="公告标题"
          v-model="announcement.title"
          :rules="[v => !!v || '公告标题不能为空']"
          :counter="10"
        />
      </v-flex>
      <v-flex xs12 sm6>
        <v-select
          :items="apartments.states"
          v-model="announcement.adviceArea"
          item-text="apartmentName"
          item-value="id"
          label="所属公寓"
          autocomplete
        ></v-select>
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="排序号"
          v-model="announcement.sortNum"
          required
        />
      </v-flex>
      <v-flex xs12 sm6>

        <v-switch
          :label="`当前状态 : ${announcement.state ? '启用' : '禁用'}`"
          color="success"
          v-model="announcement.state"
        ></v-switch>
      </v-flex>

      <v-flex xs12 sm6>
        <div>创建时间</div>
        <el-date-picker
          v-model="announcement.createTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择创建时间">
        </el-date-picker>
      </v-flex>
      <v-flex xs6>
        <v-upload
          v-model="announcement.image"
          url="/upload/image"
          :multiple="false"
          :pic-width="250"
          :pic-height="90"
        />
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <v-text-field
          v-model="announcement.content"
          name="input-7-1"
          label="公告内容"
          multi-line
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout class="my-4">
      <v-btn @click="submit" color="primary">提交</v-btn>
      <v-btn @click="clear" color="warning">重置</v-btn>
    </v-layout>
  </v-form>
</template>

<script>
  import config from '@/config';
  import {DatePicker} from 'element-ui';


  export default {
    name: "announcement-form",
    props: {
      oldAnnouncement: {
        type: Object
      },
      isEdit: {
        type: Boolean,
        default: false
      },
      show: {
        type: Boolean,
        default: true
      }
    },
    components: {
      elDatePicker: DatePicker
    },
    data() {
      return {
        baseUrl: config.api,
        valid: false,
        announcement: {
          id: "",
          title: "",
          content: "",
          adviceArea: "",
          createTime: "",
          image: "",
          sortNum: "",
          state: ""
        },
        apartments: {
          states: []
        },
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
      oldAnnouncement: { //深度监听，可监听到对象、数组的变化
        handler(newV) {
          if (newV) {
            this.announcement = Object.deepCopy(newV);
          } else {
            this.announcement = {
              id: "",
              title: "",
              content: "",
              adviceArea: "",
              createTime: "",
              image: "",
              sortNum: "",
              state: ""
            };
          }
        },
        immediate: true
      }
    },
    methods: {
      submit() {
        // 表单校验
        if (this.$refs.announcementForm.validate()) {
          this.$http({
            method: this.isEdit ? 'put' : 'post', // 动态判断是POST还是PUT
            url: '/others/announcement',
            data: this.$qs.stringify(this.announcement)
          }).then(() => {
            this.$message.success("保存成功！");
            // 关闭窗口
            this.$emit("close");
          })
            .catch(() => {
              this.$message.error("保存失败！");
            });
        }
      },
      clear() {
        // 重置表单
        this.$refs.announcementForm.reset();
      },
      closeWindow() {
        this.$emit("close");
      }
    }
  }
</script>

<style scoped>

</style>
