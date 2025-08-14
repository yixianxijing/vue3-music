<template>
  <div class="common-layout">
     <el-container class="outer-container">
        <el-main class="main">
          <div class="top-list-top">
            <div class="m-into">
              <div class="singer-name-container" v-if="singerInfo">
                <h1 class="main-name">{{ singerInfo.name }}
                  <span class="alias" v-if="singerInfo.alias && singerInfo.alias[0]">({{ singerInfo.alias[0] }})</span>
                </h1>
              </div>
              <div class="cover-container">
                <img width="640px" height="300px" :src="singerInfo.picUrl" alt="" class="singer-cover">
              </div>
              <div class="cnt">
                <div class="cntc m-into">
                    <div v-if="list" class="btns">
                      <el-button class="play">
                        <img src="../assets/播放.png" alt="" width="18px" height="18px" @click="musicStore.addToPlaylist(listDetail)">
                        播放
                      </el-button>
                    </div>
                </div>
              </div>
            </div>
          </div>
          <div class="top-list-list" v-loading="loading">
            <div class="list-top">
              <h3><span class="list-title">歌曲列表</span></h3>
            </div>
            <table class="list">
              <thead>
                <tr>
                  <th class="number">序号</th>
                  <th class="music-title">标题</th>
                  <th class="duration">时长</th>
                  <th class="singer">专辑</th>
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
                        <img src="../assets/播放.png" alt="" width="18px" height="18px" @click="musicStore.handleMusic(item.id)">
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
                      <span>
                        <a>{{ item.al.name }}</a>
                        <span v-if="index < item.al.length - 1"> / </span>
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-main>
        <el-aside width="240px" class="aside">
           <div class="singer-all">
        <div class="singer-header">
          <div class="singer-description" v-if="singerInfo">
                <h3>歌手简介</h3>
                <p>{{ singerInfo.briefDesc }}</p>
              </div>
        </div>
        </div>
        </el-aside>
        <el-backtop 
        target=".common-layout"  
        :right="30" 
        :bottom="100"
        class="back-to-top"
        >
          <div class="backtop-content"> 
          <img src="../assets/箭头 上.png" alt="回到顶部" width="24"> 
          </div> 
        </el-backtop> 
     </el-container>
  </div>
  <Footer></Footer>
</template>

<script setup>
import { getArtistMusic } from '@/api/artist.js'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMusicStore } from '@/store/music.js'
import Footer from '../components/Footer.vue'
const musicStore = useMusicStore()
const route = useRoute()
const loading = ref(true)

// 格式化时长（毫秒 -> 分:秒）
const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = ((ms % 60000) / 1000).toFixed(0)

  return `0${minutes}:${seconds.padStart(2, '0')}`
}


// 获取歌手单曲信息
const listDetail = ref([])
const singerInfo = ref([])
const getArtistMusicList = async (id) => {
  loading.value = true
  const res = await getArtistMusic(id)
  // listDetail.value = [].concat(...res.data.songs)
  listDetail.value = res.data.hotSongs
  singerInfo.value = res.data.artist
  //   console.log(listDetail.value)
  //   console.log(singerInfo.value)
  loading.value = false
}

// 监听 URL 中 id 的变化
watch(() => route.query.id, (newId) => {
  const id = newId || '2609726208'
  getArtistMusicList(id)
}, {
  immediate: true
})


</script>

<style lang="less" scoped>
.common-layout {
  width: 980px;
  margin: 0 auto;
  height: 100vh;
  overflow: auto; /* 确保外层容器可滚动 */
  position: relative; /* 添加相对定位 */
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
.list-top{
  height: 33px;
  border-bottom: 2px solid #c20c0c;
  padding-bottom: 2px;
}

.list-top .list-title{
  float: left;
  margin-top: 9px;
}
h3 {
  font-size: 20px;
  line-height: 28px;
}
.top-list-top{
  padding: 20px;
  .m-into{
    display: flex;
    flex-direction: column;
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
        margin: 10px 0 20px;
        line-height: 35px;
        display: flex;
        align-items: center;
        gap: 10px;  /* 增加头像与名字的距离 */
        img{
            width: 35px;
            height: 35px;
            border-radius: 50%;  /* 头像圆形化 */
        }
      }
      .creator{
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
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
.cover-container {
  position: relative;
  width: 648px;
  height: 300px;
}

.singer-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.singer-name-container {
  margin-bottom: 15px;
  text-align: center;
}
.main-name {
  font-size: 28px;
  color: #333;
  margin: 0;
}
.alias {
  font-size: 18px;
  color: #666;
  margin-left: 10px;
  font-weight: normal;
}
.singer-cover {
  display: block;
  margin: 0 auto;
}
.singer-description {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-top: none; /* 与照片底部无缝衔接 */
}

.singer-description h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
  font-weight: bold;
}

.singer-description p {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
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

.singer-area {
  width: 250px;
  padding: 15px;
  box-sizing: border-box; /* 添加盒模型设置 */
}

.singer-all {
  border: 1px solid #eee; 
  border-radius: 8px; 
  padding: 10px;
}

.singer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.singer-header h3 {
  font-size: 16px;
  color: #333;
  margin: 0;
}


.loading-tip {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
}

</style>
