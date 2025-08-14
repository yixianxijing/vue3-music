<template>
  <div class="common-layout">
    <el-container>
      <el-container>
        <el-main>
            <div class="lyrics-l" v-if="musicDetailList">
                <div class="cover-l">
                    <img :src="musicDetailList?.al?.picUrl" alt="">
                </div>
                <div class="title">
                    <div class="head">{{ musicDetailList?.name }}</div>
                    <p class="des">歌手：
                        <span v-for="(artist, index) in musicDetailList?.ar || []" :key="artist.id">
                          <a @click="musicStore.handleSinger(artist.id)">{{ artist.name }}</a>
                          <span v-if="index < (musicDetailList?.ar?.length || 0) - 1"> / </span>
                        </span>
                    </p>
                    <p class="des">所属专辑：
                        <span class="al">{{ musicDetailList.al?.name }}</span></p>
                    <div class="btns">
                        <el-button @click="musicDetailList?.id && playCurrentSong()">播放</el-button>
                    </div>
                    <div class="lyrics">
                    <div v-if="processedLyrics.length > 0" :class="{ 'lyrics-collapsed': !isExpanded }">
                    <span v-for="(line, index) in displayedLyrics" :key="index">
                        {{ line }}<br v-if="index < displayedLyrics.length - 1">
                        </span>
                    </div>
                    <div v-if="shouldShowToggle" class="lyrics-toggle" @click="toggleLyrics">
                    {{ isExpanded ? '收起' : '展开全部歌词' }}
                    </div>
                    </div>
                </div>
            </div>
            <div class="comment" id="comment-section">
            <div class="comment-top">
              <h3><span class="list-title">评论</span></h3>
            </div>
            <div class="m-cmmt" v-for="item in commentList" :key="item.id">
              <div class="itm">
                <div class="head">
                  <a><img :src="item.user.avatarUrl" alt=""></a>
                </div>
                <div class="cmn">
                  <a href="">{{ item.user.nickname }}:</a>
                  {{ item.content }}
                </div>
                <div class="rq">
                  <div class="time">{{ item.timeStr }}</div>
                  <div class="dz">
                    <!-- 添加点赞图片 -->
                    <img src="../assets/点赞.png" alt="点赞" class="like-icon">
                    {{ item.likedCount }}
                  </div>
                </div>
              </div>
            </div>
            </div>
        </el-main>
        <el-aside width="200px">
            <div class="left-part">
                <h3 class="u-hd3">相似歌曲</h3>
                <ul>
                    <li v-for="item in simiSong" :key="item.id">
                        <div class="txt">
                          <div class="song-info">
                            <div class="s-title">
                              <a @click="musicStore.handleMusic(item.id)">{{ item.name }}</a>
                            </div>
                            <div class="s-artist">
                              <span v-for="(artist, index) in item.artists" :key="artist.id">
                                <a @click="musicStore.handleSinger(artist.id)">{{ artist.name }}</a>
                                <span v-if="index < (item.artists.length || 0) - 1"> / </span>
                              </span>
                            </div>
                          </div>
                          <div class="button">
                            <img src="../assets/播放.png" alt="播放" width="18px" height="18px" @click="musicStore.handleMusic(item.id)">
                          </div>
                        </div>
                    </li>
                </ul>
            </div>
        </el-aside>
      </el-container>
    </el-container>
    <el-backtop 
      :right="30" 
      :bottom="100"
      class="back-to-top"
      >
      <div class="backtop-content"> 
      <img src="../assets/箭头 上.png" alt="回到顶部" width="24"> 
      </div> 
    </el-backtop>
  </div>
  <Footer></Footer>
</template>

<script setup>
import { getMusicComment, getMusicLyrics, getMusicDetail, getSimiSong } from '@/api/music.js'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMusicStore } from '@/store/music.js'
import Footer from '@/components/Footer.vue'
const musicStore = useMusicStore()
const route = useRoute()
// 获取评论
const commentList = ref([])
const getCommentList = async () => {
  const id =  route.query.id
  const res = await getMusicComment(id)
  commentList.value = res.data.comments
//   console.log(commentList.value)
}

