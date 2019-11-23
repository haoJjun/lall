<template>
  <div class="login">
    <!-- elementUT card 卡片组件-->
    <el-card class="login-card">
      <!-- 卡片内容 -->
      <div class="title">
        <img src="../../assets/img/logo_index.png" alt />
      </div>
      <!-- 表单 -->
      <!-- model属性 要绑定表单数据对象 -->
      <!-- rules属性 表示校验规则对象 -->
      <!-- ref属性名随便起 -->
      <el-form ref="formObj" style="margin-top:30px" :model="loginForm" :rules="loginRules">
        <!-- 一个表单域就是一个 form-item -->
        <!-- 手机号 -->
        <el-form-item prop='mobile'>
          <el-input v-model="loginForm.mobile" placeholder="请输入您的手机号"></el-input>
        </el-form-item>
        <!-- 验证码和发送验证码 -->
        <el-form-item prop="code">
            <el-input style="width:280px" v-model="loginForm.code" placeholder="请输入验证码"></el-input>
            <el-button plain style="float:right">发送验证码</el-button>
        </el-form-item>
        <!-- 阅读并同意 -->
        <el-form-item prop="checked">
            <!-- 勾选同意框 -->
            <el-checkbox v-model="loginForm.checked">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" style="width:100%" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 要校验的整个表单数据
      loginForm: {
        // 手机号
        mobile: '',
        // 验证码
        code: '',
        // 是否勾选
        checked: false
      },
      // 校验规则对象
      loginRules: {
        //   key(要校验的的字段名):value(数组=》多条或一条或没有)
        mobile: [{ required: true, message: '请输入您的手机号' }, {
          pattern: /^1[3456789]\d{9}$/, message: '请输入合法的手机号'
        }],
        code: [{ required: true, message: '请输入您的验证码' },
          { pattern: /^\d{6}$/, message: '验证码为6位数字' }],
        //   自定义校验validator
        checked: [{ validator: function (rule, value, callback) {
          // rule代表当前的规则，没用
          // value代表当前的值=》表单字段checked的值
          // callback 回调函数
          if (value) {
            // 如果是true代表选中了，通过校验，反之没被选中，通过检验失败
            callback()// 直接执行callback 表示直接通过
          } else {
            // 没被选中，通过检验失败
            // callback也直接执行
            callback(new Error('您必须就接受'))
          }
        } }]
      }
    }
  },
  methods: {
    // 手动校验
    login () {
      // this.$refs.formObj 获取 el-form 的对象实例
      this.$refs.formObj.validate(isOK => {
        if (isOK) {
          // 调用接口登录
          this.$axios({
            url: '/authorizations',
            data: this.loginForm,
            method: 'post'
          }).then(res => {
            // console.log(res.data.data.token)
            // 存储到本地
            window.localStorage.setItem('user-token', res.data.data.token)
            // 跳转到主页
            this.$router.push('/')
          }).catch(() => {
            // 提示失败消息
            this.$message({
              message: '手机号或者验证码错误',
              type: 'warning'
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  background-image: url("../../assets/img/login_bg.jpg");
  background-size: cover;
  height: 100vh;
  display: flex;
  //卡片水平居中
  justify-content: center;
  //卡片垂直居中
  align-items: center;
  .login-card {
    width: 440px;
    height: 360px;
    .title {
      text-align: center;
      img {
        height: 45px;
      }
    }
  }
}
</style>
