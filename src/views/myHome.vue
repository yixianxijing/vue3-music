<template>
  <div class="common-layout">
    <el-container>
      <el-container>
        <el-main>
            <div class="left-part">
              <div class="r-user">
                <div class="user-info">
                  <img :src="detailList.avatarUrl" alt="" @click="musicStore.handleHome(id)">
                  <div class="info-right">
                    <div class="name">
                      <span @click="musicStore.handleHome(id)">{{ detailList.nickname }}</span>
                    </div>
                    <div class="u-box">
                      <ul>
                        <li>
                          <em id="event-count">{{ detailList.eventCount }}</em>
                          <i>动态</i>
                        </li>
                        <li>
                          <em id="event-count">{{ detailList.follows }}</em>
                          <i>关注</i>
                        </li>
                        <li>
                          <em id="event-count">{{ detailList.followeds }}</em>
                          <i>粉丝</i>
                        </li>
                      </ul>
                    </div>
                    <div class="area">
                        <span>所在地区：{{ getAreaName(detailList.city) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="top-list-list" v-if="id === userStore.uid">
            <div class="list-top">
              <h3><span class="list-title">最近收听</span></h3>
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
                <tr v-for="(item, index) in recentList" :key="item.song.id" :class="index % 2 === 0 ? 'even' : 'odd'">
                  <td>
                    <div class="td-number">
                      <span class="num">{{ index+1 }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="td-music-title">
                      <img src="" alt="">
                      <div class="music-name">
                        <img src="../assets/播放.png" alt="" width="18px" height="18px">
                        <a @click="musicStore.handleMusic(item.song.id)">
                        {{ item.song.name }}
                        <span class="tag" v-if="item.song.alia && item.song.alia[0]">-{{ item.song.alia[0] }}</span>
                        </a>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="td-duration">
                      <span class="dur">{{ formatDuration(item.song.dt) }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="td-singer">
                      <span v-for="(artist, index) in item.song.ar" :key="artist.id">
                        <a @click="musicStore.handleSinger(artist.id)">{{ artist.name }}</a>
                        <span v-if="index < item.song.ar.length - 1"> / </span>
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="list-top">
              <h3><span class="list-title">我创建的歌单</span></h3>
            </div>
          <ul class="four-by-one-list">
            <li v-for="item in usercMusicList" :key="item.id">
              <div class="img-container">
                <img :src="item.coverImgUrl" style="width: 110px; height: 110px;" @click="musicStore.handlePlaylist(item.id)"/>
                <div class="recommend-list-bottom">
                  <span><img src="../assets/耳机.png" alt=""></span>
                  <span class="pc">{{ formatPlayCount(item.playCount) }}</span>
                  <span class="bf"><img src="../assets/播放.png" alt="播放"></span>
                </div>
              </div>
              <div class="bottom-sen">
                <span class="li-sen">
                  <a @click="musicStore.handleMyList(item.id)">{{ item.name }}</a>
                </span>
              </div>
            </li>
          </ul>
          <div class="list-top" v-if="id === userStore.uid">
              <h3><span class="list-title">我收藏的歌单</span></h3>
          </div>
          <ul class="four-by-one-list">
            <li v-for="item in usersMusicList" :key="item.id">
              <div class="img-container">
                <img :src="item.coverImgUrl" style="width: 110px; height: 110px;" @click="musicStore.handlePlaylist(item.id)"/>
                <div class="recommend-list-bottom">
                  <span><img src="../assets/耳机.png" alt=""></span>
                  <span class="pc">{{ formatPlayCount(item.playCount) }}</span>
                 <span class="bf"><img src="../assets/播放.png" alt="播放"></span>
                </div>
              </div>
              <div class="bottom-sen">
                <span class="li-sen">
                  <a @click="musicStore.handleMyList(item.id)">{{ item.name }}</a>
                </span>
              </div>
            </li>
          </ul>
        </el-main>            
      </el-container>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getUserList, getRecentSong } from '../api/music'
import { getUserDetail } from '../api/user.js'
import { useUserStore } from '../store/index.js'
import { useMusicStore } from '../store/music.js'
import provinces from '@/assets/provinces.json'
import cities from '@/assets/cities.json' 
import { useRoute } from 'vue-router'   
const userStore = useUserStore()
const musicStore = useMusicStore()
const route = useRoute()
const id = ref(route.query.id || '1726312759')
// 获取用户详情
const detailList = ref([])
const getDetailList = async () =>{
  const res = await getUserDetail(id.value)
  detailList.value = res.data.profile
  console.log(detailList.value)
}

getDetailList()
// 匹配地区
const getAreaName = (code) => {
  if (!code) return ''
  
  // 提取省代码(前2位)和市代码(前4位)
  const provinceCode = code.toString().substring(0, 2) 
  const cityCode = code.toString().substring(0, 4)
  
  // 查找省份
  const province = provinces.find(p => p.code === provinceCode)
  // 查找城市
  const city = cities.find(c => c.code === cityCode)
  
  // 组合结果
  if (province && city) {
    return `${province.name}-${city.name}`
  } else if (province) {
    return province.name
  }

  return '未知地区'
}

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

// 获取用户歌单
const usercMusicList = ref([]) 
const usersMusicList = ref([])
const getUsersList = async (id) => {
  const res = await getUserList(id)
  res.data.playlist.forEach(element =>{
    if(element.creator.userId == id){
      usercMusicList.value.push(element)
    }
    else{
      usersMusicList.value.push(element)
    }
  })
  console.log(usercMusicList.value)
}



// 获取最近听
const recentList = ref([])
const getRecentList = async () =>{
  const res = await getRecentSong(userStore.uid)
  recentList.value = res.data.weekData.slice(0,10)
  console.log(   recentList.value)
}

getRecentList(id.value)

// 监听 URL 中 id 的变化
watch(() => route.query.id, (newId) => {
  id.value = newId || '1726312759'
  getUsersList(id.value)
  getRecentList(id.value)
}, {
  immediate: true
})
</script>

<style lang="less" scoped>
.common-layout {
  width: 980px;
  margin: 0 auto;
  height: 100vh;
  position: relative;
}
.left-part {
  padding: 20px 10px 10px 10px;
  .r-user {
    position: relative;
    height: auto;
    text-align: left;
    .user-info {
      display: flex;
      align-items: flex-start;
      width: 100%;
      height: auto;
      padding: 3px;
      background: #fff;
      margin-bottom: 10px;
      
      img {
        width: 187px;
        height: 187px;
        padding: 2px;
        background: #fff;
        border: 1px solid #dadada;
        margin: 0;
        cursor: pointer;
        margin-right: 20px;
      }
      
      .info-right {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        
        .name {
          padding: 10px 0;
          margin-bottom: 0;
          border-bottom: 1px solid #ddd;
          span {
            display: block;
            margin-top: 3px;
            font-size: 22px;
            font-weight: normal;
            line-height: 30px;
          }
        }
        
        .u-box {
          margin-top: 10px; // 与name保持间距
          ul {
            display: flex;
            justify-content: flex-start;
            list-style: none;
            padding: 0;
            margin: 0;
            
            li {
              display: flex;
              flex-direction: column;
              align-items:start;
              margin: 0 10px 0 0;
              border-left: 1px solid #c2c2c2;
              flex: none;
              width: 50px;
              padding-left: 10px;
              
              &:first-child {
                border-left: none;
                padding-left: 0;
              }
              
              em {
                font-size: 20px;
                font-family: Arial;
                font-style: normal;
              }
              
              i {
                font-size: 12px;
                padding-top: 4px;
                display: inline;
                white-space: nowrap;
                font-style: normal;
              }
            }
          }
        }
        .area{
            margin-top: 10px;
        }
      }
    }
  }
}

.el-main {
  border: 1px solid #E3E3E3;
}

.el-aside {
  border: 1px solid #E3E3E3;
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
.list-top{
    height: 33px;
  border-bottom: 2px solid #c20c0c;
  padding-bottom: 2px;
}
.list-top .list-title{
  float: left;
  margin-top: 9px;
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
a{
  color: #000;
  font-weight: normal;
  cursor: pointer;
}
.four-by-one-list li img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.album-name a{
  display: block;
  font-size: 12px;
  color: #000;
  margin-top: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.album-artist a{
  display: block;
  font-size: 12px;
  color: #666;
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
a{
  color: #000;
}
.four-by-one-list li img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 底部区域（绝对定位在图片内部底部） */
.list-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 27px;
  background: rgba(0, 0, 0, 0.518);
  display: flex;
  align-items: center;
  font-size: 12px;
  color: white;
}
.list-bottom span img { 
  width: 16px; /* 缩小图片宽度 */ 
  height: 16px; /* 缩小图片高度 */ 
  margin-left: 5px; /* 让图片距离左侧有一定间距 */ 
} 
.pc{
  padding: 0 5px;
  font-size: 10px;
  color: #cdcdcd;
}
.list-bottom .bf {
  margin-left: auto;
  cursor: pointer;
}
/* 调整标题区域与图片间距 */
.bottom-sen {
  width: 110px;
  margin-top: 8px;
  font-size: 12px;
}
.four-by-two-list li .img-container { 
  position: relative;
  width: 110px;
  height: 110px;
}
.four-by-one-list{
  display: flex;
  flex-wrap: wrap;
  overflow-x: hidden;
}
.four-by-one-list li{
  margin: 15px 0 30px 22px;
  box-sizing: border-box;
}
.four-by-one-list li .img-container {
  position: relative;
  width: 110px;
  height: 110px;
}
.recommend-list-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 27px;
  background: rgba(0, 0, 0, 0.518);
  display: flex;
  align-items: center;
  font-size: 12px;
  color: white;
}

.recommend-list-bottom span img { 
  width: 16px; /* 缩小图片宽度 */ 
  height: 16px; /* 缩小图片高度 */ 
  margin-left: 5px; /* 让图片距离左侧有一定间距 */ 
} 

.recommend-list-bottom .pc {
  padding: 0 5px;
  font-size: 10px;
  color: #cdcdcd;
}

.recommend-list-bottom .bf {
  margin-left: auto;
  cursor: pointer;
}
</style>