# Vue-City-Selector

### 概述

> 城市选择器，基于`elementUI`二次开发此组件，所有的样式`class`都是使用 `elementUI` 原样式，基本可无副作用的引入项目使用，仅实现了基本需求，不过应该满足使用。有任何问题欢迎发布 `issue` ，我会在看到第一时间回复大家。


### 安装

推荐使用npm安装：

```shell
npm install vue-city-selector
```

###  使用

```js
// main.js
import VCitySelector from "vue-city-selector"

Vue.use(Element)
Vue.use(VCitySelector)
```

### Attributes

| 参数                                                         | 说明       | 类型    | 可选值            | 默认值 |
| ------------------------------------------------------------ | ---------- | ------- | ----------------- | ------ |
| v-model(value)                                               | 绑定值     | Number   | --                | --     |
| placeholder                                                  | 占位文本   | String  | --                | 请选择 |
| size                                                         | 尺寸       | String  | medium/small/mini | --     |
| disabled                                                     | 禁用       | Boolean | True/false        | false  |
| clearable                                                    | 是否可以清空选项 | Boolean | True/false        | true  |

### 事件

| 事件名称 | 说明             | 回调参数                                    |
| -------- | ---------------- | ------------------------------------------- |
| change   | 绑定值发生变化时 | 当前选中值cityId                               |
| blur     | 失去焦点         | --                                          |
| focus    | 获得焦点         | --                                          |

### 使用

```html
<!-- *.vue -->
<template>
	<el-form label-width="80px" ref="form" :model="form" :rules="rules" label-position="left">
    <el-form-item label="城市" prop="cityId">
      <v-city-selector
        v-model="form.cityId"
        placeholder="请选择城市"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">测试提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      rules: {
        cityId: [
          {
            required: true,
            messgae: '请选择城市',
            trigger: 'change'
          }
        ]
      },
      form: {
        cityId: null
      }
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$message({
            message: "测试通过",
            type: "success"
          });
        }
      });
    }
  }
};
</script>
```

### 依赖

```
- Vue
- ElementUI
- vue-click-outside
```