import request from '@/utils/request.js'

// 获取新歌
export const getNewMusic = ()=>{
  return request.get('/banner')
}

// 获取热门歌单分类
export const getHotMusic = ()=>{
  return request.get('/playlist/hot')
}

// 获取歌单分类
export const getPlaylistCatlist = () => {
  return request.get('/playlist/catlist')
}

// 获取歌单
export const getMusicList  = (order = 'hot', cat = '全部', limit = 10000, offset = 0) => {
  return request.get('/top/playlist', {
    params: {
      order,
      cat,
      limit,
      offset
    }
  })
}

// 获取推荐歌单
export const getRecommendMusicList = () => {
  return request.get('/personalized',{
    params:{
      limit:4
    }
  })
}

// 新碟上架
export const getNewAlbum = () => {
  return request.get('/top/album',{
    params:{
      offset:2,
      limit:10
    }
  })
}

// 获取榜单名
export const getTop = () => {
  return request.get('/toplist')
}

// 获取排行榜
export const getTopListDetails = (id) => {
  return request.get('/playlist/detail',{
    params:{
      id: id,
      limit:500
    }
  })
}

// 获取用户歌单
export const getUserList = (uid) => {
  return request.get('/user/playlist', {
    params:{
      uid,
    }
  })
}

// 获取歌单评论
export const getListComment = (id) =>{
  return request.get('/comment/playlist',{
    params:{
      id:id
    }
  })
}

// 获取歌曲评论
export const getMusicComment = (id) =>{
  return request.get('/comment/music',{
    params:{
      id,
    }
  })
}

// 获取歌词
export const getMusicLyrics = (id) =>{
  return request.get('/lyric',{
    params:{
      id
    }
  })
}

// 获取歌曲详情
export const getMusicDetail = (ids) =>{
  return request.get('/song/detail',{
    params:{
      ids
    }
  })
}

// 获取相似歌曲
export const getSimiSong = (id) =>{
  return request.get('/simi/song',{
    params:{
      id
    }
  })
}

// 获取歌单详情
export const getListDetails = (id) =>{
  return request.get('/playlist/track/all',{
    params:{
      id
    }
  })
}

// 最近播放
export  const getRecentSong = (uid) =>{
  return request.get('/user/record',{
    params:{
      uid,
      type:1
    }
  })
}

// 相关歌单推荐
export const getRelatedList = (id) =>{
  return request.get('/related/playlist',{
    params:{
      id
    }
  })
}

// 获取音乐url
export const getMusicUrl = (id) =>{
  return request.get('/song/url',{
    params:{
      id
    }
  })
}