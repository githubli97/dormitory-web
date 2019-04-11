<template>
  <v-form v-model="valid" ref="roomForm">
    <v-text-field
      label="公寓名称"
      v-model="room.roomName"
      :rules="[v => !!v || '公寓名称不能为空']"
      :counter="10"
      required
    />
    <v-text-field
      label="公寓管理员"
      v-model="room.roomManager"
      :rules="[v => v.length === 1 || '首字母只能是1位']"
      required
      mask="A"
    />
    <v-text-field
      label="公寓总楼层"
      v-model="room.totalFloor"
      :rules="[v => v.length === 1 || '首字母只能是1位']"
      required
      mask="A"
    />
    <v-text-field
      label="公寓总房间数"
      v-model="room.totalRoom"
      :rules="[v => v.length === 1 || '首字母只能是1位']"
      required
      mask="A"
    />
    <v-text-field
      label="公寓类型"
      v-model="room.roomType"
      :rules="[v => v.length === 1 || '首字母只能是1位']"
      required
      mask="A"
    />
    <v-text-field
      label="开始使用日期"
      v-model="room.useDate"
      :rules="[v => v.length === 1 || '首字母只能是1位']"
      required
      mask="A"
    />
    <v-text-field
      label="学生性别"
      v-model="room.studentSex"
      :rules="[v => v.length === 1 || '首字母只能是1位']"
      required
      mask="A"
    />
    <v-text-field
      label="维修次数"
      v-model="room.repairCount"
      :rules="[v => v.length === 1 || '首字母只能是1位']"
      required
      mask="A"
    />
    <v-text-field
      label="排序号"
      v-model="room.sortNum"
      :rules="[v => v.length === 1 || '首字母只能是1位']"
      required
      mask="A"
    />
    <!--<v-cascader url="/item/category/list" required-->
                <!--v-model="room.categories"-->
                <!--multiple label="商品分类"/>-->
    <!--<v-layout row>-->
      <!--<v-flex xs3>-->
        <!--<span style="font-size: 16px; color: #444">公寓LOGO：</span>-->
      <!--</v-flex>-->
      <!--<v-flex>-->
        <!--<v-upload-->
          <!--v-model="room.image" url="/item/upload" :multiple="false" :pic-width="250" :pic-height="90"-->
        <!--/>-->
      <!--</v-flex>-->
    <!--</v-layout>-->
    <v-layout class="my-4">
      <v-btn @click="submit" color="primary">提交</v-btn>
      <v-btn @click="clear" color="warning">重置</v-btn>
    </v-layout>
  </v-form>
</template>

<script>
  import config from '@/config';

  export default {
    name: "room-form",
    props: {
      oldRoom: Object,
      isEdit: {
        type: Boolean,
        default: false
      },
      show: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        baseUrl: config.api,
        valid: false,
        room: {
          id: '',
          roomName: '',
          roomManager: '',
          totalFloor: '',
          totalRoom: '',
          roomType: '',
          useDate: '',
          studentSex: '',
          imageA: '',
          imageB: '',
          repairCount: '',
          sortNum: ''
        },
        imageDialogVisible: false
      }
    },
    watch: {
      oldRoom: {
        deep: true,
        handler(val) {
          Object.deepCopy(val, this.room);
        }
      }
    },
    methods: {
      submit() {
        // 表单校验
        if (this.$refs.roomForm.validate()) {
          this.room.categories = this.room.categories.map(c => c.id);
          this.room.letter = this.room.letter.toUpperCase();
          // 将数据提交到后台
          this.$http({
            method: this.isEdit ? 'put' : 'post',
            url: '/item/room',
            data: this.$qs.stringify(this.room)
          }).then(() => {
            // 关闭窗口
            this.$message.success("保存成功！");
            this.closeWindow();
          }).catch(() => {
            this.$message.error("保存失败！");
          });
        }
      },
      clear() {
        // 重置表单
        this.$refs.roomForm.reset();
        this.categories = [];
      },
      // 图片上传出成功后操作
      handleImageSuccess(res) {
        this.room.image = res;
      },
      removeImage() {
        this.room.image = "";
      },
      closeWindow() {
        this.$emit("close");
      }
    }
  }
</script>

<style scoped>

</style>
