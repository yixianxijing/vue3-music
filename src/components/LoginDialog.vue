<template>
    <el-dialog v-model="dialogFormVisible" title="登录/注册" width="500" :show-close="true" :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
            <div class="login-dialog-container">
                <!-- 网易邮箱登录输入框 -->
                <el-form-item label="网易邮箱" prop="email" v-if="isEmailLogin">
                    <el-input 
                        v-model="form.email" 
                        autocomplete="off" 
                        placeholder="请输入网易邮箱" 
                        class="login-input"
                        clearable
                    />
                </el-form-item>
                <!-- 手机号输入框 -->
                <el-form-item label="手机号" prop="phone" v-if="!isEmailLogin">
                    <el-input 
                        v-model="form.phone" 
                        autocomplete="off" 
                        placeholder="请输入手机号" 
                        class="login-input"
                        clearable
                    />
                </el-form-item>
            
                <!-- 验证码输入区域 -->
                <el-form-item label="验证码" prop="captcha" v-if="!isEmailLogin && (isRegister || !isPasswordLogin)">
                    <el-input 
                        v-model="form.captcha" 
                        autocomplete="off" 
                        placeholder="请输入短信验证码" 
                        class="login-input"
                    />
                    <el-button 
                        link
                        class="get-code-btn"
                        @click="getVerificationCode"
                        :disabled="isCodeDisabled"
                    >
                        {{ codeText }}
                    </el-button>
                </el-form-item>
                <!-- 密码输入框 -->
                <el-form-item label="密码" prop="password" v-if="isRegister || isPasswordLogin || isEmailLogin">
                    <el-input 
                        v-model="form.password" 
                        autocomplete="off" 
                        placeholder="请输入密码" 
                        class="login-input"
                        clearable
                        type="password"
                    />
                </el-form-item>
                <!-- 昵称输入框 -->
                <el-form-item label="昵称" prop="nickname" v-if="isRegister">
                    <el-input
                        v-model="form.nickname"
                        autocomplete="off"
                        placeholder="请输入昵称"
                        class="login-input"
                        clearable
                        @blur="checkNicknameAvailability"
                    />
                </el-form-item>
            
                <!-- 登录/注册按钮 -->
                <el-button
                    class="login-btn"
                    @click="isEmailLogin ? handleLogin('email') : (isRegister ? handleRegister() : handleLogin('phone'))"
                    :disabled="isEmailLogin ? (!form.email || !form.password) : (!form.phone || (!isPasswordLogin ? !form.captcha : !form.password) || (isRegister && !form.nickname))"
                >
                    {{ isRegister ? '注册' : '登录' }}
                </el-button>
                <!-- 密码登录/注册切换 -->
                <div class="login-switch-group">
                    <div class="login-switch">
                        <el-button 
                            link
                            @click="switchToPasswordLogin" 
                            :disabled="isEmailLogin"
                        >
                            {{ isPasswordLogin ? '验证码登录' : '密码登录' }}
                        </el-button>
                    </div>
                    <div class="register-switch">
                        <a href="#" @click.prevent="switchToRegister">{{ isRegister ? '返回登录' : '注册' }}</a>
                    </div>
                </div>
            </div>
            <div class="login-email">
                <div class="login-email-inner">
                    <img v-if="!isEmailLogin" src="@/assets/netease-logo.png" alt="网易logo" class="netease-logo">
                    <a href="#" @click.prevent="switchToEmail">{{ isEmailLogin ? '手机号登录' : '网易邮箱登录' }}</a>
                </div>
            </div>
        </el-form>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { getLoginCode, verifyCaptcha, checkPhoneExistence, checkNickname } from '../api/login.js'
import { useUserStore } from '../store/index.js'
import { getUserDetail } from '../api/user.js'

const userStore = useUserStore()
const { uid } = storeToRefs(userStore)

const dialogFormVisible = ref(false)
const form = reactive({
  phone: '',
  password: '',
  captcha: '',
  nickname: '',
  email:''
})

// 表单引用
const formRef = ref(null)

// 验证码相关状态
const isCodeDisabled = ref(false)
const codeText = ref('获取验证码')

// 控制是否为密码登录状态
const isPasswordLogin = ref(false)

