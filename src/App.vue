<template>
  <router-link>
   <top-nav-bar></top-nav-bar>
  </router-link>
  <router-view />
    <player-bar></player-bar>
</template>

<script setup>
import TopNavBar from './components/TopNavBar.vue'
import PlayerBar from '@/components/PlayerBar.vue'

</script>
<style lang="less">

</style>
