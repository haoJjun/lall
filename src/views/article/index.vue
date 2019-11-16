<template>
 <div class="article">
   <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>全部图文</span>
  </div>
  <el-form label-width="80px">
  <el-form-item label="文章状态">
     <el-radio-group v-model="filterForm.status">
      <el-radio label="全部"></el-radio>
      <el-radio label="草稿"></el-radio>
      <el-radio label="待审核"></el-radio>
      <el-radio label="审核通过"></el-radio>
      <el-radio label="审核失败"></el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="频道列表">
    <el-select  placeholder="请选择活动区域" v-model="filterForm.channel_id">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="时间选择">
   <el-date-picker
     v-model="rangeDate"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
  </el-form-item>
  <el-form-item>
    <el-button type="primary">查询</el-button>
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
    <span>共找到59806条符合条件的内容</span>
     <el-table
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
        label="操作">
        <template>
          <el-button type="danger" size="mini">删除</el-button>
          <el-button type="primary" size="mini">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</el-card>
 </div>
</template>

<script>
export default {
  name: 'Article',
  data () {
    return {
      filterForm: {
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: ''
      },
      rangeDate: '',
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
      ]

    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    loadArticles () {
    // 获取token
      const token = window.localStorage.getItem('user-token')
      // 除了login，其他所有都需要token才能请求,否则后端返回401错误
      this.$axios({
        method: 'GET',
        url: '/articles',
        headers: {// 添加请求头
        // 名字：值
        // 后端要求把token放到请求头中，使用一个名字叫：
        // Authorization:用户token,注意Bearer后面有一个空格
          Authorization: `Bearer ${token}`
        }

      }).then(res => {
        this.articles = res.data.data.results
      }).catch(err => {
        console.log(err, '获取数据失败')
      })
    }
  }
}
</script>

<style>

</style>
