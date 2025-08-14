# Vue3 音乐播放器

一个基于 Vue3 和网易云音乐 API 构建的现代化音乐播放应用，提供丰富的音乐体验和直观的用户界面。

## ✨ 功能特点

- 🎵 音乐播放控制：播放、暂停、上一曲、下一曲、进度条拖拽
- 📃 歌单管理：热门榜单展示、歌单详情、歌曲列表
- 👤 歌手信息：歌手列表、歌手详情页
- 💬 评论系统：歌曲评论展示与点赞功能
- 🔍 搜索功能：搜索歌曲、歌手和专辑
- 📱 响应式设计：适配桌面和移动设备
- 🚀 平滑滚动与回到顶部功能
- 🎨 现代化UI：精心设计的界面和动画效果

## 🛠️ 技术栈

- **前端框架**：Vue 3 (Composition API)
- **状态管理**：Pinia
- **路由管理**：Vue Router
- **UI组件库**：Element Plus
- **样式解决方案**：Less
- **构建工具**：Vite
- **HTTP客户端**：Axios
- **API服务**：NeteaseCloudMusicApi

## 🚀 快速开始

### 前置要求
- Node.js v14.0.0+ 和 npm/yarn/pnpm
- Git

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/yourusername/vue3-music.git
cd vue3-music
```

2. 安装依赖
```bash
# 使用npm
npm install

# 或使用yarn
yarn install

# 或使用pnpm
pnpm install
```

3. 启动API服务
```bash
# 进入API目录
cd NeteaseCloudMusicApi

# 安装API依赖
npm install

# 启动API服务
node app.js
```

4. 启动前端开发服务器
# 启动开发服务器
npm run dev
```

5. 在浏览器中访问
```
http://localhost:5173
```

## 📁 项目结构

```
vue3-music/
├── src/
│   ├── api/           # API请求封装
│   ├── assets/        # 静态资源
│   ├── components/    # 可复用组件
│   ├── router/        # 路由配置
│   ├── store/         # 状态管理
│   ├── utils/         # 工具函数
│   └── views/         # 页面组件
├── NeteaseCloudMusicApi/ # 网易云音乐API服务
├── public/            # 公共资源
└── 配置文件           # vite.config.js, package.json等
```

## 🔧 自定义配置

查看 [Vite 配置参考](https://vitejs.dev/config/).

## 🙏 致谢

- [网易云音乐API](https://github.com/Binaryify/NeteaseCloudMusicApi) - 提供音乐数据支持
- [Vue.js](https://vuejs.org/) - 优秀的前端框架
- [Element Plus](https://element-plus.org/) - 美观的UI组件库
