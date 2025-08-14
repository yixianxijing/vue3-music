<template>
      <!-- 右侧歌手展示区域 -->
      <div class="singer-content">
        <!-- 分类歌手列表 -->
        <div class="singer-section">
          <h2 class="section-title">{{ currentCategory }}</h2>
          <!-- 字母索引 -->
        <div class="alphabet-index">
          <span @click="handleInitialChange(-1)" :class="{ 'active': initialValue === -1 }">{{ '热门' }}</span>
          <span v-for="char in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')" :key="char" @click="handleInitialChange(char)" :class="{ 'active': initialValue === char }">{{ char }}</span>
          <span @click="handleInitialChange('0')" :class="{ 'active': initialValue === 0 }">{{ '其他' }}</span>
        </div>
        <div class="singer-grid">
          <div class="singer-card" v-for="singer in artists" :key="singer.id">
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { getArtistList } from '@/api/artist.js'
import { useArtistStore } from '@/store/artist.js'

const router = useRouter()
const route = useRoute()
const artistStore = useArtistStore()

// 状态管理
const artists = ref([])   // 分类歌手
const artistList = ref([])
const total = ref(0)      // 总数据量
const pageSize = ref(10) // 每页数量

// 从路由参数获取分类ID
const categoryId = computed(() => route.params.id || '1001')

// 根据分类ID确定当前分类名称
const currentCategory = computed(() => {
  const categories = {
    '1001': '华语男歌手',
    '1002': '华语女歌手',
    '1003': '华语组合/乐队',
    '2001': '欧美男歌手',
    '2002': '欧美女歌手',
    '2003': '欧美组合/乐队',
    '6001': '日本男歌手',
    '6002': '日本女歌手',
    '6003': '日本组合/乐队',
    '7001': '韩国男歌手',
    '7002': '韩国女歌手',
    '7003': '韩国组合/乐队',
    '4001': '其他男歌手',
    '4002': '其他女歌手',
    '4003': '其他组合/乐队'
  }

  return categories[categoryId.value] || '歌手分类'
})

// 筛选条件
const { type, area, initial } = storeToRefs(artistStore)

const initialValue = ref(initial.value)

// 初始化数据
onMounted(() => {
  fetchArtists()
  fectchArtistList()
})

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
  } catch (error) {
    console.error('获取分类歌手失败:', error)
  }
}


async function fectchArtistList() {
  try {
    const res = await getArtistList(
      70,
      10,
      type.value,
      area.value,
      initial.value === -1 ? -1 : initial.value
    )
    artistList.value = res.data.artists || []
  } catch (error) {
    console.error('获取歌手列表失败:', error)
  }
}

function handleInitialChange(newinitial) {
  // 更新本地状态
  initialValue.value = newinitial
  artistStore.setInitial(newinitial)
}

// 处理歌手点击
function handleSingerClick(id) {
  router.push({
    path:'/artist',
    query:{id}
  })
}

// 监听路由参数变化，重置字母索引为热门
watch([() => route.params.id], (newParams, oldParams) => {
  if (newParams[0] !== oldParams[0]) {
    // 分类切换时，重置为热门选项
    initialValue.value = -1
    artistStore.setInitial(-1)
  }

  fetchArtists()
  fectchArtistList()
})

watch([type, area, initial], () => {
  fetchArtists()
  fectchArtistList()
})
</script>

<style lang="less" scoped>
// 右侧歌手内容区
.singer-content {
  flex: 1;
}

.singer-section {
  margin-bottom: 40px;
}

.alphabet-index {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  padding: 10px 0;
  background-color: #f5f5f5;
}

.alphabet-index span {
  padding: 5px 10px;
  cursor: pointer;
  color: #333;
}

.alphabet-index span.active {
  color: #c20c0c;
  font-weight: bold;
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