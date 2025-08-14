<template>
  <div class="common-layout">
    <el-container>
      <el-container>
        <el-main>
            <div class="comment-top">
              <h3><span class="list-title">动态</span></h3>
            </div>           
            <el-empty
            description="暂时还没有动态"
            />
        </el-main>
        <el-aside width="200px">
            <div class="left-part">
                <div class="r-user">
                    <div class="user-info">
                    <img :src="detailList.avatarUrl" alt="" @click="musicStore.handleHome(userStore.uid)">
                    <h5 @click="musicStore.handleHome(userStore.uid)">{{ detailList.nickname }}</h5>
                </div>
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
            </div>
        </el-aside>
      </el-container>
      <el-footer></el-footer>
    </el-container>
  </div>
  <Footer></Footer>
</template>

<script setup>
import { ref } from 'vue'
import { getUserDetail } from '../api/user'
import { useUserStore } from '../store/index.js'
import { useMusicStore } from '../store/music.js'
import Footer from '../components/Footer.vue'
const userStore = useUserStore()
const musicStore = useMusicStore()
// 获取动态
const detailList = ref([])
const getDetailList = async () =>{
  const res = await getUserDetail(userStore.uid)
  detailList.value = res.data.profile
  console.log(detailList.value)
}

getDetailList()
</script>

<style lang="less" scoped>
.common-layout {
  width: 980px;
  margin: 0 auto;
  height: 100vh;
  position: relative; /* 添加相对定位 */
}

.comment-top{
  height: 33px;
  border-bottom: 2px solid #c20c0c;
  padding-bottom: 2px;
  margin-top: 20px;
}
.list-title{
  float: left;
  margin-top: 9px;
}

.left-part {
    padding: 20px 10px 10px 10px;
    .r-user {
        position: relative;
        height: 193px;
        text-align: center;
        .user-info {
            display: flex; 
            align-items: center; 
            gap: 10px; 
            margin-bottom: 15px; 
        }
        img {
        width: 62px;
        height: 62px;
        padding: 2px;
        background: #fff;
        border: 1px solid #dadada;
        margin: 0; 
        cursor: pointer;
      }

      h5 {
        margin: 0; 
        font-size: 16px;
        cursor: pointer;
      }
    }
    ul {
        position: absolute;
        top: 100px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        list-style: none;
        li {
            display: flex;
            flex-direction: column;
            align-items: center; 
            margin: 0 10px;
            border-left: 1px solid #c2c2c2;
            flex: 1; 
            &:first-child {
                border-left: none; 
            }
            
            em {
                font-size: 20px;
                font-family: Arial;
                padding-left: 10px;
                font-style: normal;
            }
            i {
                font-size: 12px;
                padding-top: 4px;
                display: inline;
                white-space: nowrap;
                padding-left: 10px;
                font-style: normal;
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
</style>
