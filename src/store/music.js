import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import {ref} from 'vue'

export const useMusicStore = defineStore('music', () => {
  const currentId = ref(0)
  const router = useRouter()
  const isVisible = ref(false)
  const currentSong = ref([])
  const playlist = ref([])
  const showPlaylist = ref(false)

  const setCurrentId = (id) => {
    currentId.value = Number(id)
  }


  /**
   * 统一路由跳转方法
   * @param path 目标路径
   * @param id 资源ID
   */
  const navigateWithId = (path, id) => {
    router.push({
      path,
      query: { id: String(id) } // 确保id转为字符串
    })
  }

  // 点击非碟片图片跳转歌单
  const handlePlaylist = (id) => {
    navigateWithId('/playlist', id)
  }

  // 点击碟片跳转专辑
  const handleAlbum = (id) => {
    navigateWithId('/album', id)
  }

  // 点击榜单
  const handleList = (id) => {
    navigateWithId('/discover/toplist', id)
  }

  // 点击歌曲
  const handleMusic = (id) => {
    navigateWithId('/song', id)
  }

  // 点击歌手
  const handleSinger = (id) => {
    navigateWithId('/artist', id)
  }

  // 点击头像进入主页
  const handleHome = (id) =>{
    navigateWithId('/home', id)
  }

  // 点击我的主页中的音乐
  const handleMyList = (id) => {
    navigateWithId('/my',id)
  }

  const handlePlay = (id) =>{
    setCurrentId(id)
    isVisible.value = true
  }

  const showPlayer = () =>{
    isVisible.value = !isVisible.value
    if(isVisible.value == false){
      showPlaylist.value = false
    }
  }

  const togglePlaylist = () => {
    showPlaylist.value = !showPlaylist.value
  }

  const addToPlaylist = (songs) => {
  // 处理单个歌曲
    if (!Array.isArray(songs)) {
      const exists = playlist.value.some(song => song.id === songs.id)
      if (!exists) {
        playlist.value.push(songs)
      }

      return
    }
  
    // 处理歌曲数组
    const newSongs = songs.filter(newSong => 
      !playlist.value.some(existingSong => existingSong.id === newSong.id)
    )
    
    const wasEmpty = playlist.value.length === 0
    if (newSongs.length > 0) {
      playlist.value.push(...newSongs)
      // 如果播放列表原本为空，设置第一首为当前播放歌曲
      if (wasEmpty) {
        setCurrentId(newSongs[0].id)
      }
    }

    // console.log(playlist.value)
    isVisible.value = true
  }

  const clearPlaylist = () => {
    playlist.value = []
  }

  const prevSong = () => {
    if (playlist.value.length === 0) return
    const currentIndex = playlist.value.findIndex(song => song.id === currentId.value)
    const newIndex = currentIndex === 0 ? playlist.value.length - 1 : currentIndex - 1
    setCurrentId(playlist.value[newIndex].id)
  }

  const nextSong = () => {
    if (playlist.value.length === 0) return
    const currentIndex = playlist.value.findIndex(song => song.id === currentId.value)
    const newIndex = currentIndex === playlist.value.length - 1 ? 0 : currentIndex + 1
    setCurrentId(playlist.value[newIndex].id)
  }

  return {
    currentId,
    isVisible,
    currentSong,
    showPlaylist,
    playlist,
    handlePlay,
    setCurrentId,
    handlePlaylist,
    handleAlbum,
    handleList,
    handleMusic,
    handleSinger,
    handleHome,
    handleMyList,
    showPlayer,
    addToPlaylist,
    togglePlaylist,
    clearPlaylist,
    prevSong,
    nextSong
  }
})