// 获取歌词
const lyrics = ref([])
const getMusicLyric = async () =>{
  const id = route.query.id
  const res = await getMusicLyrics(id)
  lyrics.value = res.data
  console.log(  lyrics.value)
}

// 获取歌曲详情
const musicDetailList = ref([])
const musicDetail = async () =>{
  const ids = route.query.id
  const res = await getMusicDetail(ids)
  musicDetailList.value = res.data.songs[0]
  // console.log(musicDetailList.value)
}

// 新增的状态管理
const isExpanded = ref(false)
const defaultDisplayLines = 13 // 默认显示的行数

// 初始化调用
getCommentList()
getMusicLyric()
musicDetail()

onMounted(()=>{
  playCurrentSong()
})

// 监听 URL 中 id 的变化
watch(() => route.query.id, async (newId) => {
  if (newId) {
    musicStore.setCurrentId(newId)
    await getCommentList()
    await getMusicLyric()
    await musicDetail()
    await getSimiList()
    playCurrentSong()
  }
}, { immediate: true })

// 处理歌词数据
const processedLyrics = computed(() => {
  const lines = lyrics.value?.lrc?.lyric?.split('\n') || []
  const pureLyrics = []
  const timeRegex = /\[\d{2}:\d{2}\.\d{2,3}\]/g
  
  for (const line of lines) {
    const text = line.replace(timeRegex, '').trim()
    if (text) {
      pureLyrics.push(text)
    }
  }
  
  return pureLyrics
})

// 修改处理歌词数据的计算属性
const displayedLyrics = computed(() => {
  return isExpanded.value 
    ? processedLyrics.value 
    : processedLyrics.value.slice(0, defaultDisplayLines)
})

// 是否需要显示切换按钮
const shouldShowToggle = computed(() => {
  return processedLyrics.value.length > defaultDisplayLines
})

// 切换展开/收起状态
const toggleLyrics = () => {
  isExpanded.value = !isExpanded.value
}

const extractLyrics = (lyricText) => { 
  const lines = lyricText.split('\n') 
  const pureLyrics = [] 
  const timeRegex = /\[\d{2}:\d{2}\.\d{2,3}\]/g 
  for (const line of lines) { 
    const text = line.replace(timeRegex, '').trim() 
    if (text) { 
      pureLyrics.push(text) 
    } 
  }
 
  return pureLyrics 
} 

const lyricLines = ref(extractLyrics(lyrics.value?.lrc?.lyric || '')) 
const showAll = ref(false) 

// 当歌词更新时，重新处理歌词行
watch(lyrics, () => { 
  lyricLines.value = extractLyrics(lyrics.value?.lrc?.lyric || '') 
  showAll.value = false 
}) 
// 获取相似歌曲
const simiSong = ref([])
const getSimiList = async () =>{
  const id = route.query.id
  const res = await getSimiSong(id)
  simiSong.value = res.data.songs
  // console.log(simiSong.value)
}

getSimiList()
// 播放音乐
const playCurrentSong = () => {
  musicStore.addToPlaylist(musicDetailList.value)
  musicStore.handlePlay(route.query.id) // 传递当前歌曲ID
  // console.log(route.query.id)
}
</script>

<style lang="less" scoped>
.common-layout {
  width: 980px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  overflow-y: auto;
}
// 在评论盒子样式前添加清除浮动
.lyrics-l {
  overflow: hidden;
}

.comment {
  clear: both;
  position: relative; /* 确保评论盒子在正常文档流中 */
}

.comment-top{
  height: 33px;
  border-bottom: 2px solid #c20c0c;
  padding-bottom: 2px;
  margin-top: 20px;
}
.list-title{
  float: left;
  margin-top: 9px;
}
.m-cmmt .head img
 {
    float: left;
    width: 50px;
    height: 50px;
    margin-right: -100px;
    }
