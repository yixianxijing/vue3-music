import { defineStore } from 'pinia'
import {ref} from 'vue'

export const useArtistStore = defineStore('artist', () => {

  // 筛选条件
  const type = ref(-1)    // 类型: -1全部, 1男歌手, 2女歌手, 3乐队
  const area = ref(-1)    // 地区: -1全部, 7华语, 96欧美, 8日本, 16韩国, 0其他
  const initial = ref(-1) // 首字母: -1热门, A-Z

  const setType = (newtype) => {
    type.value = newtype
  }

  const setArea = (newarea) => {
    area.value = newarea
  }

  const setInitial = (newinitial) => {
    initial.value = newinitial
  }

  return {
    type,
    area,
    initial,
    setType,
    setArea,
    setInitial
  }
})