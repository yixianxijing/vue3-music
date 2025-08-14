import request from '@/utils/request'

// 获取热门歌手列表
export const getHotArtists = (limit = 10, offset = 0) => {
  return request.get('/top/artists', {
    params: {
      limit,
      offset
    }
  })
}

// 获取全部热门歌手
export const getAllHotArtlists = () => {
  return request.get('/top/artists')
}

// 获取歌手分类列表
export const getArtistList = (limit = 30, offset = 0, type = -1, area = -1, initial = -1) => {
  return request.get('/artist/list', {
    params: {
      limit,
      offset,
      type, // 全部类型
      area, // 全部地区
      initial // 热门
    }
  })
}

// 获取歌手单曲
export const getArtistMusic = (id) =>{
  return request.get('/artists',{
    params:{
      id
    }
  })
}
