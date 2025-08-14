<template>
    <div class="banner" v-loading="loading">
  <el-carousel :interval="5000" arrow="always" class="w" indicator-type="dots">
    <el-carousel-item v-for="item in bannerList" :key="item.id">
      <img :src="item.bigImageUrl" alt="Album Cover" class="banner-image"/>
    </el-carousel-item>
  </el-carousel>
  </div>
  <div class="discover-module w">
    <div class="module">
      <div class="lm">
        <div class="lm-m1" v-loading="loading">
          <div class="hot-head">
            <img src="../../assets/圆圈.png" alt="">
            <router-link to="/discover/playlist"><em>热门推荐</em></router-link>
            <div class="tab">
              <ul class="tab-ul">
                <li><router-link to="/discover/playlist/?cat=华语&page=1&hot=true">华语</router-link></li>
                <li><router-link to="/discover/playlist/?cat=流行&page=1&hot=true">流行</router-link></li>
                <li><router-link to="/discover/playlist/?cat=摇滚&page=1&hot=true">摇滚</router-link></li>
              </ul>
            </div>
          </div>
          <ul class="four-by-two-list">
            <li v-for="item in hotMusicList" :key="item.id">
              <div class="img-container">
                <img :src="item.coverImgUrl" style="width: 110px; height: 110px;" @click="musicStore.handlePlaylist(item.id)"/>
                <div class="list-bottom">
                  <span><img src="../../assets/耳机.png" alt=""></span>
                  <span class="pc">{{ formatPlayCount(item.playCount) }}</span>
                  <span class="bf"><img src="../../assets/播放.png" alt="播放" @click="musicStore.handlePlaylist(item.id)"></span>
                </div>
              </div>
              <div class="bottom-sen">
                <span class="li-sen"><a @click="musicStore.handlePlaylist(item.id)">{{ item.name }}</a></span>
              </div>
            </li>
          </ul>
          
        </div>
        <div class="lm-m2" v-loading="loading">
          <div class="recommend-head">
            <img src="../../assets/圆圈.png" alt="">
            <span class="title">个性化推荐</span>
            </div>
          <ul class="four-by-one-list">
            <li v-for="item in recommendList" :key="item.id">
              <div class="img-container">
              <img :src="item.picUrl" style="width: 110px; height: 110px;" @click="musicStore.handlePlaylist(item.id)"/>
                <div class="recommend-list-bottom">
                  <span><img src="../../assets/耳机.png" alt=""></span>
                  <span class="pc">{{ formatPlayCount(item.playCount) }}</span>
                  <span class="bf"><img src="../../assets/播放.png" alt="播放" @click="musicStore.handlePlaylist(item.id)"></span>
                </div>
              </div>
              <div class="bottom-sen">
                <span class="li-sen">
                  <a @click="musicStore.handlePlaylist(item.id)">{{ item.name }}</a>
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div class="lm-m3" v-loading="loading">
          <div class="new-album-head">
            <img src="../../assets/圆圈.png" alt="">
            <span class="title">新碟上线</span>
          </div>
            <el-carousel arrow="always" trigger="click" height="160px" indicator-type="dot">
              <el-carousel-item v-for="items in newAlbumList" :key="items[0].id">
                <ul class="five-by-one-list">
                  <li v-for="item in items" :key="item.id">
                    <img :src="item.picUrl" alt="" @click="musicStore.handleAlbum(item.id)">
                    <!-- 在图片下方添加碟片名称 -->
                    <span class="album-name"><a @click="musicStore.handleAlbum(item.id)">{{ item.name }}</a></span>
                    <!-- 添加显示歌手名称的文字 -->
                    <span class="album-artist"><a @click="musicStore.handleSinger(item.artist.id)">{{ item.artist.name }}</a></span>
                  </li>
                </ul>
              
              </el-carousel-item>
            </el-carousel>
        </div>
        <div class="lm-m4" v-loading="loading">
          <div class="new-album-head">
            <img src="../../assets/圆圈.png" alt="">
            <span class="title"><router-link to="/discover/toplist">榜单</router-link></span>
          </div>
          <!-- 添加 flex 容器 -->
          <div class="toplist-container">
            <dl class="blk" v-for="(item, index) in topListName" :key="item.id">
              <dt class="top">
                <div class="b-cover">
                  <!-- 设置图片大小为 80*80 -->
                  <img :src="item.coverImgUrl" alt="" style="width: 60px; height: 60px;">
                </div>
                <div class="b-title">
                  <a @click="musicStore.handleList(item.id)">{{ item.name }}</a>
                  <img src="../../assets/播放.png" alt="播放" />
                </div>
              </dt>
              <dd>
                <ol>
                  <li v-for="(songs,songsIndex) in topList[index]" :key="songs.id">
                    <span class="song-index">{{ songsIndex + 1 }}</span>
                    <a @click="musicStore.handleMusic(songs.id)">{{ songs.name }}</a>
                  </li>
                  <li class="see-all">
                    <a @click="handleAll(item.id)">查看全部></a>
                  </li>
                </ol>
              </dd>
            </dl>
          </div>
        </div>
      </div>
       <div class="rm">
      <!-- 入驻歌手区域 - 根据登录状态显示不同内容 -->
      <div class="singer-area">

        <!-- 未登录状态 -->
        <div v-if="!isLogin" class="login-prompt">
          <div class="vip-banner">
            <h4>黑胶VIP</h4>
            <p>立享超21项专属特权</p>
            <button class="vip-btn">优惠购买</button>
          </div>
          <div class="login-info">
            <p>登录网易云音乐，可以享受无限收藏的乐趣，并且无限同步到手机</p>
            <button class="login-btn"  @click="openLoginDialog">用户登录</button>
          </div>
        </div>

        <!-- 登录状态 -->
        <div v-else class="user-profile">
          <div class="vip-banner">
            <h4>黑胶VIP</h4>
            <p>立享超21项专属特权</p>
            <button class="vip-btn">优惠购买</button>
          </div>
          <div class="user-info">
            <div class="avatar-container">
              <img :src="userAvatar" alt="用户头像" class="user-avatar">
              <div class="user-level">
                <span>{{ userinfo.profile.nickname || '游客' }}</span>
                <span class="level-tag">Lv.{{ userinfo.level || 0 }}</span>
              </div>
            </div>
            <button class="sign-in-btn">签到</button>
            <div class="user-stats">
              <div class="stat-item">
                <span>{{ userStore.dynamicCount || 0 }}</span>
                <span>动态</span>
              </div>
              <div class="stat-item">
                <span>{{ userinfo.profile.followeds || 0 }}</span>
                <span>关注</span>
              </div>
              <div class="stat-item">
                <span>{{ userinfo.profile.follows || 0 }}</span>
                <span>粉丝</span>
              </div>
            </div>
          </div>
        </div>
        <div class="singer-all">
        <div class="singer-header">
          <h3>入驻歌手</h3>
          <router-link to="/discover/singerlist" class="view-all">查看全部</router-link>
        </div>

        <!-- 入驻/热门歌手列表 -->
        <div class="singer-list">
          <div v-if="isLoading" class="loading-tip">加载中...</div>
          <ul v-else>
            <li v-for="artist in topArtists" :key="artist.id" class="singer-item">
              <div class="singer-avatar">
                <img :src="artist.img1v1Url" alt="{{ artist.name }}" @click="musicStore.handleSinger(artist.id)">
              </div>
              <div class="singer-info">
                <h4 class="singer-name"><a @click="musicStore.handleSinger(artist.id)">{{ artist.name }}</a></h4>
                <p class="singer-desc">{{ artist.alias.length > 0 ? artist.alias[0] : '暂无简介' }}</p>
              </div>
            </li>
             <li class="apply-musician">
              <button class="apply-btn">申请成为网易音乐人</button>
            </li>
          </ul>
        </div>
        </div>
      </div>
    </div>
    </div>
  </div>
  <LoginDialog ref="loginDialogRef" />
  <div class="footer">
    <Footer></Footer>
  </div>
