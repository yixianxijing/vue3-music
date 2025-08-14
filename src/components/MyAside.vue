<template>
    <div class="a-side">
        <div class="m-list">
            <el-collapse expand-icon-position="left">
            <el-collapse-item title="创建的歌单" name="1">
                <ul class="fcb">
                    <li 
                    v-for="item in usercMusicList" 
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
                                <div class="user">{{ item.trackCount }}首歌</div>
                            </div>
                        </div>
                    </div>
                    </li>
                </ul>
            </el-collapse-item>
            </el-collapse>
            <el-collapse expand-icon-position="left">
            <el-collapse-item title="收藏的歌单" name="1" class="h2-title">
                <ul class="fcb">
                <li 
                    v-for="item in usersMusicList" 
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
                                <div class="user">{{ item.trackCount }}首歌 by {{ item.creator.nickname }}</div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {useRouter} from 'vue-router'
import { getUserList } from '../api/music.js'
import { useUserStore } from '@/store/index.js'

const router = useRouter()
const userStore = useUserStore()
// 获取榜单

const selectedId = ref(null)
const usercMusicList = ref([]) 
const usersMusicList = ref([])
const getUsersList = async () => {
  const res = await getUserList(userStore.uid)
  res.data.playlist.forEach(element =>{
    if(element.creator.userId == userStore.uid){
      usercMusicList.value.push(element)
    }
    else{
      usersMusicList.value.push(element)
    }
  })
  // console.log(usercMusicList.value)
}

onMounted(() => {
  getUsersList()
})

const handleSelect = (id) => {
  selectedId.value = id
  router.push(`/my?id=${id}`)
}

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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: clip;
    }
    .user {
        margin: 0;
        line-height: 20px; // 调整行高保证上下对齐
        color: #999;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: clip;
    }
}
</style>