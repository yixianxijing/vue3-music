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

      </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllHotArtlists } from '@/api/artist.js'

const router = useRouter()


// 状态管理
const ruArtists = ref([]) //入驻歌手

// 初始化数据
onMounted(() => {
  fetchRuArtists()
})

// 获取入驻歌手
async function fetchRuArtists() {
  try {
    const res = await getAllHotArtlists() // 获取前10个热门歌手
    ruArtists.value = res.data.artists || []
    console.log(res.data)
  } catch (error) {
    console.error('获取入驻歌手失败:', error)
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
</style>