</template>

<script setup>
import { getNewMusic, getMusicList, getRecommendMusicList, getNewAlbum, getTop, getTopListDetails} from '../../api/music.js'
import {ref, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import Footer from '../../components/Footer.vue'
import { useMusicStore } from '@/store/music.js'
import { useUserStore } from '@/store/index.js'
import { getHotArtists } from '@/api/artist.js'
import { storeToRefs } from 'pinia'

const loading = ref(true)
const musicStore = useMusicStore()
const userStore = useUserStore()
const { isLogin, userAvatar,userinfo } = storeToRefs(userStore)
const router = useRouter()
// 获取新歌歌单
const num = ref(7)
const bannerList = ref([])
const getMusic = async () =>{
  loading.value = true 
  const res = await getNewMusic(num.value)
  bannerList.value = res.data.banners
  console.log(bannerList.value)
  loading.value = false
}
//getMusic()

// 获取热门歌单
const hotMusicList = ref([])
const getHotMusicList = async () => {
  loading.value = true
  const res = await getMusicList()
  hotMusicList.value = res.data.playlists.slice(0,8)
  // console.log(hotMusicList.value)
  loading.value = false
}

//getHotMusicList()
// 格式化播放量
const formatPlayCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(count % 10000 === 0 ? 0 : 1) + '万'
  }

  return count
}

// 获取推荐歌单
const recommendList = ref([])
const getReMusicList = async () => {
  loading.value = true
  const res = await getRecommendMusicList()
  recommendList.value = res.data.result
  // console.log(recommendList.value)
  loading.value = false
}

