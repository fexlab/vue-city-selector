<template>
  <div>
    <p class="demo-title">Vue-City-selector 示例</p>
    <div class="demo-wrapper">
      <v-city-selector v-model="cityId" @change="handleCitySelector"/>

      <div class="demo-action">
        <el-button size="small" type="primary" @click="handleSet">设置</el-button>
        <el-button size="small" @click="handleClear">清空</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cityId: 131
    }
  },
  methods: {
    handleCitySelector(id, name) {
      /* eslint-disable */
      this.cityId = id
      console.log(id, name)
    },
    handleSet() {
      this.cityId = 88
    },
    handleClear() {
      this.cityId = null
    }
  }
}
</script>

<style>
.demo-title {
  text-align: center;
}
.demo-wrapper {
  width: 400px;
  height: 500px;
  margin: 50px auto 0;
}
.demo-action {
  margin-top: 15px;
}
</style>

