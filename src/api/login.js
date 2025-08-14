import request from '@/utils/request'

//获取验证码
export const getLoginCode = (phone, ctcode = '86')=>{
  request.get('/captcha/sent',{ params: { phone, ctcode } })
}

// 手机登录
// export const cellphoneLogin = (phone, password) => {
//     const params = { phone, password };
//     return request.get('/login/cellphone', { params });
// }
export const cellphoneLogin = (phone, password, captcha, countrycode = '86') => {
  let data = { phone, countrycode }
  if (captcha) {
    data.captcha = captcha
  } else {
    data.password = password
  }

  // 添加时间戳参数避免缓存
  const timestamp = new Date().getTime()

  return request.post(`/login/cellphone?t=${timestamp}`,  data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 邮箱登录
export const emailLogin = (email, password) => {
  const params = { email, password }

  return request.get('/login', { params })
}

// 验证验证码
export const verifyCaptcha = (phone, captcha, ctcode = '86') => {
  return request.get('/captcha/verify', { params: { phone, captcha, ctcode } })
}

// 注册（修改密码）
export const registerOrChangePassword = (phone, password, captcha, nickname) => {
  return request.get('/register/cellphone', {
    params: { phone, password, captcha, nickname }
  })
}

// 检测手机号码是否已注册
export const checkPhoneExistence = (phone, countrycode) => {
  const params = { phone }
  if (countrycode) {
    params.countrycode = countrycode
  }

  return request.get('/cellphone/existence/check', { params })
}

// 检测昵称是否重复
export const checkNickname = (nickname) => {
  return request.get('/nickname/check', {
    params: { nickname }
  })
}

// 获取用户账号信息
export const getUserAccount = () => {
  return request.get('/user/account')
}

// 获取登录状态
export const getLoginStatus = () => {
  return request.get('/login/status')
}