// 控制是否为注册状态
const isRegister = ref(false)

// 控制是否为网易邮箱登录状态
const isEmailLogin = ref(false)

// 表单校验规则
const rules = reactive({
  email: [
    { required: true, message: '请输入网易邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { 
      validator: async (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入昵称'))

          return
        }

        try {
          const res = await checkNickname(value)
          if (res.data.code === 200) {
            if (res.data.exist) {
              callback(new Error(`昵称 "${value}" 已存在，请使用备用昵称：${res.data.suggestions.join(', ')}`))
            } else {
              callback()
            }
          } else {
            callback(new Error('检测昵称失败，请稍后重试'))
          }
        } catch (error) {
          callback(new Error('检测昵称失败，请稍后重试'))
        }
      },
      trigger: ['blur', 'change']
    }
  ]
})


// 切换到密码登录
const switchToPasswordLogin = () => {
  isPasswordLogin.value = !isPasswordLogin.value
  // 切换时清空之前输入的验证码或密码
  if (isPasswordLogin.value) {
    form.captcha = ''
  } else {
    form.password = ''
  }
}

// 切换到注册状态
const switchToRegister = () => {
  isRegister.value = !isRegister.value
  // 切换时清空之前输入的内容
  form.captcha = ''
  form.password = ''
}

// 切换邮箱登录
const switchToEmail = () => {
  isEmailLogin.value = !isEmailLogin.value
  if (isEmailLogin.value) {
    // 清空手机号登录相关信息
    form.phone = ''
    form.captcha = ''
    form.password = ''
    form.nickname = ''
    isRegister.value = false
    isPasswordLogin.value = false
  } else {
    // 清空邮箱登录相关信息
    form.email = ''
    form.password = ''
  }
}

// 获取验证码逻辑
const getVerificationCode = async () => {
  const phone = form.phone
  if (!phone) {
    ElMessage.error('请输入手机号')

    return
  }

  try {
    await getLoginCode(phone)
    ElMessage.success('验证码已发送，请查收')
    // 倒计时逻辑
    let count = 60
    isCodeDisabled.value = true
    codeText.value = `${count}s后重新获取`

    const timer = setInterval(() => {
      count--
      codeText.value = `${count}s后重新获取`
      if (count <= 0) {
        clearInterval(timer)
        isCodeDisabled.value = false
        codeText.value = '获取验证码'
      }
    }, 1000)
  } catch (error) {
    ElMessage.error('验证码发送失败，请稍后重试')
    console.error('获取验证码失败:', error)
  }
}

// 登录处理
const handleLogin = async (type) => {
  if (type === 'email') {
    const { email, password } = form
    try {
      const res = await getUserDetail(uid.value)
      if (res.data.code === 200) {
        ElMessage.success('登录成功')
        dialogFormVisible.value = false
        form.email = ''
        form.password = ''
        userStore.setLoginStatus(true)
      } else {
        ElMessage.error('登录失败，请重新输入')
      }
    } catch (error) {
      ElMessage.error('登录失败，请稍后重试')
      console.error('登录失败:', error)
    }
  } else if (type === 'phone') {
    const { phone, captcha, password } = form
    // 检测手机号码是否已注册
    const phoneRes = await checkPhoneExistence(phone)
    if(phoneRes.data.code !== 200){
      ElMessage.error('手机号未注册，请注册后登录')
    }

    try {
      let res
      if (isPasswordLogin.value) {
        res = await getUserDetail(uid.value)
      } else {
        if (!captcha) {
          return
        }

        const captchaRes = await verifyCaptcha(phone, captcha)
        if(captchaRes.data.code === 200){
          res = await getUserDetail(uid.value)
        }
      }

      if (res.data.code === 200) {
        ElMessage.success('登录成功')
        dialogFormVisible.value = false
        form.phone = ''
        form.captcha = ''
        form.password = ''
        const avatar = res.data.profile.avatarUrl
        userStore.setUserAvatar(avatar)
        userStore.setLoginStatus(true)
        userStore.setUserInfo(res.data)
        console.log(res.data)
      } else {
        ElMessage.error('登录失败，请重新输入')
      }
    } catch (error) {
      ElMessage.error('登录失败，请稍后重试')
      console.error('登录失败:', error)
    }
  }
}

