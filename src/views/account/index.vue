<template>
  <div>
      <el-form ref="form" :model="user" label-width="80px">
  <el-form-item label="用户头像">
    <el-upload
  class="avatar-uploader"
  action="https://jsonplaceholder.typicode.com/posts/"
  :show-file-list="false"
  :http-request="onUpload"
  >
  <img width="100" :src="user.photo" class="avatar">
  <!-- <i  class="el-icon-plus avatar-uploader-icon"></i> -->
</el-upload>
  </el-form-item>
   <el-form-item label="用户昵称">
    <el-input v-model="user.name"></el-input>
  </el-form-item>
   <el-form-item label="个人介绍">
    <el-input v-model="user.intro"></el-input>
  </el-form-item>
  <el-form-item label="电话号码">
    <el-input disabled v-model="user.mobile"></el-input>
  </el-form-item>
   <el-form-item label="用户邮箱">
    <el-input v-model="user.email"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">保存修改</el-button>
  </el-form-item>
</el-form>
  </div>
</template>

<script>
import eventBus from '@/utils/event-bus'
export default {
  data () {
    return {
      user: {
        email: '',
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      }
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    onSubmit () {
      this.$axios({
        method: 'PATCH',
        url: '/user/profile',
        data: {
          name: this.user.name,
          email: this.user.email,
          intro: this.user.intro
        }
      }).then(res => {
        // 当用户信息更新成功后，通知头部组件
        eventBus.$emit('update-user', this.user)
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      }).catch(() => {
        // console.log(err)
        this.$message.error('修改失败')
      })
    },
    loadUserProfile () {
      this.$axios({
        method: 'GET',
        url: '/user/profile'
      }).then(res => {
        this.user = res.data.data
      }).catch(() => {
        // console.log(err)
        this.$message.error('获取数据失败')
      })
    },
    onUpload (config) {
      const fd = new FormData()
      fd.append('photo', config.file)
      this.$axios({
        method: 'PATCH',
        url: '/user/photo',
        data: fd
      }).then(res => {
        this.user.photo = res.data.data.photo
        eventBus.$emit('update-user', this.user)
      }).catch(() => {
        // console.log(err)
        this.$message.error('上传失败')
      })
    }
  }
}
</script>

<style lang="less" scope>

</style>
