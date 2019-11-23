<template>
 <div class="publish">
   <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>{{$route.params.articleId?'编辑文章':'发布文章'}}</span>
  </div>
  <el-form ref="form" :model="article" label-width="80px">
  <el-form-item label="标题">
    <el-input v-model="article.title"></el-input>
  </el-form-item>
   <el-form-item label="内容">
  <!-- bidirectional data binding（双向数据绑定） -->
  <quill-editor v-model="article.content"
                ref="myQuillEditor"
                >
  </quill-editor>
  </el-form-item>
  <el-form-item label="频道">
    <!-- <el-select  placeholder="请选择频道" v-model="article.channel_id">
      <el-option
      :label="channel.name"
      :value="channel.id"
      v-for="channel in channels"
      :key="channel.id"
      >
      </el-option>
    </el-select> -->

        <channel-select v-model="article.channel_id"></channel-select>
  </el-form-item>
  <el-form-item label="封面">
    <el-radio-group v-model="article.cover.type">
      <el-radio :label="1">单图</el-radio>
      <el-radio :label="3">三图</el-radio>
      <el-radio :label="0">无图</el-radio>
      <el-radio :label="-1">自动</el-radio>
    </el-radio-group>
    <template v-if="article.cover.type>=0">
      <el-row :gutter="20">
        <el-col :span="4" v-for="(item,index) in article.cover.type" :key="item">
        <UploadImage v-model="article.cover.images[index]"></UploadImage>
        </el-col>
      </el-row>
    </template>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit(false)">发表</el-button>
    <el-button @click="onSubmit(true)">存入草稿</el-button>
  </el-form-item>
</el-form>
</el-card>
 </div>
</template>

<script>
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 核心组件
import { quillEditor } from 'vue-quill-editor'
import channelSelect from '../../components/channelSelect/channel-select'
import UploadImage from './components/upload-image'
export default {
  name: 'PublishArticle',
  components: {
    quillEditor,
    channelSelect,
    UploadImage
  },
  data () {
    return {
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          type: 1,
          images: []
        }, // 文章封面
        channel_id: '' // 频道
      },
      // channels: []
      editorOption: {} // 富文本编辑器的配置选项对象
      // imageCount:1//默认是单图
    }
  },
  created () {
    // this.loadChannels()
    if (this.$route.params.articleId) {
      this.loadArticle()
    }
  },
  methods: {
    loadArticle () {
      this.$axios({
        method: 'GET',
        url: `/articles/${this.$route.params.articleId}`
      }).then(res => {
        // console.log(res)
        this.article = res.data.data
      }).catch(err => {
        console.log(err)
      })
    },
    onSubmit (draft) {
      if (this.$route.params.articleId) {
        // 请求编辑
        this.updateArticle(draft)
      } else {
        // 请求添加
        this.addArticle(draft)
      }
    },
    updateArticle (draft) {
      this.$axios({
        method: 'PUT',
        url: `/articles/${this.$route.params.articleId}`,
        // headers: {
        //   Authorization: `Bearer ${window.localStorage.getItem('user-token')}`

        // },
        params: {
          draft
        },
        data: this.article
        // data: {
        // title: '',
        // content: '',
        // cover: {
        //   type: 0,
        //   images: []
        // }, // 文章封面
        // channel_id: ''
        // }
      }).then(res => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
      }).catch(() => {
        // console.log(err)

        this.$message.error('更新失败')
      })
    },
    addArticle (draft) {
      this.$axios({
        method: 'POST',
        url: '/articles',
        // headers: {
        //   Authorization: `Bearer ${window.localStorage.getItem('user-token')}`

        // },
        params: {
          draft
        },
        data: this.article
        // data: {
        // title: '',
        // content: '',
        // cover: {
        //   type: 0,
        //   images: []
        // }, // 文章封面
        // channel_id: ''
        // }
      }).then(res => {
        // console.log(res, '增加成功')
      }).catch(() => {
        // console.log(err, '增加失败')
      })
    }

    // loadChannels () {
    //   this.$axios({
    //     method: 'GET',
    //     url: '/channels'
    //   }).then(res => {
    //     // console.log(res.data.data.channels)
    //     this.channels = res.data.data.channels
    //   }).catch(err => {
    //     console.log(err, '获取数据失败')
    //   })
    // }
  }
}
</script>

<style>

</style>