// 注册处理
const handleRegister = async () => {
  const { phone, captcha, password, nickname } = form

  const phoneRes = await checkPhoneExistence(phone)
  if(phoneRes.data.code === 200){
    ElMessage.success('手机号已注册，请直接登录')
  }

  try {
    const res = await getUserDetail(uid.value)
    if (res.data.code === 200) {
      ElMessage.success('注册成功，请使用账号登录')
      form.phone = ''
      form.captcha = ''
      form.password = ''
      form.nickname = ''
      isRegister.value = false
    } else {
      ElMessage.error('注册失败，请重新输入')
    }
  } catch (error) {
    ElMessage.error('注册失败，请稍后重试')
    console.error('注册失败:', error)
  }
}


// 关闭对话框时重置表单
const handleClose = () => {
  form.phone = ''
  form.captcha = ''
  form.password = ''
  form.nickname = ''
  dialogFormVisible.value = false
  isPasswordLogin.value = false
  isRegister.value = false
}


const openLoginDialog = () => {
  dialogFormVisible.value = true
}

defineExpose({
  openLoginDialog
})
</script>

<style lang="less" scoped>
/* 登录对话框样式 */
.login-dialog-container {
  padding: 20px 40px;
}

/* 手机号输入组 */
.login-input-group {
  position: relative;
  margin-bottom: 20px;
  height: 50px;
  line-height: 50px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  
  &:hover {
    border-color: #409eff;
  }
}

.country-code {
  display: inline-block;
  width: 60px;
  text-align: center;
  border-right: 1px solid #ddd;
  color: #666;
}

/* 验证码输入组 */
.verify-code-group {
  position: relative;
  margin-bottom: 30px;
  height: 50px;
  line-height: 50px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  
  &:hover {
    border-color: #409eff;
  }
}

/* 输入框样式 */
.login-input {
  width: calc(100% - 60px);
  border: none !important;
  box-shadow: none !important;
  height: 100% !important;
  padding: 0 15px !important;
  
  &:focus {
    outline: none;
  }
}

/* 获取验证码按钮 */
.get-code-btn {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  padding: 0 20px;
  color: #409eff;
  background: transparent;
  
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  background-color: #C62F2F;
  border-color: #C62F2F;
  color: #fff;
  border-radius: 4px;
  margin-bottom: 20px;
  
  &:hover {
    background-color: #a82424;
    border-color: #a82424;
  }
  
  &:disabled {
    background-color: #f5c6cb;
    border-color: #f5c6cb;
    cursor: not-allowed;
  }
}

/* 新增的登录切换组样式 */
.login-switch-group {
    display: flex;
    justify-content: center; 
    align-items: center; 
    margin-top: 10px; 
}

/* 密码登录切换链接 */
.login-switch {
  margin-right: 20px; /* 添加右侧间距 */
  
  a {
    color: #409eff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
      background-color: transparent;
    }

    &:disabled {
      color: #ccc;
      cursor: not-allowed;
    }
  }
}

/* 密码登录切换按钮样式 */
.login-switch .el-button {
    color: #409eff;
    text-decoration: none;
    padding: 0;
    border: none;
    box-shadow: none;
    background: transparent;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }

    &:disabled {
        color: #409eff;
        cursor: not-allowed;
        text-decoration: none;
    }
}

/* 注册按钮样式 */
.register-switch {
  
  a {
    color: #409eff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
      background-color: transparent;
    }
  }
}

/* 网易邮箱登录样式 */
.login-email {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
}


.login-email-inner {
    display: flex;
    align-items: center;
}

.login-email a {
    color: #C62F2F; 
    text-decoration: none;
}

.login-email a:hover {
    text-decoration: underline;
}

/* 网易logo样式 */
.netease-logo {
    width: 30px; 
    height: 30px; 
    margin-right: 10px; 
}

/* 隐藏Element默认样式中的padding */
:deep(.el-dialog__body) {
  padding: 0 !important;
}

:deep(.el-input__wrapper) {
  box-shadow: none !important;
  border: none !important;
}


</style>