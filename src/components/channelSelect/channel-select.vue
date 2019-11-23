<template>
  <div>
        <el-select
         placeholder="请选择频道"
         :value="value"
         @input="onInput"
          >
      <el-option
      :label="channel.name"
      :value="channel.id"
      v-for="channel in channels"
      :key="channel.id"
      >
      </el-option>
        </el-select>
  </div>
</template>

<script>
export default {
  name: 'ChannelSelect',
  props: {
    value: {
      type: [String, Number],
      require: true
    }
  },
  data () {
    return {
      channels: []// 存储频道列表
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    loadChannels () {
      this.$axios({
        method: 'GET',
        url: '/channels'
      }).then(res => {
        // console.log(res.data.data.channels)
        this.channels = res.data.data.channels
      }).catch(() => {
        // console.log(err, '获取数据失败')
      })
    },
    onInput (data) {
    //   console.log(data)
      this.$emit('input', data)
    }
  }
}
</script>

<style>

</style>
