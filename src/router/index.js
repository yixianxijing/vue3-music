import { createRouter, createWebHashHistory } from 'vue-router';
import findMusic from '@/views/findMusic.vue';
import myMusic from '@/views/myMusic.vue';
import myFollows from '@/views/myFollows.vue';
import downLoad from '@/views/downLoad.vue';
import myHome from '@/views/myHome.vue';
import listenSongs from '@/views/listenSongs.vue';
import playList from '@/views/playList.vue';
import reCommend from '@/views/findMusic/reCommend.vue';
import findPlayList from '@/views/findMusic/findPlayList.vue';
import singerList from '@/views/findMusic/singerList.vue';
import topList from '@/views/findMusic/topList.vue';
import singerLists from '@/views/findMusic/singerList/singerLists.vue'
import signedList from '@/views/findMusic/singerList/signedList.vue';
import catSingerList from '@/views/findMusic/singerList/catSingerList.vue';
import artist from '@/views/artistList.vue';
import { useUserStore } from '../store/index.js';
import { storeToRefs } from 'pinia'

const routes = [
    { path:'/', 
      component: findMusic,
      redirect:'/discover/recommend',
      children:[
        { path:'/discover/recommend', component: reCommend },
        { path:'/discover/playlist', component: findPlayList },
        { path:'/discover/singerlist',
          component: singerList,
          redirect:'/discover/singerlist/singerlist',
          children:[
            { path:'/discover/singerlist/singerlist', component: singerLists },
            { path:'/discover/singerlist/signed', component: signedList },
            { path:'/discover/singerlist/cat/:id', component: catSingerList }
          ]
        },
        { path:'/discover/toplist', component: topList }
      ]
    },
    { path:'/my', component: myMusic },
    { path:'/friend', component: myFollows },
    { path:'/download', component: downLoad },
    { path:'/home', component: myHome },
    { path:'/song', component: listenSongs },
    { path:'/playlist', component: playList },
    { path:'/artist', component: artist }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0 }
  }
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const { isLogin } = storeToRefs(userStore);
  const requiresAuth = ['/my', '/friend'].includes(to.path)
  if (requiresAuth && !isLogin.value) {
    // 未登录，跳转到登录页面
    const loginDialog = document.querySelector('.login-item .link')
    if (loginDialog) {
      loginDialog.click()
    }
    next(false)
  } else {
    next()
  }
})

export default router
