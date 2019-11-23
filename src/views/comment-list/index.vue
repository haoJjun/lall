<template>
<div>
  <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>评论详情列表</span>
    <el-table
      :data="comments"
      style="width: 100%">
      <el-table-column
        label="头像"
        width="180">
        <template slot-scope="scope">
          <img :src="scope.row.aut_photo" alt="" width="50px">
        </template>
      </el-table-column>
      <el-table-column
        prop="content"
        label="评论内容"
        width="180">
      </el-table-column>
      <el-table-column
        label="点赞">
        <template slot-scope="scope">
          {{scope.row.is_liking===1?'已赞':'未被赞'}}
        </template>
      </el-table-column>
       <el-table-column
        prop="like_count"
        label="点赞数量"
        width="180">
      </el-table-column>
       <el-table-column
        prop="reply_count"
        label="回复数量"
        width="180">
      </el-table-column>
    </el-table>

  </div>

</el-card>
</div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'CommentDetail',
  props: {
    articleId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      comments: []
    }
  },
  // 实例选项过滤器
  // 全局
  // 局部
  // 他的作用是，常用于简单的文本格式化
  // 过滤器函数可以直接在模板中调用
  // 调用方式：{{数据|过滤器函数}}
  // filters: {
  //   dateFormat (value) {
  //     return moment(value).format('YYYY-MM-DD')
  //   }
  // },
  created () {
    this.loadComments()
  },
  methods: {
    loadComments () {
      this.$axios({
        method: 'GET',
        url: '/comments',
        params: {
          type: 'a',
          source: this.articleId // 文章id或评论id
        }
      }).then(res => {
        // console.log(res)
        const comments = res.data.data.results
        comments.forEach(item => {
          item.pubdate = moment(item.pubdate).format('YYYY-MM-DD HH:mm:ss')
        })
        this.comments = comments
      }).catch(() => {
        // console.log(err, '获取失败')
      })
    }
  }
}
</script>

<style>

</style>
