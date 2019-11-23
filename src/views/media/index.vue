<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>素材管理</span>
        <el-upload
          style="float: right; padding: 3px 0"
          class="upload-demo"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
          :headers="uploadHeaders"
          name="image"
          :on-success="onUploadSuccess"
          show-file-list="false"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>
      <div>
        <el-radio-group v-model="type" @change="onFind">
          <el-radio-button label="全部">全部</el-radio-button>
          <el-radio-button label="收藏">收藏</el-radio-button>
        </el-radio-group>
      </div>
      <el-row :gutter="20">
        <el-col
          :md="4"
          :xs="24"
          :sm="12"
          v-for="item in images"
          :key="item.id"
          class="col-item"
          style="margin-bottom=20"
        >
          <el-card :body-style="{ padding: '0px' }">
            <img :src="item.url" class="image" height="200" />
            <div style="padding: 14px;" class="action">
              <i
                @click="onCollect(item)"
                :class="item.is_collected?'el-icon-star-on':'el-icon-star-off'"
              ></i>
              <i class="el-icon-delete-solid" @click="onDelete(item)"></i>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
const token = window.localStorage.getItem('user-token')
export default {
  name: 'MediaIndex',
  data () {
    return {
      images: [],
      type: '全部',
      // 给上传组件使用的请求头
      uploadHeaders: {
        Authorization: `Bearer ${token}`
      }
    }
  },
  created () {
    this.loadImages()
  },
  methods: {
    loadImages (isCollect = false) {
      this.$axios({
        method: 'GET',
        url: '/user/images',
        params: {
          collect: isCollect // 是否获取收藏图片
        }
      })
        .then(res => {
          this.images = res.data.data.results
        })
        .catch(() => {
          // console.log(err)
        })
    },
    onFind (value) {
      // value是形参
      // console.log(value)
      this.loadImages(value !== '全部')
    },
    // 收藏和取消收藏
    onCollect (item) {
      console.log(item)
      // 请求收藏或者取消收藏
      this.$axios({
        method: 'PUT',
        url: `/user/images/${item.id}`,
        data: {
          collect: !item.is_collected
        }
      })
        .then(res => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          item.is_collected = !item.is_collected
        })
        .catch(() => {
          // console.log(err)
          this.$message.error('操作失败')
        })
    },
    // 删除图片
    onDelete (item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 确定执行
          this.$axios({
            method: 'DELETE',
            url: `/user/images/${item.id}`
          })
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功'
              })

              // 更新列表
              this.loadImages(this.type !== '全部')
            })
            .catch(() => {
              // console.log(err)
              this.$message.error('删除失败')
            })
        })
        .catch(() => {
          // 取消执行
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    onUploadSuccess () {
      this.loadImages(this.type !== '全部')
    }
  }
}
</script>

<style lang="less" scoped>
.col-item {
  margin-bottom: 20px;
  .action {
    display: flex;
    justify-content: space-around;
    font-size: 24px;
  }
}
</style>