//getReMusicList()
// 获取新碟上架
const newAlbumList = ref([])
const getNewAlbumList = async () =>{
  loading.value = true
  const res = await getNewAlbum()
  newAlbumList.value[0] = res.data.weekData.slice(0,5)
  newAlbumList.value[1] = res.data.weekData.slice(5,10)
  // console.log(newAlbumList.value)
  loading.value = false
  
}

//getNewAlbumList()
// 获取榜单
const topListName = ref([])
const topList = ref([])
const getTopListName = async () =>{
  loading.value = true
  const res = await getTop()
  topListName.value = res.data.list.slice(0,3)
  // console.log(topListName.value)
  for (const [index, item] of topListName.value.entries()) {
    // console.log(item.id)
    const res = await getTopListDetails(item.id)
    topList.value[index] = res.data.playlist.tracks.slice(0,10)
  }

  // console.log(topList.value)
  loading.value = false
}
//getTopListName()

// 查看全部
const handleAll = (id) =>{
  router.push(`/discover/toplist?id=${id}`)
}

// 登录跳转
const loginDialogRef = ref(null)
const openLoginDialog = () => {
  loginDialogRef.value.openLoginDialog()
}

// 获取热门歌手列表
const topArtists = ref([])
const isLoading = ref(false)
const getTopArtistsData = async () => {
  isLoading.value = true
  try {
    const res = await getHotArtists(13, 0)
    // console.log(res)
    topArtists.value = res.data.artists
  } catch (error) {
    console.error('获取热门歌手失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 页面加载时获取热门歌手数据
onMounted(() => {
  getMusic()
  getHotMusicList()
  getReMusicList()
  getNewAlbumList()
  getTopListName()
  getTopArtistsData()
})

</script>

<style scoped>

.banner .el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 234px;
  margin: 0;
  text-align: center;
}

.banner .el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.banner .el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.banner-image {
  width: 100%;
  height: 300px;
}
/* 热门推荐 */
.module{
    /* 修改为 flex 布局 */
    display: flex;
    width: 100%;
}
.lm {
    width: 729px;
}
.rm {
    width: 175px; /* 与榜单项宽度一致 */
}
em, .title {
    color: black;
    font-style: normal;
    float: left;
    font-size: 20px;
    font-weight: normal;
    line-height: 28px;
}
.hot-head, .recommend-head, .new-album-head {
  display: flex;          
  align-items: center;
  height: 33px;
  padding: 0 10px 0 0; /* 将左内边距设置为 0，使内容向左靠齐 */
  background-position: -225px -156px;
  border-bottom: 2px solid #c10d0c;
}

.tab-ul{
  display: flex;         /* 保持flex布局 */
  margin: 0 0 0 20px;   /* 调整外边距 */
  padding: 0;           /* 清除默认padding */
  list-style: none;     /* 清除列表样式 */
  cursor: pointer;
}
.tab-ul li {
  position: relative;
  padding: 0px 15px; /* 通过上下padding控制盒子高度 */
  margin: 0;
  color: #666;
  line-height: 18px; /* 根据实际字体大小调整 */
}

.tab-ul li:not(:last-child) {
  border-right: 1px solid #ddd; /* 保持原始边框方式 */
}

/* 添加hover效果 */
.tab-ul li:hover {
  color: #333;
  text-decoration: underline;
}
.hot-head img, .recommend-head img, .new-album-head img{
  width: 18px;
  height: 18px;
}

.four-by-two-list { 
  display: flex;
  flex-wrap: wrap;
  margin: 0 -30px 0 -20px; /* 调整负边距，左边负边距变小，右边负边距变大 */
}

.four-by-two-list li { 
  width: calc(25% - 50px);
  margin: 15px 22px 30px;
  box-sizing: border-box;
}


/* 图片容器（保持正方形） */
.four-by-two-list li img, .four-by-one-list li img {
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
  margin: 0 -30px 0 -20px; /* 调整负边距，左边负边距变小，右边负边距变大 */
}
.four-by-one-list li{
  width: calc(25% - 50px);
  margin: 15px 22px 30px;
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
/* 新碟上线 */
.lm-m3 .el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 160px;
  margin: 0;
  text-align: center;
  border: 2px solid #fff;
}

.lm-m3 .el-carousel__item {
  background-color: #f5f5f5;;
}
.five-by-one-list{
  display: flex;
  flex-wrap: wrap;
}

.five-by-one-list li { 
  width: calc(20% - 20px); /* 一行显示 5 个，减去边距 */
  margin: 10px; /* 设置每个元素的外边距 */
  box-sizing: border-box; 
}

.five-by-one-list li img { 
  width: 100%; 
  height: auto; 
  display: block; 
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
/* 新碟上线 */
.lm-m3 .el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 184px;
  margin: 0;
  text-align: center;
  border: 2px solid #fff;
}

.lm-m3 .el-carousel__item {
  background-color: #f5f5f5;;
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
.blk ol{
  height: 319px;
  margin-left: 0; /* 减少左边距，让 li 元素向左移动 */
  line-height: 32px;
}
.blk span{
  margin-left: 20px;
  margin-right: 5px;
}
/* 添加样式让三个 dl 并排显示 */
.toplist-container {
  height: 472px;
  margin-top: 20px;
  padding-left: 5px;
  
}
.blk{
    float: left;
    width: 175px;
    border: 1px solid #E3E3E3;
    background-color: #F4F4F4;
}
.b-cover img{
  margin: 10px 5px 10px 10px;
}
.top {
      display: flex;
      align-items: center;
      gap: 10px; /* 设置图片和标题之间的间距 */
}
.b-title img{
  display: block;
    float: left;
    width: 22px;
    height: 22px;
    margin-right: 10px;
    text-indent: -9999px;
    cursor: pointer;
}
.blk li:nth-child(odd) {
    background-color: #E8E8E8;
}
.blk li {
    vertical-align: middle;
    width: 175px; /* 修改宽度为 175px */
    height: 32px;
    font-size: 12px;
    list-style: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left; /* 让文本向左对齐 */
    cursor: pointer;
}

.song-index {
    margin-right: 5px; /* 添加一些右边距，让数字和歌曲名称有间隔 */
    text-align: left; /* 让 span 元素内容向左对齐 */
}
.blk span:nth-child(1) { 
  color: #C93384; 
  font-weight: 3px;
} /* 第一个span */
.blk span:nth-child(2) {
   color: #CB0D0C; 
   font-weight: 2px;
} /* 第二个span */
.blk span:nth-child(3) {
   color: #C40D0C; 
   font-weight: 1px;
} /* 第三个span */

 .blk li:nth-child(n+4):nth-child(-n+10) .song-index { 
    color: rgb(102, 102, 102); 
  }
.see-all {
  width: 100%;
  text-align: right;
  list-style: none;
  border: 1px solid #E3E3E3;
}
.see-all a {
  color: #333;
  text-decoration: none;
  margin-left: 110px;
}
.see-all a:hover {
  text-decoration: underline;
}

/* 入驻歌手区域样式 */
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

.view-all {
  font-size: 12px;
  color: #666;
  text-decoration: none;
}
/* VIP banner样式 */
.vip-banner {
  background: linear-gradient(135deg, #FF7A7A 0%, #FF3838 100%);
  border-radius: 8px;
  padding: 15px;
  color: white;
  margin-bottom: 15px;
}

.vip-banner h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.vip-banner p {
  margin: 0 0 10px 0;
  font-size: 12px;
  opacity: 0.9;
}

.vip-btn {
  width: 100%;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  border-radius: 4px;
  color: white;
  padding: 5px 0;
  font-size: 14px;
  cursor: pointer;
}

/* 未登录状态样式 */
.login-info {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
}

.login-info p {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
}

.login-btn {
  width: 100%;
  background: #c10d0c;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 0;
  font-size: 14px;
  cursor: pointer;
}

/* 登录后用户信息样式 */
.user-info {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
}

.avatar-container {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.user-level {
  margin-left: 10px;
}

.user-level span {
  display: block;
  font-size: 14px;
}

.level-tag {
  font-size: 12px;
  color: #666;
  background: #e8e8e8;
  border-radius: 10px;
  padding: 0 5px;
  display: inline-block;
}

.sign-in-btn {
  width: 100%;
  background: #c10d0c;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 0;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 15px;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.stat-item span:first-child {
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.stat-item span:last-child {
  font-size: 12px;
  color: #666;
}

/* 歌手列表样式 */
.singer-list {
  margin-top: 15px;
}

.loading-tip {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
}

.singer-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.singer-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.singer-info {
  margin-left: 10px;
  flex: 1;
}

.singer-name {
  font-size: 14px;
  margin: 0 0 5px 0;
}

.singer-desc {
  font-size: 12px;
  color: #666;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 申请成为网易音乐人按钮样式 */
.apply-musician {
  padding: 15px 0 0;
}

.apply-btn {
  width: 100%;
  height: 36px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.apply-btn:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
}
a{
  cursor: pointer;
}
/* 全局覆盖走马灯指示器样式 */
:deep(.el-carousel__indicator) {
  padding: 12px 4px; /* 调整间距 */
}

:deep(.el-carousel__button) {
  width: 8px !important;
  height: 8px !important;
  border-radius: 50% !important;
  background-color: #c0c4cc !important; /* 默认状态颜色 */
}

:deep(.el-carousel__indicator.is-active .el-carousel__button) {
  background-color: #c10d0c !important; /* 激活状态颜色 */
}
</style>

