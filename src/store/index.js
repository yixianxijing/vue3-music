import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLogin = ref(false)
  const userAvatar = ref('')
  const uid = ref('1726312759')
  const userinfo = ref({})

  const initLoginStatus = () => {
    const storedIsLogin = localStorage.getItem('isLogin')
    const storedUserAvatar = localStorage.getItem('userAvatar')
    const storedUserinfo = localStorage.getItem('userinfo')

    if (storedIsLogin) {
      isLogin.value = JSON.parse(storedIsLogin)
    }

    if (storedUserAvatar) {
      userAvatar.value = storedUserAvatar
    }

    if (storedUserinfo) {
      userinfo.value = JSON.parse(storedUserinfo)
    }
  }

  // 设置用户登录状态
  const setLoginStatus = (status) => {
    isLogin.value = status
    localStorage.setItem('isLogin', JSON.stringify(status))
  }

  // 设置用户头像
  const setUserAvatar = (info) => {
    userAvatar.value = info
    localStorage.setItem('userAvatar', info)
  }

  //设置用户详细信息
  const setUserInfo = (info) =>{
    userinfo.value = info
    localStorage.setItem('userinfo', JSON.stringify(info))
  }

  // 退出登录
  const logout = () => {
    isLogin.value = false
    userAvatar.value = ''
    userinfo.value = {}
    localStorage.removeItem('isLogin')
    localStorage.removeItem('userAvatar')
    localStorage.removeItem('userinfo')
  }

  // 初始化登录状态
  initLoginStatus()

  return {
    isLogin,
    userAvatar,
    uid,
    userinfo,
    setLoginStatus,
    setUserAvatar,
    setUserInfo,
    logout
  }
})
