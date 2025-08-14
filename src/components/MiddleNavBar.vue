<template>
    <div class="middle-nav-wrapper">
        <ul class="sub-nav">
                    <li class="first-item"><span><router-link to="/discover/recommend" class="nav-link"><em>推荐</em></router-link></span></li>
                    <li><span><router-link to="/discover/toplist" class="nav-link"><em>排行榜</em></router-link></span></li>
                    <li><span><router-link to="/discover/playlist" class="nav-link"><em>歌单</em></router-link></span></li>
                    <li><span><router-link to="/discover/singerlist" class="nav-link"><em>歌手</em></router-link></span></li>    
        </ul>
    </div>
</template>

<script>
    
</script>
<style lang="less" scoped>
em {
    font-style: normal;
}

.middle-nav-wrapper {
    width: 100%;
    background-color: #C62F2F; /* 网易云标志性红色 */
}

.sub-nav {
    display: flex;
    list-style-type: none;
    padding: 0;
    margin: 0 auto;
    max-width: 1200px; 
    gap: 35px;
}

.first-item {
     margin-left: 385px;
}

.sub-nav li span a {
    display: block;
    padding: 10px 15px;
    color: white;
    text-decoration: none;
    font-size: 14px;
    border-radius: 13px; /* 添加圆角 */
}

.sub-nav li span a:hover {
    background-color: #9b0909;
}

.sub-nav li span a.router-link-active {
  background-color: #9b0909;
}
</style>