<template>
  <div class="download-container">
    <!-- 标题区域 -->
    <div class="header">
      <h1 class="title">网易云音乐 · 发现好音乐</h1>
      <p class="subtitle">1.5亿高品质歌曲有声内容</p>
    </div>

    <!-- 应用展示区域 -->
    <div class="app-preview">
      <img src="http://pic.danji100.com/upload/2022-4/2022040610123210671.png" alt="网易云音乐PC端" class="app-img">
    </div>

    <!-- 下载按钮区域 -->
    <div class="download-buttons">
      <button class="btn-primary">下载PC端</button>
      <button class="btn-secondary">下载其他端</button>
    </div>
  </div>
</template>

<script setup>


</script>

<style scoped>
.download-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #23060B;
  color: #fff;
  padding: 20px;
  text-align: center;
}

.header {
  margin-bottom: 50px;
}

.title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
}

.app-preview {
  margin-bottom: 60px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  overflow: hidden;
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.app-preview:hover {
  transform: translateY(-10px);
}

.app-img {
  max-width: 100%;
  height: auto;
  display: block;
}

.download-buttons {
  display: flex;
  gap: 20px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 36px;
  border-radius: 30px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  outline: none;
}

.btn-primary {
  background-color: #fff;
  color: #d33a31;
  font-weight: bold;
}

.btn-primary:hover {
  background-color: #f0f0f0;
  transform: scale(1.05);
}

.btn-secondary {
  background-color: transparent;
  color: #fff;
  border: 1px solid #fff;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .title {
    font-size: 28px;
  }
  .subtitle {
    font-size: 16px;
  }
  .download-buttons {
    flex-direction: column;
    gap: 15px;
  }
  .btn-primary,
  .btn-secondary {
    width: 240px;
  }
}
</style>