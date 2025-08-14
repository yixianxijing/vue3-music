<template>
  <div class="common-layout">
     <el-container class="outer-container">
      <el-container class="inner-container">
      <el-aside width="240px" class="aside">
        <Aside></Aside>
      </el-aside>
        <el-main class="main">
          <div class="top-list-top">
            <div class="m-into">
              <div class="cover">
                <img width="150px" height="150px" :src="topList.coverImgUrl" alt="">
              </div>
              <div class="cnt">
                <div class="cntc m-into">
                    <div class="hd"><h2>{{ topList.name }}</h2></div>
                    <div class="user">最近更新: {{ formatTime(topList.updateTime) }}</div>
                    <div class="btns">
                      <el-button class="play" @click="musicStore.addToPlaylist(listDetail)">
                        <img src="../../assets/播放.png" alt="" width="18px" height="18px">
                        播放
                      </el-button>
                      <el-button type="danger" @click="scrollToComment">
                        <img src="../../assets/消息.png" alt="" width="18px" height="18px">
                        ({{ topList.commentCount }})
                      </el-button>
                    </div>
                </div>
              </div>
            </div>
          </div>
          <div class="top-list-list" v-loading="loading">
            <div class="list-top">
              <h3><span class="list-title">歌曲列表</span></h3>
              <span class="list-count">{{topList.trackCount}}首歌</span>
              <div class="play-count">播放
                <strong id="play-count">{{formatPlayCount(topList.playCount)}}</strong>
                次
              </div>
            </div>
            <table class="list">
              <thead>
                <tr>
                  <th class="number">序号</th>
                  <th class="music-title">标题</th>
                  <th class="duration">时长</th>
                  <th class="singer">歌手</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in listDetail" :key="item.id" :class="index % 2 === 0 ? 'even' : 'odd'">
                  <td>
                    <div class="td-number">
                      <span class="num">{{ index+1 }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="td-music-title">
                      <img src="" alt="">
                      <div class="music-name">
                        <img src="../../assets/播放.png" alt="" width="18px" height="18px" @click="musicStore.handleMusic(item.id)">
                        <a @click="musicStore.handleMusic(item.id)">
                        {{ item.name }}
                        <span class="tag" v-if="item.alia && item.alia[0]">-{{ item.alia[0] }}</span>
                        </a>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="td-duration">
                      <span class="dur">{{ formatDuration(item.dt) }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="td-singer">
                      <span v-for="(artist, index) in item.ar" :key="artist.id">
                        <a @click="musicStore.handleSinger(artist.id)">{{ artist.name }}</a>
                        <span v-if="index < item.ar.length - 1"> / </span>
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
                    <img src="../../assets/点赞.png" alt="点赞" class="like-icon">
                    {{ item.likedCount }}
                  </div>
                </div>
              </div>
            </div>
            </div>
        </el-main>
         
    </el-container>
     </el-container>
     <el-backtop 
        :right="30" 
        :bottom="100"
        class="back-to-top"
        >
          <div class="backtop-content"> 
          <img src="../../assets/箭头 上.png" alt="回到顶部" width="24"> 
          </div> 
        </el-backtop>
    </div>
  <Footer></Footer>
</template>

<script setup>
import {  getTopListDetails, getListComment,getListDetails } from '@/api/music.js'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMusicStore } from '@/store/music.js'
import Aside from '@/components/Aside.vue'
import Footer from '../../components/Footer.vue'
const musicStore = useMusicStore()
const route = useRoute()
const loading = ref(true)

// 格式化播放次数
const formatPlayCount = (count) => {
  return count > 10000 ? `${Math.floor(count/10000)}万` : count
}

// 格式化时长（毫秒 -> 分:秒）
const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = ((ms % 60000) / 1000).toFixed(0)

  return `0${minutes}:${seconds.padStart(2, '0')}`
}



// 获取对应排行榜信息
const topList = ref({ tracks: [] })
const getTopMusicList = async (id) => {
  loading.value = true
  const res = await getTopListDetails(id)
  topList.value = res.data.playlist
  loading.value = false
}

// 获取所有歌曲
const listDetail = ref([])
const getMusicList = async (id) => {
  const res = await getListDetails(id)
  // listDetail.value = [].concat(...res.data.songs)
  listDetail.value = res.data.songs
  // console.log(listDetail.value)
}

