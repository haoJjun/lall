<template>
 <div class="article">
   <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>全部图文</span>
  </div>
  <el-form label-width="80px">
  <el-form-item label="文章状态">
    <!-- 单选框组会把选中的radio的lable同步给绑定的数据 -->
     <el-radio-group v-model="filterForm.status">
      <el-radio :label="null">全部</el-radio>
      <el-radio label="0">草稿</el-radio>
      <el-radio label="1">待审核</el-radio>
      <el-radio label="2">审核通过</el-radio>
      <el-radio label="3">审核失败</el-radio>
      <el-radio label="4">已删除</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="频道列表">
    <el-select  placeholder="请选择频道" v-model="filterForm.channel_id">
      <el-option label="所有频道" :value="null"></el-option>
      <el-option
      :label="channel.name"
      :value="channel.id"
      v-for="channel in channels"
      :key="channel.id"
      >
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="时间选择">
   <el-date-picker
     v-model="rangeDate"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd">
    </el-date-picker>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="loadArticles(1)">查询</el-button>
  </el-form-item>
  </el-form>
</el-card>
<el-card class="box-card" style="margin-top:10px">
  <div slot="header" class="clearfix">
    <!--
        el-table 表格组件
        data 表格的数组，要求是数组
        表格组件会使用 data 数据，在内部自己进行遍历，我们不需要自己写什么 v-for
        你只需要告诉这个表格组件：
          data 是啥
          表头名是什么
          列值是什么
        el-table-column 表格列组件
          prop 用来指定渲染哪个数据字段
          label 表头名称
          width 列宽

        表格列默认只能渲染普通文本，如果想要渲染点儿别的东西，需要自定义表格列。
       -->
    <span>共找到{{totalCount}}条符合条件的内容</span>
     <el-table
      v-loading="loading"
      :data="articles"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="封面"
        width="180">
        <!-- 自定义表格列
        在template 上声明 slot-scope="scope",然后就可以通过 scope.row获取遍历项 -->
        <template slot-scope="scope">
          <img :src="scope.row.cover.images[0]" width="50px">
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="180">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
        <template slot-scope="scope">
          <!-- 0草稿 1待审核 2审核通过 3审核失败 4已删除 -->
        <!-- <span>{{articleStatus[scope.row.status].label}}</span> -->
        <el-tag :type="articleStatus[scope.row.status].type">{{articleStatus[scope.row.status].label}}</el-tag>

        </template>
      </el-table-column>
      <el-table-column
        prop="pubdate"
        label="发布日期">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
        >
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="onDelete(scope.row.id)">删除</el-button>
          <el-button type="primary" size="mini">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</el-card>
<!-- 分页 -->
<el-pagination
  background
  layout="prev, pager, next"
  :total="totalCount"
  @current-change="onPageChange"
  :disabled="loading"
  >
</el-pagination>
<!-- 分页 -->
 </div>
</template>

<script>
export default {
  name: 'Article',
  data () {
    return {
      filterForm: {
        status: null,
        channel_id: null
        // begin_pubdate: '',
        // end_pubdate: ''
      },
      rangeDate: [], // 日期范围
      // 文章数据列表
      articles: [],
      articleStatus: [
        {
          value: '',
          label: '草稿'
        },
        {
          value: 'info',
          label: '待审核'
        },
        {
          value: 'success',
          label: '审核通过'
        },
        {
          value: 'danger',
          label: '审核失败'
        },
        {
          value: 'warning',
          label: '已删除'
        }
      ],
      totalCount: 0, // 总记录数
      loading: true,
      channels: [], // 频道列表
      page: 1// 当前页码

    }
  },
  created () {
    // 初始化时应该默认加载第一页数据
    this.loadArticles(1)
    // 加载频道列表
    this.loadChannels()
  },
  methods: {
    // page如果传递就是用传递的,如果没传，默认就是1
    loadArticles (page = 1) {
      // 加载loading
      this.loading = true
      // 获取token
      // const token = window.localStorage.getItem('user-token')
      // 除了login，其他所有都需要token才能请求,否则后端返回401错误
      this.$axios({
        method: 'GET',
        url: '/articles',
        // headers: {// 添加请求头
        // // 名字：值
        // // 后端要求把token放到请求头中，使用一个名字叫：
        // // Authorization:用户token,注意Bearer后面有一个空格
        //   Authorization: `Bearer ${token}`
        // },
        // Query 参数使用 params传递
        params: {
          page, // 页码
          per_page: 10, // 每页有多少,默认是10
          // status: null
          status: this.filterForm.status, // 文章状态
          channel_id: this.filterForm.channel_id, // 频道
          begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
          end_pubdate: this.rangeDate ? this.rangeDate[1] : null

        }

      }).then(res => {
        this.articles = res.data.data.results
        // 更新总记录数
        this.totalCount = res.data.data.total_count
      }).catch(err => {
        console.log(err, '获取数据失败')
      }).finally(() => {
        // 无论成功还是失败，最终都要执行
        this.loading = false
      })
    },
    // ------------------
    onPageChange (page) {
      // 记录当前页码
      this.page = page
      console.log(page)
      // 请求加载指定页码的文章列表
      this.loadArticles(page)
    },
    loadChannels () {
      this.$axios({
        method: 'GET',
        url: '/channels'
      }).then(res => {
        // console.log(res.data.data.channels)
        this.channels = res.data.data.channels
      }).catch(err => {
        console.log(err, '获取数据失败')
      })
    },
    onDelete (articleId) {
      // console.log(articleId)
      this.$axios({
        method: 'DELETE',
        url: `/articles/${articleId}`
        // headers: {
        //   Authorization: `Bearer ${window.localStorage.getItem('user-token')}`
        // }
      }).then(res => {
        console.log(res)
        this.loadArticles(this.page)
      }).catch(err => {
        console.log(err, '删除失败')
      })
    }

  }
}
</script>

<style>

</style>
