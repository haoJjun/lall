<template>
  <div class="upload-image">
     <div class="preview" @click="onUploadShow">
         <!-- <img v-if="previewImage" :src="previewImage" class="avatar"> -->
         <img v-if="value" :src="value" class="avatar">
         <i v-else class="el-icon-plus avatar-uploader-icon"></i>
     </div>
      <el-dialog
        title="请选择文章封面图片"
        :visible.sync="centerDialogVisible"
        width="50%"
        center>
        <!-- 标签导航 -->
        <el-tabs v-model="activeName">
    <el-tab-pane label="素材库" name="first">
        <!-- 标签内容 -->
          <el-radio-group v-model="activeImage" @change="loadImage">
    <el-radio label="all">全部</el-radio>
    <el-radio label="collect">收藏</el-radio>
  </el-radio-group>
  <el-row :gutter="20">
      <el-col :span="6" v-for="(item,index) in images" :key="item.id"
      :class="{
          'img-item': index === activeIndex
      }"
      @click.native="activeIndex=index"
      >
          <img :src="item.url" height="100">
      </el-col>
  </el-row>
    </el-tab-pane>
    <el-tab-pane label="上传图片" name="second">
      <el-upload
  action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
  list-type="picture-card"
  :headers="uploadHeaders"
  name="image"
  :on-preview="onPreview"
  >
  <i class="el-icon-plus"></i>
</el-upload>
    </el-tab-pane>
  </el-tabs>

  <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="onConfirm">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UploadImage',
  components: {},
  props: {
    value: {
      type: String
    }
  },
  data () {
    const token = window.localStorage.getItem('user-token')
    return {
      centerDialogVisible: false, // 对话框的显示状态
      activeName: 'first', // 激活的标签页
      activeImage: 'all', // 激活的图片筛选类型
      images: [],
      activeIndex: null, // 激活的图片索引
      previewImage: '', // 预览的图片地址
      uploadHeaders: {
        Authorization: `Bearer ${token} `
      }
    }
  },

  methods: {
    onUploadShow () {
      this.loadImage()
      this.centerDialogVisible = true
    },
    loadImage () {
      this.$axios({
        method: 'GET',
        url: '/user/images',
        params: {
          // this.activeImage 双向绑定了 radio 选择框组
          // 所以获取 this.activeImage 也就是在获取选中的那个 radio 的状态
          collect: this.activeImage === 'collect' // 是否获取收藏图片
        }
      }).then(res => {
        this.images = res.data.data.results
      }).catch(() => {
        // console.log(err)
      })
    },
    // 当对话框点击确定的时候
    onConfirm () {
      if (this.activeName === 'first') {
        // 当前是素材库标签页
        const image = this.images[this.activeIndex]
        if (image) {
        // 将选中的图片路径赋值给previewImage
        // this.previewImage = image.url

          // 将所选图片路径同步给父组件绑定数据
          this.$emit('input', image.url)
        }
      } else if (this.activeName === 'second') {
        // 当前是上传图片标签页
        const previewImage = this.previewImage
        if (previewImage) {
          this.$emit('input', previewImage)
        }
      }

      // 关闭对话框
      this.centerDialogVisible = false
    },
    onPreview (file) {
      // console.log(file)
      this.previewImage = file.response.data.url
    }
  }
}
</script>

<style scoped>
.upload-image {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.upload-image .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.img-item {
    border: 1px solid #222
}
</style>
