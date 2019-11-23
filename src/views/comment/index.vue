<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-table :data="articles" style="width: 100%">
        <el-table-column prop="title" label="标题" width="180"></el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数"></el-table-column>
        <el-table-column label="评论状态" width="180">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.comment_status"
             active-color="#13ce66"
             inactive-color="#ff4949"
             @change="onStatusChange(scope.row)"
             >
             </el-switch>
          </template>
        </el-table-column>
         <el-table-column
        prop="pubdate"
        label="评论日期"
        width="180">
        <template slot-scope="scope">
          {{scope.row.pubdate | dateFormat}}
        </template>
      </el-table-column>
        <el-table-column
        label="是否推荐"
        width="180">
        <template slot-scope="scope">
          <el-switch
           v-model="scope.row.is_top"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="onTop(scope.row)"
            >
          </el-switch>
        </template>
      </el-table-column>
        <el-table-column  label="操作">
            <template  slot-scope="scope">
          <el-button type="primary" @click="$router.push('/comment/'+scope.row.id)">修改</el-button>
            </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'CommentIndex',
  data () {
    return {
      articles: []
    }
  },
  created () {
    this.loadComment()
  },
  methods: {
    loadComment () {
      this.$axios({
        method: 'GET',
        url: '/articles',
        params: {
          response_type: 'comment'
        }
      })
        .then(res => {
          // console.log(res)
          this.articles = res.data.data.results
        })
        .catch(() => {
          // console.log(err, '获取数据失败')
        })
    },
    onStatusChange (article) {
      this.$axios({
        method: 'PUT',
        url: '/comments/status',
        params: {
          article_id: article.id.toString()
        },
        data: {
          allow_comment: article.comment_status
        }
      }).then(res => {
        console.log(res)
        this.$message({
          type: 'success',
          message: `${article.comment_status ? '启用' : '关闭'}成功`
        })
      }).catch(err => {
        console.log(err)

        this.$message.error('操作失败')
      })
    },
    onTop (comment) {
      this.$axios({
        method: 'PUT',
        url: `/comments/${comment.com_id}/sticky`,
        data: {
          // comment.is_top 双向绑定给了开关按钮
          // 所以获取 comment.is_top 就是在获取开关的状态
          sticky: comment.is_top
        }
      }).then(res => {
        this.$message('操作成功')
      }).catch(err => {
        this.$message.error('操作失败', err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
