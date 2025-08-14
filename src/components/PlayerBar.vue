<template>
  <div class="player-bar-container" :class="{ 'show': isVisible }">
  <div class="playlist-popup" v-if="showPlaylist">
    <div class="playlist-header">播放列表 ({{ playlist?.length || 0 }})<button class="clear-playlist-btn" @click="musicStore.clearPlaylist()">清空</button></div>
    <div class="playlist-items">
      <div class="playlist-item" :class="{ 'active': song.id === currentId }" v-for="(song, index) in playlist" :key="`${song.id}-${index}`" @click="musicStore.setCurrentId(song.id)">
        <div class="song-info">
          <div class="song-name">{{ song.name }}</div>
          <div class="song-artist">
            <span v-for="artist in song.ar || []" :key="artist?.id">{{ artist?.name }}</span>
          </div>
        </div>
        <div class="song-duration">{{ formatTime(song.dt / 1000) }}</div>
      </div>
    </div>
  </div>
  <button class="toggle-arrow" @click="musicStore.showPlayer">
    {{ isVisible ? '↓' : '↑' }}
  </button>
    <div class="player-bar">
      <audio 
        ref="audioPlayer" 
        :src=url
        crossorigin="anonymous"
        @timeupdate="updateProgress" 
        @loadedmetadata="updateDuration"
        @error="handleError"
      ></audio>
      <div class="player-controls">
        <div class="song-info">
          <img :src="currentSong.al?.picUrl" alt="Song Cover" class="song-cover">
          <div class="song-details">
            <h4 class="song-title">{{ currentSong.name }}</h4>
            <p class="song-artist">{{ currentSong?.ar?.map(artist => artist.name).join(', ') }}</p>
          </div>
        </div>
        <div class="playback-controls">
          <button class="control-btn" @click="musicStore.togglePlaylist" title="播放列表">📋</button>
          <button class="control-btn" @click="musicStore.prevSong()" title="上一首">⏮</button>
          <button class="play-btn" @click="triggerPlay" title="播放按钮">
            {{ isPlaying ? '❚❚' : '▶' }}
          </button>
          <button class="control-btn" @click="musicStore.nextSong()" title="下一首">⏭</button>
        </div>
        <div class="progress-container">
          <div class="progress-bar" ref="progressBar" @click="handleProgressClick" @mousedown="startDrag">
            <div class="progress" :style="{ width: progress + '%' }"></div>
          </div>
          <span class="time">{{ formatTime(currentTime) }}/{{ formatTime(duration) }}</span>
        </div>
        <div class="volume-control">
          <button class="volume-btn">🔊</button>
          <input 
            type="range" 
            min="0" 
            max="100" 
            v-model="volume" 
            @input="setVolume"
            class="volume-slider"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMusicStore } from '@/store/music.js'
import { getMusicDetail, getMusicUrl } from '../api/music'

