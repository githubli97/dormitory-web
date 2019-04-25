<template>
  <v-form v-model="valid" ref="roomForm">
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <v-select
          :items="apartments.states"
          v-model="room.apartmentId"
          item-text="apartmentName"
          item-value="id"
          label="所属公寓"
          autocomplete
        ></v-select>
      </v-flex>
      <v-flex xs12 sm6>
        <v-text-field
          label="房间号"
          v-model="room.roomNum"
          :rules="[v => !!v || '房间号不能为空']"
          required></v-text-field>
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="入住学生数"
          v-model="room.studentCount"
          :rules="[v => !!v || '入住学生数不能为空']"
          required

        />
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="维修状态"
          v-model="room.repairStatus"
          :rules="[v => !!v || '维修状态不能为空']"
          required
        />
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="所属楼层"
          v-model="room.belongFloor"
          :rules="[v => !!v || '所属楼层不能为空']"
          required
        />
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="房间面积"
          v-model="room.roomArea"
          required
        />
      </v-flex>

      <v-flex xs12 sm6>
        <v-text-field
          label="排序号"
          v-model="room.sortNum"
          :rules="[v => !!v || '排序号不能为空']"
          required
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
    name: "room-form",
    props: {
      oldRoom: {
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
    data() {
      return {
        baseUrl: config.api,
        valid: false,
        room: {
          id: "",
          apartmentId: "",
          roomNum: "",
          studentCount: "",
          repairStatus: "",
          belongFloor: "",
          roomArea: "",
          sortNum: ""
        },
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
      oldRoom:{ //深度监听，可监听到对象、数组的变化
        handler (newV) {
          if (newV) {
            this.room = Object.deepCopy(newV);
          } else {
            this.room = {
              id: "",
              apartmentId: "",
              roomNum: "",
              studentCount: "",
              repairStatus: "",
              belongFloor: "",
              roomArea: "",
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
        if (this.$refs.roomForm.validate()) {
          this.$http({
            method: this.isEdit ? 'put' : 'post', // 动态判断是POST还是PUT
            url: '/asset/room',
            data: this.room
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
        this.$refs.roomForm.reset();
      },
      closeWindow(){
        this.$emit("close");
      }
    }
  }
</script>

<style scoped>

</style>
