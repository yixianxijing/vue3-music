<template>
  <div class="page-container">
    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="filter-content">
        <span class="filter-item active">全部</span>
        
        <!-- 分类下拉框 -->
        <el-select
          v-model="selectedCat"
          placeholder="选择分类"
          class="category-select"
          @change="handleCatChange"
        >
          <el-option :value="全部歌单">全部歌单</el-option>
          <el-option
            v-for="cat in allCategories"
            :key="cat.name"
            :label="cat.name"
            :value="cat.name"
            class="horizontal-option"
          />
        </el-select>
        
        <!-- 热门按钮 -->
        <el-button 
          class="hot-btn" 
          type="primary"
          @click="handleHotClick"
        >
          热门
        </el-button>
      </div>
    </div>

    <!-- 歌单列表 -->
    <div class="playlist-grid"  >
      <!-- 歌单卡片 -->
      <div 
        class="playlist-card" 
        v-for="playlist in currentPlaylists" 
        :key="playlist.id"
      >
        <!-- 封面 + 播放量 -->
        <div class="playlist-cover">
          <img :src="playlist.coverImgUrl" alt="歌单封面" class="cover-img" @click="musicStore.handlePlaylist(playlist.id)">
          <div class="play-count">
            <i class="iconfont icon-play"></i>
            <span>{{ formatPlayCount(playlist.playCount) }}</span>
          </div>
        </div>
        
        <!-- 歌单信息 -->
        <div class="playlist-info">
          <h3 class="playlist-title" @click="musicStore.handlePlaylist(playlist.id)">{{ playlist.name }}</h3>
          <p class="playlist-creator" @click="musicStore.handlePlaylist(playlist.id)">by {{ playlist.creator.nickname || '未知用户' }}</p>
        </div>
      </div>
    </div>

    <!-- 分页组件 -->
    <div class="pagination-container">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMusicList, getPlaylistCatlist } from '@/api/music.js'
import { useMusicStore } from '@/store/music.js'

const route = useRoute()
const router = useRouter()

const musicStore = useMusicStore()

// 状态管理
const selectedCat = ref('全部') // 选中的分类
const playlists = ref([])       // 所有歌单数据
const allCategories = ref([])   // 分类数据
const currentPage = ref(1)      // 当前页码
const pageSize = ref(30)         // 每页数量
const total = ref(0)            // 总数据量
const isHot = ref(true)         // 是否热门排序

// 从URL参数初始化状态
function initStateFromRoute() {
  const { cat = '全部', page = 1, hot = 'true' } = route.query
  selectedCat.value = cat
  currentPage.value = parseInt(page, 10)
  isHot.value = hot === 'true'
}

// 更新URL参数
function updateRouteParams() {
  router.push({
    path: '/discover/playlist',
    query: {
      cat: selectedCat.value,
      page: currentPage.value,
      hot: isHot.value.toString()
    }
  })
}


// 初始化数据
onMounted(() => {
  fetchCategories()
  initStateFromRoute()
  fetchPlaylists()
})

// 获取分类
async function fetchCategories() {
  try {
    const res = await getPlaylistCatlist()
    allCategories.value = res.data.sub || []
    console.log(res.data)
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

// 获取歌单（带分页）
async function fetchPlaylists() {
  try {
    const res = await getMusicList(
      isHot.value ? 'hot' : 'new',
      selectedCat.value,
      pageSize.value,
      (currentPage.value - 1) * pageSize.value // 计算 offset
    )

    playlists.value = res.data.playlists || []
    total.value = res.data.total || 0 
  } catch (error) {
    console.error('获取歌单失败:', error)
  }
}

// 分类切换
function handleCatChange() {
  currentPage.value = 1 // 切换分类重置页码
  updateRouteParams()
  // 手动触发一次数据获取，确保分类切换后能正确渲染
  fetchPlaylists()
}

// 热门按钮点击
function handleHotClick() {
  isHot.value = !isHot.value
  currentPage.value = 1
  updateRouteParams()
  // fetchPlaylists由路由监听触发
}

// 页码切换
function handlePageChange(newPage) {
  currentPage.value = newPage
  updateRouteParams()
  // 手动触发一次数据获取，确保页码切换后能正确渲染
  fetchPlaylists()
}

// 格式化播放量
function formatPlayCount(count) {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`
  }

  return count.toString()
}

// 当前页歌单（计算属性）
const currentPlaylists = computed(() => playlists.value)
</script>

<style scoped>
.page-container {
  width: 980px;
  margin: 0 auto;
  padding: 20px 0;
}

/* 筛选栏样式 */
.filter-bar {
  border-bottom: 1px solid #eee;
  padding: 15px 0;
  margin-bottom: 25px;
}
.filter-content {
  display: flex;
  align-items: center;
  gap: 20px;
}
.filter-item {
  padding: 5px 10px;
  cursor: pointer;
  color: #333;
}
.filter-item.active {
  color: #c00;
  font-weight: 500;
  border-bottom: 2px solid #c00;
}
.category-select {
  width: 120px;
}

.hot-btn {
  margin-left: auto;
  background-color: #c00;
  border-color: #c00;
}

/* 歌单网格布局 */
.playlist-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

/* 歌单卡片样式 */
.playlist-card {
  cursor: pointer;
  transition: transform 0.2s;
}
.playlist-card:hover {
  transform: translateY(-3px);
}
.playlist-cover {
  position: relative;
  width: 100%;
  padding-top: 100%; /* 正方形比例 */
  margin-bottom: 8px;
}
.cover-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}
.play-count {
  position: absolute;
  bottom: 5px;
  right: 5px;
  display: flex;
  align-items: center;
  gap: 3px;
  color: #fff;
  font-size: 12px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}
.icon-play {
  width: 14px;
  height: 14px;
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTcgMTlsNi00LTYtNHY4eiIvPjwvc3ZnPg==') no-repeat center;
  background-size: contain;
}

/* 歌单信息 */
.playlist-info {
  padding: 0 4px;
}
.playlist-title {
  font-size: 14px;
  line-height: 1.4;
  height: 2.8em; /* 两行文本高度 */
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}
.playlist-creator {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 分页样式 */
.pagination-container {
  display: flex;
  justify-content: center; 
  margin-top: 20px;
}
.el-pagination {
  --el-pagination-font-size: 14px;
  --el-pagination-button-active-bg-color: #c00;
  --el-pagination-button-active-color: #fff;
}

</style>