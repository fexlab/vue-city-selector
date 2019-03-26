<template>
  <div>
    <p class="demo-title">Vue-City-selector 示例</p>
    <div class="demo-wrapper">
      <v-city-selector v-model="cityId" @change="handleCitySelector"/>
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
</style>