const musicStore = useMusicStore()
const { currentId, isVisible, showPlaylist, playlist } = storeToRefs(musicStore)
// 播放器状态
const audioPlayer = ref(null)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)
const isPlaying = ref(false)
const volume = ref(50)
const isAudioLoaded = ref(false) // 默认音量50%
const dragging = ref(false)
const progressBar = ref(null)
const currentSong = ref({})
// 规格化播放时间
const formatTime = (time) => {
  if (isNaN(time)) return '00:00'
  const mins = Math.floor(time / 60)
  const secs = Math.floor(time % 60)

  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 更新现在播放时间
const updateProgress = () => {
  if (audioPlayer.value && !dragging.value) {
    currentTime.value = audioPlayer.value.currentTime
    progress.value = (currentTime.value / duration.value) * 100
  }
}

// 更新总播放时间
const updateDuration = () => {
  if (audioPlayer.value) {
    duration.value = audioPlayer.value.duration || 0
    isAudioLoaded.value = true
  }
}

// 暂停和播放切换
const triggerPlay = async () => {
  if (!audioPlayer.value) return
  if (isPlaying.value) {
    audioPlayer.value.pause()
    isPlaying.value = false
  } else {
    try {
      await audioPlayer.value.play()
      isPlaying.value = true
    } catch (error) {
      console.error("播放失败:", error)
      isPlaying.value = false
    }
  }
}

// 设置播放条和音量
const setVolume = (e) => {
  const vol = e.target.value
  volume.value = vol
  if (audioPlayer.value) {
    audioPlayer.value.volume = vol / 100
  }
}

// 计算拖拽后的播放时间
const handleProgressClick = (e) => {
  if (!progressBar.value || !duration.value) return
  const rect = progressBar.value.getBoundingClientRect()
  const pos = (e.clientX - rect.left) / rect.width
  audioPlayer.value.currentTime = pos * duration.value
}

// 监听拖拽开始
const startDrag = (e) => {
  dragging.value = true
  handleDrag(e)
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', endDrag)
}

// 计算拖拽后占比和当前时间
const handleDrag = (e) => {
  if (!progressBar.value || !duration.value) return
  const rect = progressBar.value.getBoundingClientRect()
  let pos = (e.clientX - rect.left) / rect.width
  pos = Math.max(0, Math.min(pos, 1))
  progress.value = pos * 100
  currentTime.value = pos * duration.value
}

// 移除监听赋值当前时间
const endDrag = () => {
  dragging.value = false
  if (audioPlayer.value && duration.value) {
    audioPlayer.value.currentTime = currentTime.value
  }

  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', endDrag)
}

// 捕捉错误，输出详细信息以便调试
const handleError = (event) => {
  const audioElement = event.target
  let errorMsg = '音频加载失败: '
  
  if (audioElement.error) {
    switch(audioElement.error.code) {
      case audioElement.error.MEDIA_ERR_ABORTED:
        errorMsg += '请求被中止'
        break
      case audioElement.error.MEDIA_ERR_NETWORK:
        errorMsg += '网络错误'
        break
      case audioElement.error.MEDIA_ERR_DECODE:
        errorMsg += '解码失败'
        break
      case audioElement.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
        errorMsg += '资源不支持'
        break
      default:
        errorMsg += '未知错误'
    }
  }
  
  console.error(`${errorMsg}，URL: ${audioElement.src}，HTTP状态: ${audioElement.networkState}`)
  

}

const url = ref('')
const getUrl = async(id) =>{
  try {
    const res = await getMusicUrl(id)
    console.log('音乐URL接口响应:', res.data)
    // 验证接口响应结构
    if (!res.data || !res.data.data || !res.data.data[0] || !res.data.data[0].url) {
      console.error('音乐URL获取失败: 接口返回格式不正确', res.data)
      // 生成备用URL
      url.value = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      console.log('使用备用URL:', url.value)

      return
    }

    url.value = res.data.data[0].url
    console.log('音乐URL加载成功:', url.value)
  } catch (error) {
    console.error('获取音乐URL失败:', error.message || error)
    // 生成备用URL
    url.value = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    console.log('使用备用URL:', url.value)
  }
}

onMounted(() =>{
  // 仅在 currentId 存在时调用
  if (musicStore.currentId) {
    getMusicDetails()
    getUrl(musicStore.currentId)
  } else {
    console.log('等待歌曲ID设置后再加载详情')
  }
})

// 监听 currentId 变化，动态加载详情
watch(currentId, async (newId) => {
  if (newId) {
    isPlaying.value = false // 重置为暂停状态
    await getMusicDetails() // 等待详情加载完成
    await getUrl(newId) // 获取新歌曲URL
    if (audioPlayer.value) {
      isAudioLoaded.value = false
      audioPlayer.value.src = url.value
      audioPlayer.value.load()
    }
  }
})
const getMusicDetails = async() =>{
  if (!musicStore.currentId) {
    console.error('获取歌曲详情失败：歌曲ID为空')

    return
  }

  try {
    console.log('开始加载歌曲详情，ID:', musicStore.currentId)
    const res = await getMusicDetail(musicStore.currentId)
    if (!res || res.data.code !== 200) {
      console.error('接口返回错误：', res?.data?.msg || '未知错误')

      return
    }

    currentSong.value = res.data.songs?.[0] || {}
    console.log('歌曲详情加载成功:', currentSong.value.name)
  } catch (error) {
    console.error('获取歌曲详情失败：', error.message || error)
  } finally {
    console.log('歌曲详情加载流程完成')
  }
}

</script>

<style scoped lang="less">
.player-bar-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
  z-index: 9999;

  .playlist-popup {
  position: absolute;
  bottom: 100%;
  right: 50%;
  width: 300px;
  background: #282828;
  color: white;
  padding: 10px;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
  max-height: 300px;
  overflow-y: auto;
}

  .playlist-header {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #444;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .clear-playlist-btn {
    background: #f53f3f;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 12px;
    cursor: pointer;
  }

  .playlist-items {
    .playlist-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 10px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;

      &.active {
        background: #3a3a3a;
        font-weight: bold;
      }

      &:hover {
        background: #383838;
      }

      .song-info {
        flex: 1;
        overflow: hidden;

        .song-name {
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .song-artist {
          font-size: 12px;
          color: #aaa;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .song-duration {
        font-size: 12px;
        color: #aaa;
        margin-left: 10px;
      }
    }
  }
  
  .toggle-arrow {
    position: absolute;
    top: -20px;
    left: 90%;
    transform: translateX(-50%);
    background: #1e1e1e;
    color: white;
    border: none;
    border-radius: 4px 4px 0 0;
    padding: 2px 8px;
    cursor: pointer;
    font-size: 14px;
  }

  &.show {
    transform: translateY(0);
  }

  .player-bar {
    background-color: #1e1e1e;
    color: white;
    padding: 10px 20px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);

    .player-controls {
      display: flex;
      align-items: center;
      gap: 20px;


      .song-info {
        display: flex;
        align-items: center;
        gap: 15px;
        min-width: 250px;

        .song-cover {
          width: 50px;
          height: 50px;
          border-radius: 4px;
          object-fit: cover;
        }

        .song-details {
          .song-title {
            margin: 0 0 5px 0;
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .song-artist {
          margin: 0;
          font-size: 12px;
          color: #aaa;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }
        }
      }

      .playback-controls {
        display: flex;
        gap: 15px;

        .control-btn {
          background: none;
          border: none;
          color: #aaa;
          font-size: 16px;
          cursor: pointer;
          &:hover {
            color: white;
          }
        }

        .play-btn {
          background: white;
          color: #1e1e1e;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          &:hover {
            background: #f0f0f0;
          }
        }
      }

      .progress-container {
        flex: 1;
        min-width: 200px;

        .time {
          font-size: 12px;
          color: #aaa;
          margin-left: 10px;
        }

        .progress-bar {
          height: 4px;
          background-color: #444;
          border-radius: 2px;
          flex: 1;
          position: relative;
          cursor: pointer;

          .progress {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            background-color: #ff4d4f;
            border-radius: 2px;
            &::after {
              content: '';
              position: absolute;
              right: 0;
              top: 50%;
              transform: translate(50%, -50%);
              width: 12px;
              height: 12px;
              background-color: white;
              border-radius: 50%;
              box-shadow: 0 0 4px rgba(0,0,0,0.3);
              opacity: 0;
              transition: opacity 0.2s;
            }
            &:hover::after {
              opacity: 1;
            }
          }
        }
      }

      .volume-control {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 120px;

        .volume-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        .volume-slider {
          height: 4px;
          background-color: #444;
          border-radius: 2px;
          width: 80px;
          cursor: pointer;

          .volume-level {
            height: 100%;
            background-color: #aaa;
            border-radius: 2px;
          }
        }
      }
    }
  }
}
.volume-control {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 120px;
}

.volume-slider {
  width: 80px;
  height: 4px;
  background: #444;
  border-radius: 2px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    background: #aaa;
    border-radius: 50%;
    cursor: pointer;
  }
}
</style>