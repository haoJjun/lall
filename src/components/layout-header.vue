<template>
<!-- 头部组件el-row布局 -->
  <el-row type="flex" justify="space-between" align="middle">
      <!-- 左侧 -->
      <el-col :span="6" class="left">
          <i class="el-icon-s-fold"></i>
          <span>江苏传智播客教育科技股份有限公司</span>
      </el-col>
      <!-- 右侧 -->
      <el-col :span="3" class="right">
          <!-- 头像 -->
          <img :src="user.photo" alt="" width="50">
          <!-- 下拉菜单 -->
          <el-dropdown trigger="click">
              <!-- 用户名 -->
              <span>{{user.name}}</span>
                <el-dropdown-menu slot="dropdown">
               <el-dropdown-item>账户信息</el-dropdown-item>
               <el-dropdown-item>git地址</el-dropdown-item>
               <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
           </el-dropdown-menu>
          </el-dropdown>

      </el-col>
  </el-row>
</template>

<script>
import eventBus from '@/utils/event-bus.js'
export default {
  data () {
    return {
      user: {
        name: '',
        photo: ''
      }
    }
  },
  created () {
    this.loadUser()
    // 在初始化中监听自定义事件
    eventBus.$on('update-user', user => {
      // console.log('abc调用了')
      this.user.name = user.name
      this.user.photo = user.photo
    })
  },
  methods: {
    onLogout () {
      this.$confirm('确认退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.localStorage.removeItem('user-token')
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '退出成功'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    },
    loadUser () {
      this.$axios({
        method: 'GET',
        url: '/user/profile'
      }).then(res => {
        // console.log(res)
        this.user = res.data.data
      }).catch(() => {
        // console.log(err)
        this.$message.error('获取个人信息失败')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.left {
    display: flex;
    align-items: center;
    i {
        font-size:24px ;
    }
    span {
        margin-left: 4px;
    }

}
.right {
    display: flex;
    align-items: center;
    img {
        border-radius: 50%;
        margin-right: 5px;
    }
}
</style>