.m-cmmt .itm .cmn{
    width: 100%;
    overflow: hidden;
    line-height: 20px;
}
.m-cmmt .itm a{
    margin-right: 5px;
    color: #000;
}
.m-cmmt .itm{
  padding: 15px 0;
  border-top: 1px dotted #ccc;
  position: relative; // 添加相对定位
  display: flex; // 使用 flex 布局
  align-items: flex-start; // 头像顶部对齐
}

.m-cmmt .head {
  float: none; // 移除浮动
  margin-right: 15px; // 添加头像与内容的间距
}

.m-cmmt .head img {
  float: none; // 移除浮动
  width: 50px;
  height: 50px;
  display: block; // 块级元素便于居中
  margin: 0 auto; // 头像居中
}

.m-cmmt .itm .cmn {
  width: calc(100% - 65px); // 减去头像和间距的宽度
  overflow: visible; // 移除溢出隐藏
  line-height: 20px;
  // 移除 flex-direction: column，让名称和评论内容在同一行显示
}
.m-cmmt .itm a {
  margin-right: 5px;
  color: #000;
  font-weight: bold; // 昵称加粗显示
}

.m-cmmt .itm .time {
  float: none; // 移除浮动
  position: absolute; // 绝对定位
  left: 65px; // 与头像对齐
  bottom: 2px; // 底部对齐
  color: #999; // 时间文字灰色显示
}

.m-cmmt .itm .dz {
  margin-right: 0; // 移除右边距
  position: absolute; // 绝对定位
  // 修改 right 值，数值调大往左移，可按需调整
  right: 20px;
  bottom: 15px; // 底部对齐
  color: #999; // 点赞数文字灰色显示
  vertical-align: initial; // 移除垂直对齐
  display: flex; // 使用 flex 布局
  align-items: center; // 垂直居中
}

.m-cmmt .itm .dz .like-icon {
  width: 16px; // 设置图片宽度
  height: 16px; // 设置图片高度
  margin-right: 5px; // 添加图片与点赞数的间距
}
.lyrics-l{
    margin-top: -10px;
    padding: 47px 30px 40px 39px;
    .cover-l{
        float: left;
        width: 206px;
        margin-right: -226px;
        width: 198px;
        height: 198px;
        position: relative;
        display: block;
        img{
            width: 130px;
            height: 130px;
            margin: 34px;
            border:30px solid #000;
            border-radius: 50%;
        }
        .msk{
            width: 206px;
            height: 205px;
            top: -4px;
            left: -4px;
            background-position: -140px -580px;
        }
    }
    .title{
        float: right;
        width: 414px;
        .head{
            position: relative;
            top: -6px;
            font-size: 24px;
        }
        .des{
            margin: 10px 0;
            color:#999;
            a, .al{
                color: #0c73c2;
                cursor: pointer;
            }
        }
    }
}
.lyrics {
  line-height: 1.8;
  margin-top: 15px;
  
  &-collapsed {
    max-height: 250px; /* 大约13行的高度 */
    overflow: hidden;
    position: relative;
    
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1));
    }
  }
  
  &-toggle {
    color: #0c73c2;
    cursor: pointer;
    margin-top: 10px;
    text-align: left;
    display: inline-block;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
.left-part{
    padding: 20px 40px 40px 30px;
    .u-hd3{
        position: relative;
        height: 23px;
        margin-bottom: 20px;
        border-bottom: 1px solid #ccc;
        color: #333;
    }
}

ul{
    li{
        margin-top: 10px;
    }
}
.el-main {
  border: 1px solid #E3E3E3;
}

.el-aside {
  border: 1px solid #E3E3E3;
}
.txt {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  
  .song-info {
    flex: 1;
    min-width: 0; /* 防止内容溢出 */
    
    .s-title a {
      color: #333;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
    }
    
    .s-artist {
      color: #999;
      font-size: 12px;
      
      a {
        color: #999;
        cursor: pointer;
      }
    }
  }
  
  .button {
    margin-left: 10px;
    flex-shrink: 0;
    
    img {
      vertical-align: middle;
      cursor: pointer;
      transition: transform 0.2s;
      
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>