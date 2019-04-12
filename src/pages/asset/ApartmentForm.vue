<template>
  <v-form v-model="valid" ref="apartmentForm">
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <v-text-field
          label="公寓名称"
          v-model="apartment.apartmentName"
          :rules="[v => !!v || '公寓名称不能为空']"
          :counter="10"
          required
        />
      </v-flex>
      <v-flex xs12 sm6>
        <v-text-field
          label="公寓管理员"
          v-model="apartment.apartmentManager"
          :rules="[v => !!v || '公寓管理员不能为空']"
          required

        />
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="公寓总楼层"
          v-model="apartment.totalFloor"
          :rules="[v => !!v || '公寓总楼层不能为空']"
          required

        />
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="公寓总房间数"
          v-model="apartment.totalRoom"
          :rules="[v => !!v || '公寓总房间数不能为空']"
          required
        />
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="公寓类型"
          v-model="apartment.apartmentType"
          :rules="[v => !!v || '公寓类型不能为空']"
          required
        />
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="开始使用日期"
          v-model="apartment.useDate"
          required
        />
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="学生性别"
          v-model="apartment.studentSex"
          :rules="[v => !!v || '学生性别不能为空']"
          required
        />
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="维修次数"
          v-model="apartment.repairCount"
          :rules="[v => !!v || '维修次数不能为空']"
          required
        />
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="排序号"
          v-model="apartment.sortNum"
          :rules="[v => !!v || '排序号不能为空']"
          required
        />
      </v-flex>
    </v-layout>

    <!--<v-cascader url="/item/category/list" required-->
    <!--v-model="apartment.categories"-->
    <!--multiple label="商品分类"/>-->
    <!--<v-layout row>-->
    <!--<v-flex xs3>-->
    <!--<span style="font-size: 16px; color: #444">公寓LOGO：</span>-->
    <!--</v-flex>-->
    <!--<v-flex>-->
    <!--<v-upload-->
    <!--v-model="apartment.image" url="/item/upload" :multiple="false" :pic-width="250" :pic-height="90"-->
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
    name: "apartment-form",
    props: {
      oldApartment: Object,
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
        apartment: {
          id: '',
          apartmentName: '',
          apartmentManager: '',
          totalFloor: '',
          totalRoom: '',
          apartmentType: '',
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
      oldApartment: {
        deep: true,
        handler(val) {
          Object.deepCopy(val, this.apartment);
        }
      }
    },
    methods: {
      submit() {
        // 表单校验
        if (this.$refs.apartmentForm.validate()) {

          const {...params} = this.apartment;
          this.$http.post('/asset/apartment', {
            apartment : params
          }).then(() => {
              // 6、弹出提示
              this.$message.success("保存成功！");
            })
            .catch(() => {
              this.$message.error("保存失败！");
            });
        }
      },
      clear() {
        // 重置表单
        this.$refs.apartmentForm.reset();
        this.categories = [];
      },
      // 图片上传出成功后操作
      handleImageSuccess(res) {
        this.apartment.image = res;
      },
      removeImage() {
        this.apartment.image = "";
      },
      closeWindow() {
        this.$emit("close");
      }
    }
  }
</script>

<style scoped>

</style>
