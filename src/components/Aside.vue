<template>
    <div class="a-side">
        <div class="m-list">
            <h2 class="ff">云音乐特色榜</h2>
            <ul class="fcb">
                <li 
                    v-for="item in ytopListName" 
                    :key="item.id" 
                    :class="{ 'active': selectedId === item.id }"
                    @click="handleSelect(item.id)"
                >
                    <div class="cover-content">
                        <div class="cover">
                            <img width="40px" height="40px" :src="item.coverImgUrl" alt="">
                        </div>
                        <div class="cnt">
                            <div class="cntc m-into">
                                <div class="hd">
                                    <h2>{{ item.name }}</h2>
                                </div>
                                <div class="user">{{ item.updateFrequency }}</div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <h2 class="ff">全球媒体榜</h2>
                <ul class="fcb">
                <li 
                    v-for="item in qtopListName" 
                    :key="item.id" 
                    :class="{ 'active': selectedId === item.id }"
                    @click="handleSelect(item.id)"
                >
                    <div class="cover-content">
                        <div class="cover">
                            <img width="40px" height="40px" :src="item.coverImgUrl" alt="">
                        </div>
                        <div class="cnt">
                            <div class="cntc m-into">
                                <div class="hd">
                                    <h2>{{ item.name }}</h2>
                                </div>
                                <div class="user">{{ item.updateFrequency }}</div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import {  getTop } from '@/api/music.js'
import { ref, onMounted } from 'vue'
import {useRouter, useRoute} from 'vue-router'
import { watch } from 'vue'
const router = useRouter()
const route = useRoute()
// 获取榜单
const ytopListName = ref([])
const qtopListName = ref([])
const selectedId = ref(null)

const getTopListName = async () => {
  const res = await getTop()
  ytopListName.value = res.data.list.slice(0,4)
  qtopListName.value = res.data.list.slice(4,63)
  // 只有在没有路由参数时才设置默认选中
  if (ytopListName.value.length > 0 && !route.query.id) {
    selectedId.value = ytopListName.value[0].id
  }
}

const handleSelect = (id) => {
  selectedId.value = id
  router.push(`/discover/toplist?id=${id}`)
}

onMounted(async () => {
  await getTopListName()
  // 等待数据加载完成后检查路由参数
  if (route.query.id) {
    selectedId.value = Number(route.query.id)
  }
})

// 监听路由参数变化
watch(
  () => route.query.id,
  (newId) => {
    if (newId) {
      selectedId.value = Number(newId)
    }
  }
)
</script>

<style lang="less" scoped>
.m-list h2{
    padding: 0 10px 12px 15px;
    font-size: 14px;
    color: #000;
}
.m-list li{
    padding: 10px 0 10px 20px;
    position: relative;
    zoom: 1;
    height: 42px;
}

.m-list li.active {
    background-color: #e6e6e6;
}

.cover-content {
    display: flex;
    align-items: center;
}

.cover {
    margin-right: 10px; // 减少图片与内容的间距，让名字往左移动
}

.cnt {
    float: none;
    width: auto;
    margin-top: 0;
    .cntc {
        width: 150px;
        overflow: hidden;
        margin-top: 0; // 重置上边距保证上下对齐
        margin-bottom: 0; // 重置下边距保证上下对齐
    }
    h2 {
        line-height: 20px; // 调整行高保证上下对齐
        font-size: 14px;
        font-weight: normal;
        padding-left: 0;
        padding-bottom: 4px;
        // 添加以下样式，实现标题超长隐藏
        white-space: nowrap;
        overflow: hidden;
        text-overflow: clip;
    }
    .user {
        margin: 0;
        line-height: 20px; // 调整行高保证上下对齐
        color: #999;
    }
}
</style>