<template>
  <div class="v-city-selector">
    <el-popover
      v-model="showPopover"
      placement="bottom"
      trigger="manual"
      popper-class="v-city-selector-popper">
      <div slot="reference">
        <el-select
          v-model="selectedValue"
          :placeholder="placeholder"
          :clearable="!multiple && clearable"
          :multiple="multiple"
          style="width: 100%;"
          popper-class="v-city-selector-popper-hide"
          :disabled="disabled"
          :size="size"
          @remove-tag="handleRemoveTag"
          @focus="handleFocus"
          @clear="handleClear">
          <template v-for="(item, index) in selectedOptions">
            <el-option
              :key="index"
              :label="item.name"
              :value="item.id"/>
          </template>
        </el-select>
      </div>
      <div
        v-click-outside="hidePopover">
        <div class="v-city-selector-wrapper">
          <ul class="v-city-selector-tags">
            <li
              v-for="(item, index) in tagsArr"
              :key="index"
              :class="{'z-on': item == tagKey}"
              @click="tagKey = item">
              {{ item }}
            </li>
          </ul>
          <div class="v-city-selector-list">
            <div
              v-for="(citys, initial) in cityList"
              v-show="currTag.includes(initial)"
              :key="initial">
              <h6 v-if="initial != 'hot'">
                {{ initial }}
              </h6>
              <ul>
                <li
                  v-for="v in citys"
                  :key="v.id"
                  :title="v.name"
                  @click="checkedChange(v)">
                  {{ v.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import CitySelectorData from './city-selector-data.json'

export default {
  name: 'VCitySelector',

  directives: { ClickOutside },

  props: {
    value: {
      required: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    multipleLimit: {
      type: Number,
      default: 0
    },
    size: {
      type: String,
      default: ''
    }
  },

  data() {
    const tagsArr = ['热门', 'ABCDE', 'FGHJ', 'KLMN', 'PQRST', 'WXYZ']
    const tags = []
    tagsArr.forEach(item => {
      if (item === '热门') {
        tags[item] = ['hot']
      } else {
        tags[item] = item.split('')
      }
    })
    return {
      showPopover: false,
      selectedOptions: [],
      selectedValue: '',
      selectedName: '',
      cityList: CitySelectorData,
      tagsArr,
      tags,
      tagKey: '热门',
      hasInitModel: false
    }
  },

  created() {
    this.initDatas()
  },

  watch: {
    value() {
      this.initDatas()
    }
  },

  computed: {
    currTag() {
      const { tagKey, tags } = this
      return tags[tagKey]
    }
  },

  methods: {
    // 初始化
    initDatas() {
      this.recursiveOpt(this.cityList);
    },
    recursiveOpt(cityList) {
      if (this.multiple) {
        if (!Array.isArray(this.value)) throw new Error('"value" must an array')
        this.value.forEach(item => {
          let _city = ''
          Object.keys(cityList).forEach(key => {
            if (_city) return
            _city = cityList[key].find(city => city.id === item)
          })
          this.selectedOptions.push(_city)
        })
      } else {
        if (!Number.isInteger(this.value)) throw new Error('"value" must an integer')
        let _city = ''
        Object.keys(cityList).forEach(key => {
          if (_city) return
          _city = cityList[key].find(city => city.id === this.value)
        })
        this.selectedOptions.push(_city)
      }
      this.syncData()
    },
    // 同步数据到上层
    syncData() {
      if (this.multiple) {
        this.selectedValue = this.selectedOptions.map(item => item.id)
        this.$emit('change', this.selectedOptions);
      } else {
        this.selectedValue = ''
        let selectedName = ''
        if (this.selectedOptions.length > 0) {
          this.selectedValue = this.selectedOptions[0].id
          selectedName = this.selectedOptions[0].name
        }
        this.$emit('change', this.selectedValue, selectedName)
      }
    },
    // 选中变化
    checkedChange({ id, name }) {
      if (this.multiple) {
        let isExist = this.selectedOptions.findIndex(option => option.id === id)
        if ((this.multipleLimit <= 0 || this.multipleLimit > this.selectedOptions.length) && 0 > isExist) {
          this.selectedOptions.push({ id, name })
        }
      } else {
        this.selectedOptions = [{ id, name }]
      }

      this.hidePopover()
      this.syncData()
    },
    // 多选移除标签
    handleRemoveTag(id) {
      let idx = this.selectedOptions.findIndex(option => option.id === id)
      if (idx > -1) {
        this.selectedOptions.splice(idx, 1)
      }
      this.syncData()
    },
    handleFocus(evt) {
      if (this.disabled) return;
      this.showPopover = true;
      this.$emit('focus', evt);
    },
    handleClear() {
      this.selectedOptions = []
      this.syncData()
    },
    hidePopover(evt) {
      this.showPopover = false;
      this.$emit('blur', evt);
    }
  }
}
</script>

<style>
.v-city-selector {
  width: 386px;
}
.v-city-selector-popper-hide {
  display: none;
}

.v-city-selector-wrapper {
  width: 360px;
  font-size: 12px;
  line-height: 1.5;
}

.v-city-selector-wrapper ul {
  padding: 0;
  margin: 0;
}

.v-city-selector-wrapper h5 {
  margin-bottom: 5px;
  padding-left: 2px;
  font-weight: normal;
  line-height: 1.5;
  color: #aaa;
}

.v-city-selector-tags {
  overflow: hidden;
  margin: 5px 0;
  padding: 0;
}

.v-city-selector-tags li {
  display: block;
  float: left;
  box-sizing: border-box;
  border-left: 1px solid #fff;
  width: 60px;
  line-height: 20px;
  text-align: center;
  background-color: #f2f2f3;
  cursor: pointer;
}

.v-city-selector-tags li:first-child {
  border-left: none;
}

.v-city-selector-tags li:hover {
  color: #04A6E9;
}

.v-city-selector-tags li.z-on {
  color: #fff;
  background-color: #04A6E9;
}

.v-city-selector-list {
  overflow: hidden;
}

.v-city-selector-list > div {
  overflow: hidden;
  margin: 1px 0 -1px;
  border-bottom: 1px dashed #e5e5e5;
  padding: 5px 0;
  line-height: 24px;
}

.v-city-selector-list > div h6 {
  float: left;
  padding-left: 5px;
  margin: 0;
  width: 30px;
  font-size: 13px;
  font-weight: normal;
  color: #ff4949;
}

.v-city-selector-list > div ul {
  overflow: hidden;
}

.v-city-selector-list > div ul li {
  float: left;
  overflow: hidden;
  padding-left: 4px;
  width: 60px;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}

.v-city-selector-list > div ul li:hover {
  color: #04A6E9;
  background-color: #f2f2f3;
}
</style>
