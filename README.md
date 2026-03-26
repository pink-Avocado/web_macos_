# macOS Desktop Web 还原

一款基于 Web 的 macOS 风格虚拟桌面，以熟悉的交互体验无缝管理云端存储
## ✨ 特性

### 核心功能
- 🖥️ **完整桌面环境** - 包含菜单栏、Dock 栏和桌面图标
- 🪟 **窗口管理系统** - 支持多窗口、拖拽、最小化、关闭
- 🎨 **毛玻璃效果** - 使用 backdrop-filter 实现真实的毛玻璃材质
- ⚡ **流畅动画** - 窗口打开、hover 效果等平滑过渡
- 🎯 **深度交互** - 完整还原 macOS 的交互体验

### 内置应用

#### 1. **Finder** - 文件管理器
- 侧边栏导航（收藏夹、iCloud、标签）
- 网格视图和列表视图切换
- 面包屑导航
- 文件预览

#### 2. **Safari** - 浏览器
- 地址栏和导航控制
- 多标签页管理
- 书签收藏页面
- 模拟网页浏览

#### 3. **Notes** - 备忘录
- 笔记列表侧边栏
- 富文本编辑器
- 实时预览更新
- 创建新笔记

#### 4. **Calendar** - 日历
- 月视图日历
- 事件显示
- 日期选择
- 今日高亮

#### 5. **Settings** - 系统设置
- 多面板设置界面
- 外观主题设置
- Dock 自定义
- 其他系统配置

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 🛠️ 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **样式**: CSS3（毛玻璃、渐变、动画）
- **设计系统**: 自定义 CSS 变量和令牌

## 🎨 设计亮点

1. **最新 macOS Sequoia 风格**
   - 动态壁纸背景
   - 半透明毛玻璃效果
   - 现代化的配色方案

2. **精致的交互细节**
   - Dock 图标 hover 放大效果
   - 窗口拖拽和层级管理
   - 平滑的过渡动画

3. **高度还原**
   - 真实的窗口控制按钮（红黄绿）
   - 实时时钟显示
   - 应用运行指示器

## 📁 项目结构

```
mac/
├── src/
│   ├── App.vue              # 主应用组件
│   ├── style.css            # 全局样式和设计令牌
│   ├── components/
│   │   ├── MenuBar.vue      # 顶部菜单栏
│   │   ├── Dock.vue         # 底部 Dock 栏
│   │   ├── DesktopIcons.vue # 桌面图标
│   │   ├── Window.vue       # 窗口组件
│   │   └── apps/            # 内置应用
│   │       ├── FinderApp.vue
│   │       ├── SafariApp.vue
│   │       ├── NotesApp.vue
│   │       ├── CalendarApp.vue
│   │       └── SettingsApp.vue
│   └── main.ts
└── public/
    └── wallpaper.png        # 桌面壁纸
```

## 🎯 未来规划

- [ ] 添加更多内置应用（邮件、照片等）
- [ ] 实现拖拽文件图标功能
- [ ] 添加右键菜单系统
- [ ] 实现通知中心
- [ ] 添加 Spotlight 搜索
- [ ] 支持主题切换（亮色/暗色模式）
- [ ] 从 macosicongallery.com 集成真实图标

## 📝 开发说明

### 添加新应用

1. 在 `src/components/apps/` 创建新应用组件
2. 在 `App.vue` 的 `appConfigs` 中注册应用
3. 在 `Dock.vue` 的 `apps` 数组中添加图标
4. 在 `Window.vue` 的 `contentComponent` 中导入组件

### 自定义样式

所有设计令牌定义在 `src/style.css` 的 `:root` 中，包括：
- 颜色方案
- 间距系统
- 边框圆角
- 过渡动画
- 毛玻璃效果

## 📄 许可证

MIT License

---

**注意**: 此项目仅供学习和演示使用，所有设计元素均致敬 macOS 系统。
