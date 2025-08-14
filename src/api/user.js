import request from '@/utils/request'
// 获取用户详情
export const getUserDetail = (uid) => {
  return request.get('/user/detail', { params: { uid } })
}