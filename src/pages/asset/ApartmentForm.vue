<template>
  <v-form v-model="valid" ref="apartmentForm">
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <v-text-field
          label="公寓名称"
          v-model="apartment.apartmentName"
          :rules="[v => !!v || '公寓名称不能为空']"
          :counter="10"
        />
      </v-flex>
      <v-flex xs12 sm6>
        <v-select
          :items="teachers.states"
          v-model="apartmentManager"
          item-text="teacherName"
          item-value="id"
          label="Select"
          autocomplete
        ></v-select>
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
    <v-layout row>
      <v-flex xs6>
        <div align="center">图片1</div>
        <v-upload
          v-model="apartment.imageA"
          url="/upload/image"
          :multiple="false"
          :pic-width="250"
          :pic-height="90"
        />
      </v-flex>
      <v-flex xs6>
        <div align="center">图片2</div>
        <v-upload
          v-model="apartment.imageB"
          url="/upload/image"
          :multiple="false"
          :pic-width="250"
          :pic-height="90"
        />
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

  export default {
    name: "apartment-form",
    props: {
      oldApartment: {
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
    components: {},
    data() {
      return {
        baseUrl: config.api,
        valid: false,
        apartment: {
          id: "",
          apartmentName: "",
          apartmentManager: "",
          totalFloor: "",
          totalRoom: "",
          apartmentType: "",
          useDate: "",
          studentSex: "",
          imageA: "",
          imageB: "",
          repairCount: "",
          sortNum: ""
        },
        teachers: {
          states: [],

        }
      }
    },
    watch: {
      oldApartment:{ //深度监听，可监听到对象、数组的变化
        handler (newV) {
          if (newV) {
            this.apartment = Object.deepCopy(newV);
          } else {
            this.apartment = {
              id: "",
              apartmentName: "",
              apartmentManager: "",
              totalFloor: "",
              totalRoom: "",
              apartmentType: "",
              useDate: "",
              studentSex: "",
              imageA: "",
              imageB: "",
              repairCount: "",
              sortNum: ""
            };
          }
        },
        immediate:true
      }
    },
  methods: {
    submit() {
      // 表单校验
      if (this.$refs.apartmentForm.validate()) {
        this.$http({
          method: this.isEdit ? 'put' : 'post', // 动态判断是POST还是PUT
          url: '/asset/apartment',
          data: this.apartment
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
    clear(){
      // 重置表单
      this.$refs.apartmentForm.reset();
    },
    closeWindow(){
      this.$emit("close");
    }
  }
  }
</script>

<style scoped>

</style>
