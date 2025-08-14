<template>
   <!-- 右侧歌手展示区域 -->
      <div class="singer-content">
        <!-- 入驻歌手 -->
        <div class="singer-section">
          <h2 class="section-title">入驻歌手</h2>
          <div class="singer-grid">
            <div class="singer-card" v-for="singer in ruArtists" :key="singer.id">
              <div class="singer-avatar" @click="handleSingerClick(singer.id)">
                <img :src="singer.img1v1Url" alt="{{ singer.name }}" class="avatar-img">
              </div>
              <span class="singer-name">{{ singer.name }}</span>
            </div>
          </div>
        </div>

        <!-- 热门歌手 -->
        <div class="singer-section">
          <h2 class="section-title">热门歌手</h2>
          <div class="singer-grid">
            <div class="singer-card" v-for="singer in hotArtists" :key="singer.id">
              <div class="singer-avatar" @click="handleSingerClick(singer.id)">
                <img :src="singer.img1v1Url" alt="{{ singer.name }}" class="avatar-img">
              </div>
              <span class="singer-name">{{ singer.name }}</span>
            </div>
          </div>
        </div>

         <!-- 新增歌手文本列表 -->
        <div class="divider"></div>
        <div class="singer-section">
          <div class="singer-text-grid">
            <div v-for="singer in artistList" :key="singer.id" class="singer-text-item">
              <span class="singer-text-name" @click="handleSingerClick(singer.id)">{{ singer.name }}</span>
            </div>
          </div>
        </div>

      </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getHotArtists, getArtistList } from '@/api/artist.js'

const router = useRouter()


// 状态管理
const hotArtists = ref([]) // 热门歌手
const artistList = ref([])
const ruArtists = ref([]) //入驻歌手
const artists = ref([])   // 分类歌手
const total = ref(0)      // 总数据量
const pageSize = ref(10)  // 每页数量

// 筛选条件
const type = ref(-1)    // 类型: -1全部, 1男歌手, 2女歌手, 3乐队
const area = ref(-1)    // 地区: -1全部, 7华语, 96欧美, 8日本, 16韩国, 0其他
const initial = ref(0) // 首字母: -1热门, A-Z

// 初始化数据
onMounted(() => {
  fetchHotArtists()
  fetchArtists()
  fetchRuArtists()
  fectchArtistList()
})

// 获取热门歌手
async function fetchHotArtists() {
  try {
    const res = await getHotArtists(10) // 获取前10个热门歌手
    hotArtists.value = res.data.artists || []
  } catch (error) {
    console.error('获取热门歌手失败:', error)
  }
}

async function fectchArtistList() {
  try {
    const res = await getHotArtists(70,20)
    artistList.value = res.data.artists || []
    console.log(res.data)
  } catch (error) {
    console.error('获取歌手列表失败:', error)
  }
}

// 获取入驻歌手
async function fetchRuArtists() {
  try {
    const res = await getHotArtists(10,10) // 获取前10个热门歌手
    ruArtists.value = res.data.artists || []
  } catch (error) {
    console.error('获取入驻歌手失败:', error)
  }
}

// 获取分类歌手
async function fetchArtists() {
  try {
    const res = await getArtistList(
      pageSize.value,
      0,
      type.value,
      area.value,
      initial.value === -1 ? -1 : initial.value
    )
    artists.value = res.data.artists || []
    total.value = res.data.total || 0
    console.log(res.data)
  } catch (error) {
    console.error('获取分类歌手失败:', error)
  }
}


// 处理歌手点击
function handleSingerClick(id) {
  router.push({
    path:'/artist',
    query:{id}
  })
}
</script>

<style lang="less" scoped>

// 右侧歌手内容区
.singer-content {
  flex: 1;
}

.singer-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 2px solid #c20c0c;
}

.singer-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.singer-card {
  width: 140px;
  margin: 0 auto;
}

.singer-avatar {
  width: 140px;
  height: 140px;
  margin-bottom: 10px;
  cursor: pointer;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.singer-avatar:hover .avatar-img {
  transform: scale(1.05);
}

.singer-name {
  display: block;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-align: left;
}

// 响应式设计
@media screen and (max-width: 1200px) {
  .page-container {
    width: 100%;
    padding: 0 20px;
  }
}

@media screen and (max-width: 992px) {
  .singer-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .singer-page {
    flex-direction: column;
  }

  .category-sidebar {
    width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
  }

  .singer-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 576px) {
  .singer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

// 歌手文本列表样式
.divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 8px 0;
  width: 100%;
}

.singer-text-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px 15px;
  margin-top: 20px;
  padding-left: 20px;
}

.singer-text-item {
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.singer-text-name {
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #c20c0c;
  }
}

.singer-hot-icon {
  color: #ff6600;
  font-size: 12px;
  margin-left: 5px;
}

// 响应式调整
@media screen and (max-width: 1200px) {
  .singer-text-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media screen and (max-width: 992px) {
  .singer-text-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .singer-text-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 576px) {
  .singer-text-grid {
    grid-template-columns: 1fr;
  }
}
</style>