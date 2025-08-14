<template>
    <div class="page-container">
    <div class="singer-page">
      <!-- 左侧分类导航 -->
      <div class="category-sidebar">
        <div class="category-group">
          <h3 class="category-title">推荐</h3>
          <ul class="category-list">
            <li><router-link to="/discover/singerlist/singerlist" exact-active-class="active">推荐歌手</router-link></li>
            <li><router-link to="/discover/singerlist/signed" exact-active-class="active">入驻歌手</router-link></li>
          </ul>
        </div>

        <div class="category-group">
          <h3 class="category-title">华语</h3>
          <ul class="category-list">
            <li @click="handleChange(7,1)"><router-link to="/discover/singerlist/cat/1001" exact-active-class="active">华语男歌手</router-link></li>
            <li @click="handleChange(7,2)"><router-link to="/discover/singerlist/cat/1002" exact-active-class="active">华语女歌手</router-link></li>
            <li @click="handleChange(7,3)"><router-link to="/discover/singerlist/cat/1003" exact-active-class="active">华语组合/乐队</router-link></li>
          </ul>
        </div>

        <div class="category-group">
          <h3 class="category-title">欧美</h3>
          <ul class="category-list">
            <li @click="handleChange(96,1)"><router-link to="/discover/singerlist/cat/2001" exact-active-class="active">欧美男歌手</router-link></li>
            <li @click="handleChange(96,2)"><router-link to="/discover/singerlist/cat/2002" exact-active-class="active">欧美女歌手</router-link></li>
            <li @click="handleChange(96,3)"><router-link to="/discover/singerlist/cat/2003" exact-active-class="active">欧美组合/乐队</router-link></li>
          </ul>
        </div>

         <div class="category-group">
          <h3 class="category-title">日本</h3>
          <ul class="category-list">
            <li @click="handleChange(8,1)"><router-link to="/discover/singerlist/cat/6001" exact-active-class="active">日本男歌手</router-link></li>
            <li @click="handleChange(8,2)"><router-link to="/discover/singerlist/cat/6002" exact-active-class="active">日本女歌手</router-link></li>
            <li @click="handleChange(8,3)"><router-link to="/discover/singerlist/cat/6003" exact-active-class="active">日本组合/乐队</router-link></li>
          </ul>
        </div>

         <div class="category-group">
          <h3 class="category-title">韩国</h3>
          <ul class="category-list">
            <li @click="handleChange(16,1)"><router-link to="/discover/singerlist/cat/7001" exact-active-class="active">韩国男歌手</router-link></li>
            <li @click="handleChange(16,2)"><router-link to="/discover/singerlist/cat/7002" exact-active-class="active">韩国女歌手</router-link></li>
            <li @click="handleChange(16,3)"><router-link to="/discover/singerlist/cat/7003" exact-active-class="active">韩国组合/乐队</router-link></li>
          </ul>
        </div>

         <div class="category-group">
          <h3 class="category-title">其他</h3>
          <ul class="category-list">
            <li @click="handleChange(0,1)"><router-link to="/discover/singerlist/cat/4001" exact-active-class="active">其他男歌手</router-link></li>
            <li @click="handleChange(0,2)"><router-link to="/discover/singerlist/cat/4002" exact-active-class="active">其他女歌手</router-link></li>
            <li @click="handleChange(0,3)"><router-link to="/discover/singerlist/cat/4003" exact-active-class="active">其他组合/乐队</router-link></li>
          </ul>
        </div>
      </div>

      <!-- 右侧歌手展示区域 -->
      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
   <Footer></Footer>
</template>

<script setup>
import { useArtistStore } from '@/store/artist.js'
import Footer from '@/components/Footer.vue'

const artistStore = useArtistStore()

// 处理切换
function handleChange(newArea,newType) {
  artistStore.setArea(newArea)
  artistStore.setType(newType)
}

</script>

<style lang="less" scoped>
.page-container {
  width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
}

.singer-page {
  display: flex;
}

// 左侧分类导航
.category-sidebar {
  width: 240px;
  background-color: #fafafa;
  padding: 20px 0;
  margin-right: 30px;
  border-radius: 4px;
}

.category-group {
  margin-bottom: 20px;
  padding: 0 20px;
}

.category-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-list li {
  padding: 8px 0;
  color: black;
  cursor: pointer;
  transition: color 0.2s;
}

.category-list a {
  color:#333;
}

.category-list a:hover {
  color: #c20c0c;
}

// 添加active样式
.category-list a.active,
.category-list a.router-link-exact-active {
  color: #c20c0c !important;
  font-weight: bold !important;
}


</style>