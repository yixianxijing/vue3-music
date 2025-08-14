<template>
<link rel="stylesheet" href="//at.alicdn.com/t/c/font_4977349_1gfrs0fsvws.css" />
    <div class="m-top">
    <div class="top-bar">
        <h1 class="logo">
            <a href="/#">网易云音乐</a>
        </h1>
        <ul class="m-nav">
            <li>
                <span><router-link to="/" class="nav-link"><em>发现音乐</em></router-link></span>
                <div v-if="isDiscoverActive" class="active-triangle"></div>
            </li>
            <li>
                <span><router-link to="/my" class="nav-link"><em>我的音乐</em></router-link></span>
            </li>
            <li>
                <span><router-link to="/friend" class="nav-link"><em>关注</em></router-link></span>
            </li>
            <li>
                <span><router-link to="/download" class="nav-link"><em>下载客户端</em></router-link></span>
            </li>
            <li class="search-item">
                    <div class="m-srch">
                        <div class="srchbg">
                            <span class="parent">
                                <el-input
                                    v-model="input"
                                    style="width: 240px"
                                    size="small"
                                    placeholder="音乐/视频"
                                    :prefix-icon="Search"
                                    />
                            </span>
                        </div>
                    </div>
                </li>
                <li class="login-item">
                    <template v-if="isLogin">
                        <div class="avatar-container" >
                        <el-avatar :src="userAvatar || circleUrl" class="user-avatar" @click="toggleDropdown"></el-avatar>
                        <!-- 下拉菜单 -->
                            <div class="user-dropdown" v-if="showDropdown"  @click.stop>
                                <div class="dropdown-item" @click="goToProfile"><i class="iconfont icon-user"></i> 我的主页</div>
                                <div class="dropdown-item" @click="logout"><i class="iconfont icon-logout"></i> 退出登录</div>
                            </div>
                        </div>
                    </template>
                    <a href="#" class="link" @click="openLoginDialog" v-else><em>登录</em></a>
                </li>
        </ul>
    </div>
    <MiddleNavBar v-if="isDiscoverActive" />
    </div>
    <LoginDialog ref="loginDialogRef" />
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import {ref, computed } from 'vue'
import { onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MiddleNavBar from './MiddleNavBar.vue'
import LoginDialog from './LoginDialog.vue'
import { useUserStore } from '../store/index.js'
import { storeToRefs } from 'pinia'
import { useMusicStore } from '../store/music.js'

const userStore = useUserStore()
const { isLogin, userAvatar } = storeToRefs(userStore)
const musicStore = useMusicStore()
const route = useRoute()
const router = useRouter()
const input = ref('')
const loginDialogRef = ref(null)
const showDropdown = ref(false)

// 计算属性：判断当前路由是否属于"发现音乐"模块
const isDiscoverActive = computed(() => {
    return route.path === '/' || route.path.startsWith('/discover')
})

const openLoginDialog = () => {
  loginDialogRef.value.openLoginDialog()
}

// 添加点击外部关闭下拉菜单的功能
function handleClickOutside(event: MouseEvent) {
  const avatarContainer = document.querySelector('.avatar-container')
  const dropdown = document.querySelector('.user-dropdown')

  if (
    avatarContainer && !avatarContainer.contains(event.target as Node) &&
    dropdown && !dropdown.contains(event.target as Node)
  ) {
    showDropdown.value = false
  }
}

// 切换下拉菜单显示状态
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// 组件挂载时添加事件监听
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 前往个人主页
const goToProfile = () => {
    console.log('用户ID:', userStore.uid)
    musicStore.handleHome(userStore.uid)
    showDropdown.value = false
}

// 退出登录
const logout = () => {
    showDropdown.value = false
    userStore.logout()
    router.push('/')
}
</script>

<style lang="less" scoped>
.m-top {
    background: #242424;
    border-bottom: 1px solid #000;
}
.top-bar{
    position: relative;
    // 移除固定宽度，让元素自适应
    // width: 1100px;
    width: fit-content;
    margin: 0 auto;
    z-index: 1000;
    height: 70px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
}

.m-nav {
    display: flex;
    align-items: center;
}

.m-nav li{
    position: relative;
    background-position: right -300px;
    display: flex;
    align-items: center;
}

.m-nav a {
    display: block;
    padding: 0 19px;
    text-align: center;
    line-height: 70px;
    font-style: normal;
    
}

.m-nav a:hover{
    background-color: #000;
    color: inherit;
}
.search-item {
    display: flex;
    align-items: center;
}

.login-item .link {
    padding: 0 19px;
    text-align: center;
    line-height: 70px;
    font-style: normal;
}

.m-top .logo a {
    float: left;
    width: 157px;
    height: 100%;
    padding-right: 20px;
}
em {
    font-style: normal;
}
.m-srch .parent input {
    border-radius: 16px;
    height: 20px;
    padding: 0 20px; /* 添加内边距，为图标留出空间 */
}

.m-nav li span a.router-link-active {
  background-color: #000;
  color: inherit;
}

/* 发现音乐激活状态的小三角 */
.discover-music {
    position: relative;
}

.active-triangle {
    position: absolute;
    bottom: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #C62F2F; /* 与红色导航栏颜色一致 */
    z-index: 1001;
}

// 添加头像专用样式
.user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-left: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.2s ease;
}

.user-avatar:hover {
    transform: scale(1.05);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
}

// 下拉菜单样式
.user-dropdown {
    position: absolute;
    top: 42px;
    right: 0;
    width: 160px;
    background-color: #333;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 2000;
    padding: 5px 0;
}

.dropdown-item {
    height: 36px;
    line-height: 36px;
    padding: 0 20px;
    color: #ccc;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
}

.dropdown-item:hover {
    background-color: #444;
    color: #fff;
}

.dropdown-item i {
    margin-right: 10px;
    font-size: 16px;
}
</style>