// 格式化时间戳为 MM 月 DD 日 格式
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${month}月${day}日`
}

// 获取评论
const commentList = ref([])
const getCommentList = async (id) => {
  loading.value = true
  const res = await getListComment(id)
  commentList.value = res.data.comments
  loading.value = false
}

// 监听 URL 中 id 的变化
watch(() => route.query.id, (newId) => {
  const id = newId || '19723756'
  getTopMusicList(id)
  getCommentList(id)
  getMusicList(id)
}, {
  immediate: true
})

// 添加滚动到评论区域的方法
const scrollToComment = () => {
  const commentSection = document.getElementById('comment-section')
  if (commentSection) {
    commentSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style lang="less" scoped>
.common-layout {
  width: 980px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: auto; /* 启用内部滚动 */
  scrollbar-width: none; /* Firefox隐藏滚动条 */
  -ms-overflow-style: none; /* IE/Edge隐藏滚动条 */
}
.common-layout::-webkit-scrollbar {
  display: none; /* Chrome/Safari隐藏滚动条 */
}

.outer-container {
  min-height: 100%; /* 修改为100% */
  display: flex; /* 添加flex布局 */
}

.inner-container {
  flex: 1; /* 填充剩余空间 */
  display: flex; /* 添加flex布局 */
}

.aside {
  border: 1px solid #E3E3E3;
  height: auto; /* 高度自适应 */
}

.main {
  min-height: calc(100vh - 60px); /* 确保内容高度足够 */
}
.list-top, .comment-top{
  height: 33px;
  border-bottom: 2px solid #c20c0c;
  padding-bottom: 2px;
}
.comment-top{
    margin-top: 20px;
}
.list-top .list-title{
  float: left;
  margin-top: 9px;
}
.list-top .list-count{
  float: left;
  margin: 15px 0 0 20px;
}
.list-top .play-count{
  float: right;
  margin: 15px 0 0 20px;
}
h3 {
  font-size: 20px;
  line-height: 28px;
}
.top-list-top{
  padding: 40px;
  .m-into{
    // 修改此处，移除负外边距，使用 flex 布局
    display: flex;
    align-items: flex-start;
    margin: 0;
    .cover {
      margin-right: 20px; // 添加图片与内容的间距
    }
    .cnt{
      // 移除浮动和宽度设置
      float: none;
      width: auto;
      margin-top: 5px;
      .cntc{
        margin-left: 0; // 移除左侧外边距
        display: flex; // 添加 flex 布局
        flex-direction: column; // 设置垂直排列
      }
      h2{
        line-height: 24px;
        font-size: 20px;
        font-weight: normal;
      }
      .user{
        margin: 0 0 20px;
        line-height: 35px;
      }
      .btns {
        margin-bottom: 25px;
        margin-right: -10px;
        .play{
          background-color: #2374C2;
          color: #fff;
        }
      }
    }
  }
}
.list{
  width: 100%;
  border: 1px solid #d9d9d9;
  th{
    height: 38px;
    background-color: #f7f7f7;
    background-position: 0 0;
    background-repeat: repeat-x;
  }
  td{
    padding: 6px 10px;
    line-height: 18px;
    text-align: left;
  }
  .number{
    width: 77px;
  }
  .music-title{
    height: 18px;
    line-height: 18px;
    padding: 8px 10px;
    background-position: 0 -56px;
  }
  .duration{
    width: 91px;
  }
  .singer{
    width: 26%;
  }
  .td-number{
    float: left;
    width: 25px;
    margin-left: 0;
    text-align: center;
    color: #999;
  }
  .td-music-title{
    .music-name{
      float: left;
      width: 100%;
      a{
        color: #000;
        font-weight: normal;
        cursor: pointer;
      }
      img{
        padding-right: 5px;
        cursor: pointer;
      }
      .tag{
        color: #aeaeae;
      }
    }
  }
  .dur{
    line-height: 18px;
    text-align: left;
  }
  .s-name{
    width: 100%;
    position: relative;
    zoom: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .list tbody tr{ 
    height: 30px; 
  } 
  tbody tr.odd {
    background-color: #f7f7f7;
  }
  tbody tr.even {
    background-color: #ffffff;
  }
}


.music-name {
  display: flex;
  align-items: center;
  gap: 8px; // 设置播放按钮和歌名之间的间距
}

.music-name img {
  vertical-align: middle; // 确保图片垂直居中
}
.m-cmmt .head, .m-cmmt .head img
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
.btns {
  .el-button {
    border-radius: 4px;
    padding: 8px 15px;
    background-color: #f7f7f7;
    border-color: #ECECEC;
    color: #000;
    font-size: 12px;
    img{
      padding-right: 5px;
    }
  }
}
.td-singer{
  a{
    color: #000;
  }
  cursor: pointer;
}
.back-to-top {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f2f2f2;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: #e6e6e6;
  }
  
  .backtop-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.main {
  // 移除以下两行代码
  // height: calc(100vh - 60px); /* 根据实际布局调整 */
  // overflow-y: auto;
  position: relative;
}
</style>
